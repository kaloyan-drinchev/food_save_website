# Docker + Hostinger VPS Playbook

This is a reusable step-by-step guide for deploying a frontend website to a Hostinger VPS with Docker, Docker Compose, Nginx, and Let's Encrypt SSL.

It is written so you can reuse it for future projects by changing the placeholder values.

## 1. What this setup does

- Builds your app into a Docker image
- Runs the app in a container on the VPS
- Exposes the app only on `127.0.0.1:8080`
- Uses Nginx on the VPS as the public reverse proxy
- Uses Certbot to install and renew SSL certificates

Recommended architecture:

```text
Internet -> Hostinger VPS Nginx -> Docker container -> App
```

## 2. Placeholder values to replace

Before using this on a new project, replace these values:

- `<project-name>`: example `food-save-website`
- `<project-dir>`: example `/var/www/food-save-website`
- `<domain>`: example `foodsave.tech`
- `<www-domain>`: example `www.foodsave.tech`
- `<container-port>`: usually `80`
- `<host-port>`: example `8080`

## 3. Files you need in the project

For a static frontend app such as Vite, Vue, or React, you usually need these files:

- `Dockerfile`
- `nginx.conf`
- `docker-compose.yml`

### Example Dockerfile for a Vite frontend

```Dockerfile
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS production

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Example Nginx config inside the container

Use this when your app is a SPA with client-side routing.

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location /assets/ {
    try_files $uri =404;
    access_log off;
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Example docker-compose.yml

This keeps the app private on the VPS and lets host Nginx handle public traffic.

```yaml
services:
  <project-name>:
    container_name: <project-name>
    image: <project-name>:latest
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    ports:
      - '127.0.0.1:8080:80'
```

## 4. Prepare the VPS

These steps assume Ubuntu 24.04 on Hostinger.

Important:

- Do not mix Ubuntu's `docker.io` package with Docker's official repo packages.
- If the Docker apt repository is enabled, install `docker-ce`, `docker-ce-cli`, and `containerd.io`.

Run:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg nginx certbot python3-certbot-nginx
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo systemctl enable --now nginx
```

Verify installation:

```bash
docker --version
docker compose version
sudo systemctl status docker --no-pager
sudo systemctl status nginx --no-pager
```

If you previously installed the wrong Docker packages and got a conflict, clean them up with:

```bash
sudo apt remove -y docker.io docker-doc docker-compose podman-docker containerd runc
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Optional, to use Docker without `sudo`:

```bash
sudo usermod -aG docker $USER
```

Then reconnect to the VPS.

## 5. Upload or clone the project to the VPS

Clone the repository:

```bash
git clone <repository-url> <project-dir>
cd <project-dir>
```

Or upload the project manually, then move into the directory:

```bash
cd <project-dir>
```

## 6. Start the app container

From the project directory:

```bash
docker compose up -d --build
docker compose ps
curl http://127.0.0.1:8080
```

Expected result:

- The container is running
- `curl http://127.0.0.1:8080` returns your app HTML

If it fails, inspect logs:

```bash
docker compose logs -f
```

## 7. Point the domain to the VPS

In Hostinger DNS, create these records:

- `A` record for `@` -> your VPS public IP
- `A` record for `www` -> your VPS public IP

Wait for the domain to resolve before requesting SSL.

## 8. Configure Nginx on the VPS

Create the Nginx site file:

```bash
sudo tee /etc/nginx/sites-available/<project-name> > /dev/null <<'EOF'
server {
  listen 80;
  server_name <domain> <www-domain>;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
EOF
```

Enable the site:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/<project-name> /etc/nginx/sites-enabled/<project-name>
sudo nginx -t
sudo systemctl reload nginx
```

## 9. Install SSL with Let's Encrypt

After DNS is working:

```bash
sudo certbot --nginx -d <domain> -d <www-domain>
```

Certbot will usually:

- install the certificate
- update the Nginx site
- add HTTPS redirect if you choose it

## 10. Open firewall ports if needed

If `ufw` is enabled:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw reload
```

## 11. Updating the project later

When you deploy a new version:

```bash
cd <project-dir>
git pull
docker compose up -d --build
```

Useful checks:

```bash
docker compose ps
docker compose logs -f
sudo nginx -t
sudo systemctl status nginx --no-pager
```

## 12. Using a separate API subdomain

If the frontend will call a backend on a different subdomain, for example `api.foodsave.tech`, use this pattern:

- frontend site stays on `https://foodsave.tech`
- API stays on `https://api.foodsave.tech`
- do not proxy `/api/v1` through the main frontend Nginx site unless you explicitly want a same-origin setup

Frontend setup:

```env
VITE_API_BASE_URL=https://api.foodsave.tech/api/v1
```

Backend requirements:

- `api.foodsave.tech` must have a valid SSL certificate
- the backend must allow CORS from `https://foodsave.tech`
- the backend should also allow CORS from `https://www.foodsave.tech` if you serve both domains

Frontend redeploy after changing the API URL:

```bash
cd <project-dir>
git pull
docker compose up -d --build
```

## 13. Troubleshooting

### Docker package conflict on Ubuntu

Symptom:

```text
containerd.io : Conflicts: containerd
```

Cause:

- `docker.io` from Ubuntu repo was mixed with Docker's official packages

Fix:

```bash
sudo apt remove -y docker.io docker-doc docker-compose podman-docker containerd runc
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### Nginx fails to reload

Check:

```bash
sudo nginx -t
sudo systemctl status nginx --no-pager -l
```

### Container is not serving the app

Check:

```bash
docker compose ps
docker compose logs -f
curl http://127.0.0.1:8080
```

### SSL fails

Check:

- the domain points to the VPS public IP
- Nginx is reachable on port 80
- the site config uses the correct domain names

Test DNS from the VPS:

```bash
dig +short <domain>
dig +short <www-domain>
```

## 14. FoodSave example

For this project, the real values are:

- `<project-name>` -> `food-save-website`
- `<project-dir>` -> `/var/www/food-save-website`
- `<domain>` -> `foodsave.tech`
- `<www-domain>` -> `www.foodsave.tech`

### FoodSave deploy commands

```bash
cd /var/www/food-save-website
docker compose up -d --build
docker compose ps
curl http://127.0.0.1:8080
```

### FoodSave Nginx site

```bash
sudo tee /etc/nginx/sites-available/food-save-website > /dev/null <<'EOF'
server {
  listen 80;
  server_name foodsave.tech www.foodsave.tech;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
EOF

sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/food-save-website /etc/nginx/sites-enabled/food-save-website
sudo nginx -t
sudo systemctl reload nginx
```

### FoodSave SSL command

```bash
sudo certbot --nginx -d foodsave.tech -d www.foodsave.tech
```
