#!/usr/bin/env bash
#
# دیپلوی ردوبز روی یک VPS شخصی از طریق SSH.
#
# پیش‌نیازهای یک‌باره روی سرور (قبل از اولین اجرای این اسکریپت):
#   1. نصب Node.js (نسخه ۲۰ به بالا) و git
#   2. نصب pm2 به صورت گلوبال: npm install -g pm2
#   3. کلون اولیه ریپو در مسیر DEPLOY_PATH: git clone <repo-url> <deploy-path>
#   4. ساخت فایل .env در همان مسیر (بر اساس .env.example) با مقادیر واقعی —
#      به‌خصوص JWT_SECRET قوی، ADMIN_PASSWORD، و COOKIE_SECURE="true" اگر
#      سایت پشت HTTPS (مثلاً از طریق Nginx + Certbot) سرو می‌شود.
#   5. اطمینان از این‌که DATABASE_PATH در .env روی مسیری با دیسک دائمی است.
#
# استفاده:
#   VPS_HOST=1.2.3.4 VPS_USER=deploy DEPLOY_PATH=/var/www/redwebs ./deploy.sh
# یا مقادیر پیش‌فرض زیر را مستقیماً ویرایش کنید.

set -euo pipefail

VPS_USER="${VPS_USER:-root}"
VPS_HOST="${VPS_HOST:-your-server-ip-or-domain}"
VPS_PORT="${VPS_PORT:-22}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/redwebs}"
GIT_BRANCH="${GIT_BRANCH:-main}"
HEALTH_URL="${HEALTH_URL:-http://localhost:3000/api/health}"

if [ "$VPS_HOST" = "your-server-ip-or-domain" ]; then
  echo "❌ VPS_HOST تنظیم نشده. یا آن را در بالای این فایل ویرایش کنید یا به‌صورت متغیر محیطی پاس دهید."
  exit 1
fi

SSH_TARGET="${VPS_USER}@${VPS_HOST}"

echo "==> بررسی تغییرات کامیت‌نشده..."
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠  تغییرات کامیت‌نشده وجود دارد. ابتدا commit/push کنید و دوباره اجرا کنید."
  exit 1
fi

echo "==> پوش کردن آخرین تغییرات به origin/${GIT_BRANCH}..."
git push origin "$GIT_BRANCH"

echo "==> اتصال به ${SSH_TARGET} و دیپلوی..."
ssh -p "$VPS_PORT" "$SSH_TARGET" bash -s <<REMOTE_SCRIPT
set -euo pipefail
cd "$DEPLOY_PATH"

echo "-- دریافت آخرین تغییرات از گیت"
git fetch origin
git checkout "$GIT_BRANCH"
git reset --hard "origin/$GIT_BRANCH"

echo "-- نصب پکیج‌ها (شامل کامپایل ماژول native برای این سرور)"
npm ci

echo "-- ساخت نسخه پروداکشن"
npm run build

echo "-- راه‌اندازی/ری‌لود با pm2"
pm2 startOrReload ecosystem.config.cjs --env production
pm2 save
REMOTE_SCRIPT

echo "==> بررسی سلامت سرویس پس از دیپلوی..."
sleep 3
if ssh -p "$VPS_PORT" "$SSH_TARGET" "curl -sf $HEALTH_URL" > /dev/null; then
  echo "✅ دیپلوی با موفقیت انجام شد و سرویس سالم است."
else
  echo "❌ سرویس بعد از دیپلوی پاسخ سالم نداد. با 'ssh ${SSH_TARGET} pm2 logs redwebs' لاگ‌ها را بررسی کنید."
  exit 1
fi
