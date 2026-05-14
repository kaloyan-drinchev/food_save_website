# VPS Deployment Guide

This project ships as a Docker container and is intended to run behind Nginx on a Hostinger VPS.

## 1. Prepare the VPS

These steps assume an Ubuntu 24.04 Hostinger VPS.

Do not mix Ubuntu's `docker.io` package with Docker's official repository packages. If your server already has `https://download.docker.com/linux/ubuntu` configured, install `docker-ce` packages instead of `docker.io`.

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

Verify the install:

```bash
docker --version
docker compose version
```

If you previously tried `docker.io` and still hit package conflicts, remove the distro Docker packages and reinstall the Docker repo packages:

```bash
sudo apt remove -y docker.io docker-doc docker-compose podman-docker containerd runc
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

If you want to run Docker without `sudo`, add your user to the Docker group and reconnect:

```bash
sudo usermod -aG docker $USER
```

## 2. Upload the project

Clone the repository or upload the project files to the VPS:

```bash
git clone <your-repository-url> /var/www/food-save-website
cd /var/www/food-save-website
```

## 3. Start the website container

Build and run the container with Docker Compose:

```bash
docker compose up -d --build
docker compose ps
curl http://127.0.0.1:8080
```

The site container listens on `127.0.0.1:8080` on the VPS and serves the app through Nginx inside the container.

## 4. Point your domain to the VPS

In Hostinger DNS, create or update these records:

- `A` record for `@` pointing to your VPS public IP
- `A` record for `www` pointing to your VPS public IP

Wait for DNS propagation before requesting the SSL certificate.

## 5. Configure Nginx on the VPS

Copy the provided site config and replace `your-domain.com` with your real domain:

```bash
sudo cp docs/hostinger-nginx.conf /etc/nginx/sites-available/food-save-website
sudo nano /etc/nginx/sites-available/food-save-website
```

Enable the site and reload Nginx:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/food-save-website /etc/nginx/sites-enabled/food-save-website
sudo nginx -t
sudo systemctl reload nginx
```

## 5a. When the API moves to `api.foodsave.tech`

Do not proxy the API through the main `foodsave.tech` Nginx site. Keep the main site config focused on the frontend only.

When the new API subdomain is ready:

- create a DNS record for `api.foodsave.tech`
- install SSL for that API domain on the backend server
- update the frontend production env to `VITE_API_BASE_URL=https://api.foodsave.tech/api/v1`
- redeploy the frontend container with `docker compose up -d --build`
- allow CORS on the API for `https://foodsave.tech` and `https://www.foodsave.tech`

## 6. Enable SSL with Let's Encrypt

After the domain resolves to the VPS, request and install the certificate:

```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Certbot will update the Nginx config to redirect HTTP to HTTPS and install the SSL certificate.

## 7. Open firewall ports

If `ufw` is enabled, allow SSH, HTTP, and HTTPS:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw reload
```

## 8. Deploy updates later

When you change the app, redeploy with:

```bash
cd /var/www/food-save-website
git pull
docker compose up -d --build
```

## 9. Useful checks

```bash
docker compose logs -f
docker compose ps
sudo nginx -t
sudo systemctl status nginx
```
