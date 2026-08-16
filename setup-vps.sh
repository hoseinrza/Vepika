#!/usr/bin/env bash
#
# راه‌اندازی اولیه (bootstrap) یک VPS اوبونتو/دبیان تازه برای اجرای ردوبز.
# این اسکریپت را فقط یک‌بار روی سرور جدید اجرا کنید؛ بعد از آن برای هر
# دیپلوی بعدی از deploy.sh (که از روی سیستم خودتان اجرا می‌شود) استفاده کنید.
#
# کاری که انجام می‌دهد:
#   1. نصب Node.js 20 (از طریق NodeSource) و git
#   2. نصب pm2 به‌صورت گلوبال
#   3. کلون ریپو در مسیر DEPLOY_PATH
#   4. ساخت فایل .env نمونه از .env.example (باید بعداً دستی مقداردهی شود)
#   5. نصب پکیج‌ها، build نسخه پروداکشن و اجرای اولیه با pm2
#
# استفاده روی سرور (به‌عنوان root یا کاربری با دسترسی sudo):
#   curl -fsSL https://raw.githubusercontent.com/<user>/<repo>/main/setup-vps.sh | bash -s -- <repo-url> [deploy-path]
#
# مثال:
#   curl -fsSL https://raw.githubusercontent.com/hoseinrza/Vepika/main/setup-vps.sh \
#     | bash -s -- https://github.com/hoseinrza/Vepika.git /var/www/redwebs

set -euo pipefail

REPO_URL="${1:-}"
DEPLOY_PATH="${2:-/var/www/redwebs}"
GIT_BRANCH="${GIT_BRANCH:-main}"

if [ -z "$REPO_URL" ]; then
  echo "❌ آدرس ریپو مشخص نشده."
  echo "استفاده: bash setup-vps.sh <repo-url> [deploy-path]"
  exit 1
fi

SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  SUDO="sudo"
fi

echo "==> نصب پیش‌نیازهای پایه (curl, git)..."
$SUDO apt-get update -y
$SUDO apt-get install -y curl git

if ! command -v node > /dev/null 2>&1; then
  echo "==> نصب Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | $SUDO bash -
  $SUDO apt-get install -y nodejs
else
  echo "==> Node.js از قبل نصب است: $(node -v)"
fi

if ! command -v pm2 > /dev/null 2>&1; then
  echo "==> نصب pm2..."
  $SUDO npm install -g pm2
else
  echo "==> pm2 از قبل نصب است: $(pm2 -v)"
fi

if [ -d "$DEPLOY_PATH/.git" ]; then
  echo "==> ریپو از قبل در $DEPLOY_PATH وجود دارد، رد شدن از کلون."
else
  echo "==> کلون ریپو در $DEPLOY_PATH..."
  $SUDO mkdir -p "$(dirname "$DEPLOY_PATH")"
  git clone --branch "$GIT_BRANCH" "$REPO_URL" "$DEPLOY_PATH"
fi

cd "$DEPLOY_PATH"

if [ ! -f .env ]; then
  echo "==> ساخت .env نمونه از .env.example..."
  cp .env.example .env
  echo "⚠  حتماً قبل از رفتن به حالت پروداکشن، فایل .env در $DEPLOY_PATH را ویرایش کنید"
  echo "   (به‌خصوص JWT_SECRET، ADMIN_PASSWORD و COOKIE_SECURE)."
fi

echo "==> نصب پکیج‌ها..."
npm ci

echo "==> ساخت نسخه پروداکشن..."
npm run build

echo "==> اجرای سرویس با pm2..."
pm2 startOrReload ecosystem.config.cjs --env production
pm2 save
pm2 startup systemd -u "$(whoami)" --hp "$HOME" | tail -n 1 || true

echo ""
echo "✅ راه‌اندازی اولیه کامل شد."
echo "   قبل از استفاده واقعی، حتماً $DEPLOY_PATH/.env را ویرایش و سرویس را ری‌استارت کنید:"
echo "   pm2 restart redwebs --update-env"
echo ""
echo "   از این به بعد برای دیپلوی تغییرات جدید، از روی سیستم خودتان ./deploy.sh را اجرا کنید."
