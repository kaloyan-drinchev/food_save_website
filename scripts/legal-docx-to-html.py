#!/usr/bin/env python3
"""
Convert the lawyer's B2C .docx drafts in docs/b2c_docs/ into the HTML
fragments the legal pages render (src/content/legal/*.html).

    python3 scripts/legal-docx-to-html.py

Standard library only. When a new revision of a document arrives, drop it
into docs/b2c_docs/, point SOURCES at it and re-run; review the diff.
"""
import html
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'docs' / 'b2c_docs'
OUT = ROOT / 'src' / 'content' / 'legal'

SOURCES = {
    'terms': 'ЧЕРНОВА- B2C- Общи условия за ползване (Terms & Conditions).docx',
    'privacy': 'ЧЕРНОВА- B2C- ПОЛИТИКА ЗА ПОВЕРИТЕЛНОСТ (PRIVACY POLICY).docx',
    'cookies': 'ЧЕРНОВА- B2C- ПОЛИТИКА ЗА БИСКВИТКИТЕ И СХОДНИТЕ ТЕХНО- ЛОГИИ (COOKIE & TRACKING POLICY).docx',
}

# The documents are published exactly as the legal team wrote them: no
# sentence is dropped and no wording "corrected" here. Fix the .docx instead
# and re-run. (Only the layout is converted: the title goes to the page hero
# and links between the documents become in-site links.)
DROP = []
FIXES = {}

# The one deliberate difference from the .docx: the "last updated" date in the
# terms is the day the text went live here, not the date typed in the draft.
# Update it whenever a new revision is published.
LAST_UPDATED = '06.10.2026'

# Cross-references between the three documents become in-site links.
CROSS_LINKS = [
    (r'Политика(?:та)? за поверителност(?! на )', '/privacy'),
    (r'Политика(?:та)? за бисквитките и сходните технологии', '/cookies'),
]

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'


def relationships(zf):
    rels = ET.fromstring(zf.read('word/_rels/document.xml.rels'))
    own_site = {'http://www.foodsave.tech/': 'https://www.foodsave.tech/'}
    return {r.get('Id'): own_site.get(r.get('Target'), r.get('Target'))
            for r in rels if r.get('TargetMode') == 'External'}


def run_html(run):
    """One <w:r>: its text, <br> for line breaks, wrapped in <strong> if bold."""
    parts = []
    for node in run:
        if node.tag == W + 't':
            parts.append(html.escape(node.text or '', quote=False))
        elif node.tag == W + 'br':
            parts.append('<br>')
        elif node.tag == W + 'tab':
            parts.append(' ')
    text = ''.join(parts)
    bold = run.find(f'{W}rPr/{W}b')
    if bold is not None and bold.get(W + 'val') not in ('0', 'false') and text.strip():
        return f'<strong>{text}</strong>'
    return text


def paragraph_html(p, links):
    out = []
    for node in p:
        if node.tag == W + 'r':
            out.append(run_html(node))
        elif node.tag == W + 'hyperlink':
            inner = ''.join(run_html(r) for r in node.iter(W + 'r'))
            href = links.get(node.get(R + 'id'))
            if href and inner.strip():
                external = '' if 'foodsave.tech' in href else ' target="_blank" rel="noopener"'
                out.append(f'<a href="{html.escape(href)}"{external}>{inner}</a>')
            else:
                out.append(inner)
    s = ''.join(out)
    s = s.replace('</strong><strong>', '')
    s = re.sub(r'\s*<br>\s*', '<br>', s).replace('<br></strong>', '</strong><br>')
    s = re.sub(r'<br>\s+', '<br>', s)
    return re.sub(r'[  ]{2,}', ' ', s).strip()


def plain(s):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', s)).strip()


def is_bold_heading(p, text):
    """Section titles set as bold body text ("5. Оферти и …")."""
    return bool(re.match(r'\d+\.\s', plain(text))) and text.startswith('<strong>') and text.endswith('</strong>') \
        and text.count('<strong>') == 1 and len(plain(text)) < 120


def convert(name, path):
    with zipfile.ZipFile(path) as zf:
        links = relationships(zf)
        body = ET.fromstring(zf.read('word/document.xml')).find(W + 'body')

    blocks = []
    list_items = []
    seen_section = False

    def flush_list():
        if list_items:
            blocks.append('<ul>\n' + '\n'.join(f'  <li>{li}</li>' for li in list_items) + '\n</ul>')
            list_items.clear()

    for el in body:
        if el.tag == W + 'p':
            text = paragraph_html(el, links)
            ppr = el.find(W + 'pPr')
            style = ppr.find(W + 'pStyle') if ppr is not None else None
            style = style.get(W + 'val') if style is not None else ''
            numbered = ppr is not None and ppr.find(W + 'numPr') is not None
            if not plain(text):
                continue
            if numbered:
                list_items.append(text)
                continue
            flush_list()
            heading = style in ('Heading1', 'Heading2') or is_bold_heading(el, text)
            is_title = heading or (text.startswith('<strong>') and text.endswith('</strong>')
                                   and html.unescape(plain(text)).upper() == html.unescape(plain(text)))
            if is_title and not re.match(r'\d', plain(text)) and not seen_section:
                continue  # the document title — the page hero shows it
            if heading:
                seen_section = True
                blocks.append(f'<h2>{plain(text)}</h2>')
            elif style == 'Heading3':
                blocks.append(f'<h3>{plain(text)}</h3>')
            else:
                blocks.append(f'<p>{text}</p>')
        elif el.tag == W + 'tbl':
            flush_list()
            rows = []
            for i, tr in enumerate(el.iter(W + 'tr')):
                cells = ['<br>'.join(t for t in (paragraph_html(p, links) for p in tc.iter(W + 'p')) if plain(t))
                         for tc in tr.findall(W + 'tc')]
                if i == 0:
                    rows.append('<thead><tr>' + ''.join(f'<th>{plain(c)}</th>' for c in cells) + '</tr></thead>')
                else:
                    rows.append('<tr>' + ''.join(f'<td>{c}</td>' for c in cells) + '</tr>')
            head, body_rows = rows[0], rows[1:]
            blocks.append(f'<div class="legal-table">\n<table>\n{head}\n<tbody>\n' + '\n'.join(body_rows)
                          + '\n</tbody>\n</table>\n</div>')
    flush_list()

    doc = '\n'.join(blocks)
    for text in DROP:
        doc = doc.replace(text, '')
    doc = re.sub(r'<p>\s*</p>\n?', '', doc)
    for old, new in FIXES.items():
        doc = doc.replace(old, new)
    doc = re.sub(r'(Последна актуализация:\s*)\d{2}\.\d{2}\.\d{4}', rf'\g<1>{LAST_UPDATED}', doc)
    doc = linkify(doc, name)
    return doc + '\n'


def outside_anchors(doc, fn):
    """Apply fn to the text that is not already inside an <a>…</a>."""
    parts = re.split(r'(<a\b.*?</a>)', doc, flags=re.S)
    return ''.join(p if p.startswith('<a') else fn(p) for p in parts)


def linkify(doc, name):
    doc = outside_anchors(doc, lambda s: s.replace(
        'contact@foodsave.tech', '<a href="mailto:contact@foodsave.tech">contact@foodsave.tech</a>'))
    doc = outside_anchors(doc, lambda s: s.replace(
        'www.foodsave.tech', '<a href="https://www.foodsave.tech/">www.foodsave.tech</a>'))
    doc = outside_anchors(doc, lambda s: s.replace(
        'www.cpdp.bg', '<a href="https://cpdp.bg/" target="_blank" rel="noopener">www.cpdp.bg</a>'))
    for pattern, route in CROSS_LINKS:
        if route == f'/{name}':
            continue
        doc = outside_anchors(doc, lambda s: re.sub(pattern, lambda m: f'<a href="{route}">{m.group(0)}</a>', s))
    return doc


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, filename in SOURCES.items():
        path = SRC / filename
        if not path.exists():
            sys.exit(f'missing: {path}')
        (OUT / f'{name}.bg.html').write_text(convert(name, path), encoding='utf-8')
        print(f'{name}: {OUT / f"{name}.bg.html"}')


if __name__ == '__main__':
    main()
