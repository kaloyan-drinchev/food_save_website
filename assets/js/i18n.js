/**
 * FoodSave Website — Internationalization
 * Supported locales: 'en' (English), 'bg' (Bulgarian)
 *
 * Usage (in main.js):
 *   I18n.setLang('bg');
 *   I18n.t('hero.title');
 */

const I18n = (() => {
  'use strict';

  const translations = {
    /* ─────────────────────────────────────────────────────────
       ENGLISH
    ───────────────────────────────────────────────────────── */
    en: {
      nav: {
        about: 'How It Works',
        download: 'Download',
        privacy: 'Privacy Policy',
        terms: 'Terms & Conditions',
        contact: 'Contact',
      },

      hero: {
        badge: 'Now Available',
        title1: 'Save Your Next',
        title2: 'Meal',
        subtitle:
          'Discover surplus food from local restaurants and stores at up to 70% off — while reducing food waste in your neighbourhood.',
        cta_download: 'Download the App',
        cta_learn: 'How It Works',
        stat1_value: '70%',
        stat1_label: 'Discount up to',
        stat2_value: '500+ kg',
        stat2_label: 'Food saved',
        stat3_value: '∞',
        stat3_label: 'Local partners',
      },

      about: {
        label: 'How It Works',
        title: 'Three Steps to Save Food',
        subtitle:
          'FoodSave connects customers with local businesses that have surplus food at the end of the day — quick, simple, and impactful.',
        step1_num: 'Step 01',
        step1_icon: '🔍',
        step1_title: 'Discover',
        step1_desc:
          'Browse restaurants, bakeries, and stores nearby that have listed their food for today.',
        step2_num: 'Step 02',
        step2_icon: '🛍️',
        step2_title: 'Reserve',
        step2_desc:
          'Choose a surprise bag or a specific item and reserve it at up to 70% off the original price.',
        step3_num: 'Step 03',
        step3_icon: '✅',
        step3_title: 'Pick Up',
        step3_desc:
          'Collect your order within the pick-up window. Enjoy great food and help reduce food waste.',
      },

      download: {
        label: 'Get the App',
        title: 'Download FoodSave',
        subtitle:
          'Available in two versions — one for customers looking for great deals, and one for businesses ready to reduce their food waste.',
        client_title: 'For Customers',
        client_desc:
          'Find and reserve discounted surplus food from local restaurants and stores near you. Save money, eat well, and help the planet.',
        business_title: 'For Business Owners',
        business_desc:
          'List your surplus food in minutes, reach nearby customers, and cut food waste — while generating extra revenue at the end of the day.',
        play_label: 'Get it on',
        play_store: 'Google Play',
        apple_label: 'Download on the',
        apple_store: 'App Store',
        coming_soon: 'Coming Soon',
      },

      privacy: {
        label: 'Legal',
        title: 'Privacy Policy',
        subtitle: 'Last updated: March 2, 2026',
        content: `
<h2>1. Introduction</h2>
<p>FoodSave ("we", "our", or "us") operates the FoodSave mobile application and this website. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.</p>
<p>By using FoodSave, you agree to the collection and use of information in accordance with this policy.</p>

<h2>2. Information We Collect</h2>
<h3>2.1 Information You Provide</h3>
<ul>
  <li><strong>Account data:</strong> name, email address, and password when you register.</li>
  <li><strong>Profile data:</strong> optional profile photo and preferences.</li>
  <li><strong>Business data (for business owners):</strong> business name, address, contact details, and food listing information.</li>
  <li><strong>Communications:</strong> messages you send to our support team.</li>
</ul>
<h3>2.2 Information Collected Automatically</h3>
<ul>
  <li><strong>Location data:</strong> approximate location (with your permission) to show nearby listings.</li>
  <li><strong>Device data:</strong> device type, operating system, app version, and unique device identifiers.</li>
  <li><strong>Usage data:</strong> features used, pages visited, and interactions within the app.</li>
  <li><strong>Log data:</strong> IP address, browser type, and timestamps.</li>
</ul>

<h2>3. How We Use Your Information</h2>
<ul>
  <li>To create and manage your account.</li>
  <li>To display nearby surplus food listings relevant to your location.</li>
  <li>To process reservations and facilitate pick-up.</li>
  <li>To send important service notifications and, with your consent, promotional messages.</li>
  <li>To improve the app and diagnose technical issues.</li>
  <li>To comply with legal obligations.</li>
</ul>

<h2>4. Sharing Your Information</h2>
<p>We do not sell your personal data. We may share information with:</p>
<ul>
  <li><strong>Partner businesses:</strong> only the information needed to fulfil a reservation (e.g., your name for pick-up confirmation).</li>
  <li><strong>Service providers:</strong> hosting, analytics, and notification services acting on our behalf.</li>
  <li><strong>Legal authorities:</strong> when required by law or to protect our rights.</li>
</ul>

<h2>5. Data Retention</h2>
<p>We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time.</p>

<h2>6. Your Rights</h2>
<p>Depending on your jurisdiction, you may have the right to:</p>
<ul>
  <li>Access the personal data we hold about you.</li>
  <li>Request correction of inaccurate data.</li>
  <li>Request deletion of your data.</li>
  <li>Object to or restrict certain processing.</li>
  <li>Data portability.</li>
</ul>
<p>To exercise any of these rights, contact us at <a href="mailto:privacy@foodsave.app">privacy@foodsave.app</a>.</p>

<h2>7. Security</h2>
<p>We implement industry-standard security measures to protect your data, including encryption in transit (HTTPS) and at rest. No method of transmission over the internet is 100% secure; we cannot guarantee absolute security.</p>

<h2>8. Children's Privacy</h2>
<p>FoodSave is not directed at children under 16. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us.</p>

<h2>9. Changes to This Policy</h2>
<p>We may update this Privacy Policy periodically. We will notify you of significant changes via the app or email. Continued use of FoodSave after changes constitutes acceptance of the updated policy.</p>

<h2>10. Contact</h2>
<p>For privacy-related questions, contact us at <a href="mailto:privacy@foodsave.app">privacy@foodsave.app</a>.</p>
        `,
        updated: 'Last updated: March 2, 2026',
      },

      terms: {
        label: 'Legal',
        title: 'Terms & Conditions',
        subtitle: 'Last updated: March 2, 2026',
        content: `
<h2>1. Acceptance of Terms</h2>
<p>By downloading or using the FoodSave application ("App") or visiting this website, you agree to be bound by these Terms & Conditions ("Terms"). If you do not agree, please do not use our services.</p>

<h2>2. Description of Service</h2>
<p>FoodSave is a digital platform that connects consumers ("Customers") with local food businesses ("Partners") that have surplus food available for purchase at a reduced price. FoodSave facilitates this connection but is not a food retailer or food producer.</p>

<div class="disclaimer-box">
  <p><strong>⚠️ Important Disclaimer — Food Quality:</strong><br>
  FoodSave acts solely as an intermediary platform connecting Customers with Partner businesses. <strong>FoodSave bears no responsibility, express or implied, for the quality, safety, freshness, allergen content, or condition of any food items listed, reserved, or collected through the platform.</strong> The responsibility for the food items rests entirely with the Partner business that prepares and offers them. Customers are advised to inspect food items upon collection and raise any concerns directly with the Partner. Customers with food allergies or dietary restrictions must verify ingredients directly with the Partner before reserving.</p>
</div>

<h2>3. User Accounts</h2>
<h3>3.1 Registration</h3>
<p>To use FoodSave, you must register an account and provide accurate, current information. You are responsible for maintaining the confidentiality of your login credentials.</p>
<h3>3.2 Eligibility</h3>
<p>You must be at least 16 years of age to create a Customer account. Business accounts require the registrant to be legally authorised to act on behalf of the business.</p>

<h2>4. Customer Obligations</h2>
<ul>
  <li>Reserve items only if you genuinely intend to collect them.</li>
  <li>Collect reserved items within the indicated pick-up window.</li>
  <li>Treat Partner staff with respect during collection.</li>
  <li>Do not attempt to return collected items to FoodSave — any disputes regarding food quality must be raised directly with the Partner business.</li>
</ul>

<h2>5. Partner (Business Owner) Obligations</h2>
<ul>
  <li>List only food that complies with applicable food safety and hygiene regulations.</li>
  <li>Accurately describe listed items, including the presence of common allergens.</li>
  <li>Honour all confirmed reservations made through the platform.</li>
  <li>Maintain valid food handling permits and comply with local health authority requirements.</li>
  <li>Accept full responsibility for the food items they list and provide.</li>
</ul>

<h2>6. Payments and Refunds</h2>
<p>Payments are processed through the App at the time of reservation. Refunds may be issued at FoodSave's discretion in cases where a Partner fails to honour a confirmed reservation. FoodSave does not issue refunds on the basis of food quality, taste, or personal preference — such disputes are between the Customer and the Partner.</p>

<h2>7. Prohibited Uses</h2>
<p>You may not use FoodSave to:</p>
<ul>
  <li>List or purchase non-food items.</li>
  <li>Engage in fraudulent reservations or misrepresent your identity.</li>
  <li>Resell food items purchased through the platform for commercial gain.</li>
  <li>Violate any applicable local, national, or international law.</li>
  <li>Abuse, harass, or threaten other users or Partners.</li>
</ul>

<h2>8. Limitation of Liability</h2>
<p>To the maximum extent permitted by applicable law, FoodSave shall not be liable for:</p>
<ul>
  <li>Any illness, injury, allergic reaction, or harm resulting from consumption of food obtained through the platform.</li>
  <li>The failure of a Partner to honour a reservation.</li>
  <li>Any indirect, incidental, or consequential damages arising from use of the service.</li>
  <li>Loss of data, revenue, or goodwill.</li>
</ul>
<p>FoodSave's total aggregate liability to you shall not exceed the amount paid by you through the platform in the three (3) months preceding the claim.</p>

<h2>9. Intellectual Property</h2>
<p>The FoodSave name, logo, and all related trademarks are the property of FoodSave. You may not use them without prior written permission.</p>

<h2>10. Governing Law</h2>
<p>These Terms are governed by the laws of the Republic of Bulgaria. Disputes shall be subject to the exclusive jurisdiction of the courts of Sofia, Bulgaria.</p>

<h2>11. Changes to Terms</h2>
<p>We reserve the right to modify these Terms at any time. We will notify users of material changes via the App or email. Continued use of the platform after changes constitutes acceptance.</p>

<h2>12. Contact</h2>
<p>Questions regarding these Terms may be sent to <a href="mailto:legal@foodsave.app">legal@foodsave.app</a>.</p>
        `,
        updated: 'Last updated: March 2, 2026',
      },

      contact: {
        label: 'Get in Touch',
        title: 'Contact Us',
        subtitle:
          "Have questions, feedback, or need support? We'd love to hear from you.",
        email_title: 'Email Support',
        email_value: 'support@foodsave.app',
        business_title: 'Business Partnerships',
        business_value: 'partners@foodsave.app',
        legal_title: 'Legal & Privacy',
        legal_value: 'legal@foodsave.app',
        social_title: 'Follow Us',
        social_value: 'Coming soon on social media',
      },

      footer: {
        tagline: 'Reducing food waste, one meal at a time.',
        privacy: 'Privacy Policy',
        terms: 'Terms & Conditions',
        contact: 'Contact',
        copy: '© 2026 FoodSave. All rights reserved.',
      },

      legal: {
        back: 'Back to Home',
      },
    },

    /* ─────────────────────────────────────────────────────────
       BULGARIAN
    ───────────────────────────────────────────────────────── */
    bg: {
      nav: {
        about: 'Как работи',
        download: 'Изтегли',
        privacy: 'Поверителност',
        terms: 'Условия',
        contact: 'Контакт',
      },

      hero: {
        badge: 'Вече достъпно',
        title1: 'Спаси следващото си',
        title2: 'Ястие',
        subtitle:
          'Открий излишна храна от местни ресторанти и магазини с до 70% отстъпка — и намали хранителните отпадъци в квартала си.',
        cta_download: 'Изтегли приложението',
        cta_learn: 'Как работи',
        stat1_value: '70%',
        stat1_label: 'Отстъпка',
        stat2_value: '500+ кг',
        stat2_label: 'Спасена храна',
        stat3_value: '∞',
        stat3_label: 'Местни партньори',
      },

      about: {
        label: 'Как работи',
        title: 'Три стъпки за спасяване на храна',
        subtitle:
          'FoodSave свързва клиенти с местни бизнеси, които имат излишна храна в края на деня — бързо, лесно и с реален ефект.',
        step1_num: 'Стъпка 01',
        step1_icon: '🔍',
        step1_title: 'Открий',
        step1_desc:
          'Разгледай ресторанти, пекарни и магазини наблизо, които са добавили своята храна за днес.',
        step2_num: 'Стъпка 02',
        step2_icon: '🛍️',
        step2_title: 'Резервирай',
        step2_desc:
          'Избери изненадваща кутия или конкретна оферта и я запази с до 70% отстъпка от оригиналната цена.',
        step3_num: 'Стъпка 03',
        step3_icon: '✅',
        step3_title: 'Вземи',
        step3_desc:
          'Прибери поръчката си в рамките на определения прозорец. Наслади се на вкусна храна и помогни за намаляване на отпадъците.',
      },

      download: {
        label: 'Вземи приложението',
        title: 'Изтегли FoodSave',
        subtitle:
          'Достъпно в две версии — за клиенти, търсещи изгодни оферти, и за бизнеси, готови да намалят хранителните си отпадъци.',
        client_title: 'За клиенти',
        client_desc:
          'Намери и резервирай намалена излишна храна от местни ресторанти и магазини наблизо. Спести пари, яж добре и помогни на планетата.',
        business_title: 'За собственици на бизнес',
        business_desc:
          'Добави своята излишна храна за минути, достигни близки клиенти и намали хранителните отпадъци — генерирай допълнителен приход в края на деня.',
        play_label: 'Изтегли от',
        play_store: 'Google Play',
        apple_label: 'Изтегли от',
        apple_store: 'App Store',
        coming_soon: 'Очаквайте скоро',
      },

      privacy: {
        label: 'Правна информация',
        title: 'Политика за поверителност',
        subtitle: 'Последна актуализация: 2 март 2026 г.',
        content: `
<h2>1. Въведение</h2>
<p>FoodSave ("ние", "нашият" или "нас") управлява мобилното приложение FoodSave и настоящия уебсайт. Тази Политика за поверителност обяснява как събираме, използваме и защитаваме вашата лична информация при използване на нашите услуги.</p>
<p>Като използвате FoodSave, вие се съгласявате със събирането и използването на информация в съответствие с тази политика.</p>

<h2>2. Информация, която събираме</h2>
<h3>2.1 Информация, предоставена от вас</h3>
<ul>
  <li><strong>Данни за акаунт:</strong> име, имейл адрес и парола при регистрация.</li>
  <li><strong>Данни за профил:</strong> профилна снимка и предпочитания (по желание).</li>
  <li><strong>Бизнес данни (за собственици):</strong> наименование на бизнеса, адрес, данни за контакт и информация за обявите.</li>
  <li><strong>Комуникации:</strong> съобщения, изпратени до нашия екип за поддръжка.</li>
</ul>
<h3>2.2 Автоматично събирана информация</h3>
<ul>
  <li><strong>Данни за местоположение:</strong> приблизително местоположение (с ваше разрешение) за показване на близки обяви.</li>
  <li><strong>Данни за устройство:</strong> тип устройство, операционна система, версия на приложението и уникален идентификатор.</li>
  <li><strong>Данни за използване:</strong> използвани функции, посетени страници и взаимодействия в приложението.</li>
  <li><strong>Лог данни:</strong> IP адрес, тип браузър и времеви отпечатъци.</li>
</ul>

<h2>3. Как използваме вашата информация</h2>
<ul>
  <li>За създаване и управление на вашия акаунт.</li>
  <li>За показване на близки обяви за излишна храна.</li>
  <li>За обработка на резервации и улесняване на вземането.</li>
  <li>За изпращане на важни известия и — с вашето съгласие — промоционални съобщения.</li>
  <li>За подобряване на приложението и диагностициране на технически проблеми.</li>
  <li>За спазване на правни задължения.</li>
</ul>

<h2>4. Споделяне на вашата информация</h2>
<p>Ние не продаваме вашите лични данни. Може да споделяме информация с:</p>
<ul>
  <li><strong>Партньорски бизнеси:</strong> само информация, необходима за изпълнение на резервацията.</li>
  <li><strong>Доставчици на услуги:</strong> хостинг, аналитика и услуги за известия, действащи от наше името.</li>
  <li><strong>Правни органи:</strong> когато се изисква от закона или за защита на нашите права.</li>
</ul>

<h2>5. Съхранение на данни</h2>
<p>Ние съхраняваме личните ви данни, докато акаунтът ви е активен или до изпълнение на услугите. По всяко време можете да поискате изтриване на акаунта и свързаните с него данни.</p>

<h2>6. Вашите права</h2>
<p>В зависимост от юрисдикцията ви, може да имате право на:</p>
<ul>
  <li>Достъп до личните данни, които съхраняваме за вас.</li>
  <li>Коригиране на неточни данни.</li>
  <li>Изтриване на данните ви.</li>
  <li>Възражение или ограничаване на обработването.</li>
  <li>Преносимост на данните.</li>
</ul>
<p>За упражняване на тези права се свържете с нас на <a href="mailto:privacy@foodsave.app">privacy@foodsave.app</a>.</p>

<h2>7. Сигурност</h2>
<p>Прилагаме стандартни за индустрията мерки за сигурност, включително криптиране при пренос (HTTPS) и при съхранение. Нито един метод за предаване по интернет не е 100% сигурен; не можем да гарантираме абсолютна сигурност.</p>

<h2>8. Поверителност на децата</h2>
<p>FoodSave не е предназначена за деца под 16 години. Ние не събираме съзнателно лични данни от деца. Ако смятате, че дете ни е предоставило лични данни, моля, свържете се с нас.</p>

<h2>9. Промени в тази политика</h2>
<p>Може периодично да актуализираме Политиката за поверителност. Ще ви уведомяваме за съществени промени чрез приложението или имейл. Продължаването на използването след промените означава приемане на актуализираната политика.</p>

<h2>10. Контакт</h2>
<p>За въпроси, свързани с поверителността, се свържете с нас на <a href="mailto:privacy@foodsave.app">privacy@foodsave.app</a>.</p>
        `,
        updated: 'Последна актуализация: 2 март 2026 г.',
      },

      terms: {
        label: 'Правна информация',
        title: 'Общи условия',
        subtitle: 'Последна актуализация: 2 март 2026 г.',
        content: `
<h2>1. Приемане на условията</h2>
<p>С изтеглянето или използването на приложението FoodSave ("Приложение") или посещаването на този уебсайт, вие се съгласявате да спазвате настоящите Общи условия ("Условия"). Ако не сте съгласни, моля, не използвайте нашите услуги.</p>

<h2>2. Описание на услугата</h2>
<p>FoodSave е цифрова платформа, която свързва потребители ("Клиенти") с местни хранителни бизнеси ("Партньори"), разполагащи с излишна храна за продажба на намалена цена. FoodSave улеснява тази връзка, но не е хранителен търговец или производител.</p>

<div class="disclaimer-box">
  <p><strong>⚠️ Важна забележка — Качество на храната:</strong><br>
  FoodSave действа единствено като посредническа платформа, свързваща Клиенти с Партньорски бизнеси. <strong>FoodSave не носи никаква отговорност, изрична или подразбираща се, за качеството, безопасността, свежестта, алергенното съдържание или състоянието на каквито и да са хранителни продукти, обявени, резервирани или взети чрез платформата.</strong> Отговорността за хранителните продукти е изцяло на Партньорския бизнес, който ги приготвя и предлага. При вземането на поръчката Клиентите се препоръчва да проверят продуктите и да отправят евентуални притеснения директно към Партньора. Клиенти с хранителни алергии или диетични ограничения трябва да проверят съставките директно с Партньора преди резервация.</p>
</div>

<h2>3. Потребителски акаунти</h2>
<h3>3.1 Регистрация</h3>
<p>За да използвате FoodSave, трябва да се регистрирате с акаунт и да предоставите точна, актуална информация. Вие отговаряте за поверителността на данните си за вход.</p>
<h3>3.2 Допустимост</h3>
<p>За да създадете Клиентски акаунт, трябва да сте навършили 16 години. За Бизнес акаунт регистриращият трябва да е законово упълномощен да действа от името на бизнеса.</p>

<h2>4. Задължения на клиентите</h2>
<ul>
  <li>Резервирайте продукти само ако наистина ще ги вземете.</li>
  <li>Вземайте резервираните продукти в посочения прозорец за вземане.</li>
  <li>Отнасяйте се с уважение към персонала на Партньора при вземането.</li>
  <li>Не опитвайте да върнете взетите продукти на FoodSave — споровете относно качеството на храната трябва да бъдат отправени директно към Партньорския бизнес.</li>
</ul>

<h2>5. Задължения на партньорите (собственици на бизнес)</h2>
<ul>
  <li>Обявявайте само храна, отговаряща на приложимите разпоредби за безопасност и хигиена на храните.</li>
  <li>Описвайте точно обявените продукти, включително наличието на чести алергени.</li>
  <li>Изпълнявайте всички потвърдени резервации, направени чрез платформата.</li>
  <li>Поддържайте валидни разрешителни за работа с храни и спазвайте изискванията на местните здравни органи.</li>
  <li>Поемайте пълна отговорност за хранителните продукти, които обявявате и предоставяте.</li>
</ul>

<h2>6. Плащания и възстановявания</h2>
<p>Плащанията се обработват чрез Приложението в момента на резервацията. Възстановяванията могат да бъдат извършени по преценка на FoodSave в случаи, когато Партньор не изпълни потвърдена резервация. FoodSave не извършва възстановявания въз основа на качество, вкус или лично предпочитание — такива спорове са между Клиента и Партньора.</p>

<h2>7. Забранени действия</h2>
<p>Забранено е използването на FoodSave за:</p>
<ul>
  <li>Обявяване или закупуване на нехранителни продукти.</li>
  <li>Извършване на измамни резервации или представяне с невярна самоличност.</li>
  <li>Препродажба на закупени чрез платформата продукти с търговска цел.</li>
  <li>Нарушаване на приложимото местно, национално или международно законодателство.</li>
  <li>Злоупотреба, тормоз или заплашване на други потребители или Партньори.</li>
</ul>

<h2>8. Ограничаване на отговорността</h2>
<p>В максималната степен, допустима от приложимото законодателство, FoodSave не носи отговорност за:</p>
<ul>
  <li>Болест, нараняване, алергична реакция или вреда, причинена от консумацията на храна, придобита чрез платформата.</li>
  <li>Неизпълнение от Партньора на резервация.</li>
  <li>Каквито и да е косвени, случайни или последващи щети, произтичащи от използването на услугата.</li>
  <li>Загуба на данни, приходи или репутация.</li>
</ul>
<p>Общата съвкупна отговорност на FoodSave към вас не може да надвишава сумата, платена от вас чрез платформата в трите (3) месеца, предхождащи претенцията.</p>

<h2>9. Интелектуална собственост</h2>
<p>Наименованието FoodSave, логото и всички свързани търговски марки са собственост на FoodSave. Не можете да ги използвате без предварително писмено разрешение.</p>

<h2>10. Приложимо право</h2>
<p>Настоящите Условия се уреждат от законите на Република България. Споровете подлежат на изключителната юрисдикция на съдилищата на гр. София, България.</p>

<h2>11. Промени в условията</h2>
<p>Запазваме си правото да изменяме настоящите Условия по всяко време. Ще уведомяваме потребителите за съществени промени чрез Приложението или имейл. Продължаването на използването след промените означава приемане.</p>

<h2>12. Контакт</h2>
<p>Въпроси относно настоящите Условия могат да бъдат изпратени на <a href="mailto:legal@foodsave.app">legal@foodsave.app</a>.</p>
        `,
        updated: 'Последна актуализация: 2 март 2026 г.',
      },

      contact: {
        label: 'Свържете се с нас',
        title: 'Контакт',
        subtitle:
          'Имате въпроси, обратна връзка или нужда от поддръжка? С удоволствие ще ви отговорим.',
        email_title: 'Поддръжка',
        email_value: 'support@foodsave.app',
        business_title: 'Бизнес партньорства',
        business_value: 'partners@foodsave.app',
        legal_title: 'Правни въпроси',
        legal_value: 'legal@foodsave.app',
        social_title: 'Последвайте ни',
        social_value: 'Очаквайте ни в социалните мрежи',
      },

      footer: {
        tagline: 'Намаляваме хранителните отпадъци, по едно ястие наведнъж.',
        privacy: 'Поверителност',
        terms: 'Общи условия',
        contact: 'Контакт',
        copy: '© 2026 FoodSave. Всички права запазени.',
      },

      legal: {
        back: 'Начална страница',
      },
    },
  };

  /* ── Public API ───────────────────────────────────────────── */
  let currentLang = 'bg';

  function setLang(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
  }

  /**
   * Retrieve a translation value by dot-path key.
   * @example I18n.t('hero.title1') // => "Спаси следващото си"
   */
  function t(key) {
    const parts = key.split('.');
    let val = translations[currentLang];
    for (const p of parts) {
      if (val == null) return key;
      val = val[p];
    }
    return val ?? key;
  }

  function getLang() {
    return currentLang;
  }

  return { t, setLang, getLang };
})();

window.I18n = I18n;
