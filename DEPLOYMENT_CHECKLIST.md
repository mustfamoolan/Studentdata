# ✅ قائمة التحقق السريعة - إعداد السيرفر

## 📋 قبل البدء
- [ ] رفع جميع ملفات المشروع إلى السيرفر
- [ ] إنشاء قاعدة بيانات MySQL
- [ ] تحضير معلومات قاعدة البيانات (اسم، مستخدم، كلمة مرور)
- [ ] الوصول إلى SSH أو File Manager

---

## 🔧 الخطوات الأساسية

### 1. إعداد ملف .env
- [ ] نسخ محتوى `.env.production` إلى `.env` على السيرفر
- [ ] تحديث `APP_URL` بالدومين الصحيح
- [ ] تحديث إعدادات قاعدة البيانات
- [ ] تشغيل `php artisan key:generate --force`

### 2. إعداد التخزين
```bash
# الطريقة الأولى - SSH
chmod +x setup_server.sh
./setup_server.sh
```

```bash
# الطريقة الثانية - يدوياً
rm -rf public/storage
ln -s ../storage/app/public public/storage
```

### 3. إعداد قاعدة البيانات
```bash
php artisan migrate --force
```

### 4. تحسين الأداء
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🧪 اختبار النظام

### 1. اختبار الموقع الأساسي
- [ ] زيارة `https://yourdomain.com`
- [ ] التأكد من ظهور صفحة الترحيب

### 2. اختبار تسجيل الدخول
- [ ] الذهاب إلى `/login`
- [ ] تسجيل الدخول بـ:
  - **البريد**: `admin@example.com`
  - **كلمة المرور**: `password`

### 3. اختبار الصور
- [ ] إضافة طالب جديد مع صورة
- [ ] التأكد من ظهور الصورة في القائمة
- [ ] اختبار نموذج التقديم `/apply`

### 4. اختبار الوظائف
- [ ] إدارة الطلاب
- [ ] إدارة الموظفين
- [ ] استعراض الطلبات
- [ ] رفع الملفات

---

## 🚨 حل المشاكل الشائعة

### الصور لا تظهر
```bash
# تحقق من symlink
ls -la public/storage

# إعادة إنشاء symlink
rm -rf public/storage
ln -s ../storage/app/public public/storage

# تحقق من الصلاحيات
chmod -R 755 storage/
chmod -R 755 public/
```

### خطأ 500
```bash
# تحقق من اللوقر
tail -f storage/logs/laravel.log

# تنظيف الكاش
php artisan config:clear
php artisan cache:clear

# تحقق من APP_KEY
php artisan key:generate --force
```

### مشاكل قاعدة البيانات
```bash
# اختبار الاتصال
php artisan tinker
# ثم: DB::connection()->getPdo();
```

---

## 📞 نصائح مهمة

1. **احتفظ بنسخة احتياطية** من قاعدة البيانات قبل التحديث
2. **تأكد من الصلاحيات** خاصة مجلدات storage و public
3. **راجع logs الأخطاء** في `storage/logs/laravel.log`
4. **استخدم HTTPS** للأمان
5. **فعّل OPcache** على السيرفر لتحسين الأداء

---

## 🎯 الهدف النهائي

✅ نظام إدارة طلاب كامل يعمل على السيرفر مع:
- واجهة حكومية احترافية
- إدارة الطلاب والموظفين
- نموذج تقديم للطلاب الجدد
- نظام رفع الصور والملفات
- تصميم متجاوب لجميع الأجهزة

**🚀 بالتوفيق!**
