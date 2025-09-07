#!/bin/bash

# 🚀 سكريبت إعداد السيرفر - نظام إدارة الطلاب
# تشغيل هذا السكريبت على السيرفر بعد رفع الملفات

echo "🚀 بدء إعداد نظام إدارة الطلاب..."

# 1. تنظيف أي symlinks قديمة
echo "🗑️ حذف symlinks القديمة..."
rm -rf public/storage

# 2. إنشاء symlink جديد
echo "🔗 إنشاء symlink للتخزين..."
ln -s ../storage/app/public public/storage

# 3. إنشاء مجلدات التخزين المطلوبة
echo "📁 إنشاء مجلدات التخزين..."
mkdir -p storage/app/public/students/profiles
mkdir -p storage/app/public/students/documents
mkdir -p storage/app/public/applications/profiles
mkdir -p storage/app/public/applications/passports
mkdir -p storage/app/public/applications/certificates

# 4. تعيين الصلاحيات
echo "🔐 تعيين الصلاحيات..."
chmod -R 755 storage/
chmod -R 755 bootstrap/cache/
chmod -R 755 public/

# تعيين الملكية (قد تحتاج sudo)
if [ "$EUID" -eq 0 ]; then
    chown -R www-data:www-data storage/
    chown -R www-data:www-data bootstrap/cache/
    chown -R www-data:www-data public/
else
    echo "⚠️ تحذير: قد تحتاج لتشغيل هذا السكريبت بصلاحيات sudo لتعيين الملكية"
fi

# 5. تنظيف الكاش
echo "🧹 تنظيف الكاش..."
php artisan config:clear 2>/dev/null || echo "تم تخطي config:clear"
php artisan cache:clear 2>/dev/null || echo "تم تخطي cache:clear"
php artisan route:clear 2>/dev/null || echo "تم تخطي route:clear"
php artisan view:clear 2>/dev/null || echo "تم تخطي view:clear"

# 6. إنشاء APP_KEY إذا لم يكن موجود
echo "🔑 فحص APP_KEY..."
if ! grep -q "APP_KEY=base64:" .env; then
    echo "إنشاء APP_KEY جديد..."
    php artisan key:generate --force
fi

# 7. تشغيل migrations
echo "🗄️ تشغيل migrations..."
php artisan migrate --force

# 8. تحسين الأداء للإنتاج
echo "⚡ تحسين الأداء..."
php artisan config:cache 2>/dev/null || echo "تم تخطي config:cache"
php artisan route:cache 2>/dev/null || echo "تم تخطي route:cache"
php artisan view:cache 2>/dev/null || echo "تم تخطي view:cache"

# 9. فحص symlink
echo "🔍 فحص symlink..."
if [ -L "public/storage" ]; then
    echo "✅ symlink تم إنشاؤه بنجاح"
    ls -la public/storage
else
    echo "❌ فشل في إنشاء symlink"
    echo "📝 جرب الحلول البديلة في الملف SERVER_SETUP_GUIDE.md"
fi

# 10. فحص الصلاحيات
echo "🔍 فحص الصلاحيات..."
echo "صلاحيات storage/:"
ls -ld storage/
echo "صلاحيات public/storage:"
ls -ld public/storage 2>/dev/null || echo "public/storage غير موجود"

echo ""
echo "🎉 انتهى الإعداد!"
echo ""
echo "📋 الخطوات التالية:"
echo "1. تحديث ملف .env بإعدادات قاعدة البيانات"
echo "2. زيارة الموقع للتأكد من عمله"
echo "3. اختبار رفع الصور"
echo ""
echo "📖 للمزيد من التفاصيل، راجع ملف SERVER_SETUP_GUIDE.md"
