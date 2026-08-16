#!/usr/bin/env bash
#
# آپدیت ردوبز روی VPS — این اسکریپت مستقیم روی خود سرور اجرا می‌شه (برخلاف
# deploy.sh که از روی سیستم شخصی اجرا می‌شه). آخرین تغییرات گیت‌هاب رو
# می‌کشه پایین، دوباره build می‌کنه و سرویس رو با pm2 ری‌لود می‌کنه.
#
# استفاده روی سرور:
#   curl -fsSL https://raw.githubusercontent.com/hoseinrza/Vepika/main/update-vps.sh | bash -s -- /var/www/redwebs
#
# اگه مسیر رو ندی، پیش‌فرض /var/www/redwebs در نظر گرفته می‌شه.

set -euo pipefail

DEPLOY_PATH="${1:-/var/www/redwebs}"
GIT_BRANCH="${GIT_BRANCH:-main}"

if [ ! -d "$DEPLOY_PATH/.git" ]; then
  echo "❌ مسیر $DEPLOY_PATH یه ریپوی گیت نیست. اول باید setup-vps.sh رو اجرا کرده باشی."
  exit 1
fi

cd "$DEPLOY_PATH"

echo "==> دریافت آخرین تغییرات از گیت‌هاب..."
git fetch origin
git checkout "$GIT_BRANCH"
git reset --hard "origin/$GIT_BRANCH"

echo "==> نصب پکیج‌ها..."
npm ci

echo "==> ساخت نسخه پروداکشن..."
npm run build

echo "==> ری‌لود سرویس با pm2..."
pm2 startOrReload ecosystem.config.cjs --env production
pm2 save

echo ""
echo "==> بررسی سلامت سرویس..."
sleep 2
if curl -sf http://localhost:3000/api/health > /dev/null; then
  echo "✅ آپدیت با موفقیت انجام شد و سرویس سالمه."
else
  echo "⚠  سرویس بعد از آپدیت پاسخ سالم نداد. با 'pm2 logs redwebs' لاگ‌ها رو ببین."
  exit 1
fi
