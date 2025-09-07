# 🚀 دليل إعداد السيرفر - نظام إدارة الطلاب

## ❌ المشكلة
```bash
Error: Call to undefined function Illuminate\Filesystem\exec()
```

هذه المشكلة تحدث لأن دالة `exec()` مُعطّلة في hosting servers لأسباب أمنية.

---

## 🔧 **الحل الأول: إنشاء symlink يدوياً**

### 1. اتصل بالسيرفر عبر SSH وانتقل لمجلد المشروع:
```bash
cd public_html
```

### 2. تأكد من حذف أي symlink قديم:
```bash
rm -rf public/storage
```

### 3. إنشاء symlink يدوياً:
```bash
ln -s ../storage/app/public public/storage
```

### 4. تحقق من إنشاء الـ symlink:
```bash
ls -la public/storage
```

يجب أن ترى:
```
lrwxrwxrwx 1 user user 20 Sep 6 12:00 storage -> ../storage/app/public
```

---

## 🔧 **الحل الثاني: استخدام File Manager في cPanel**

### 1. ادخل إلى cPanel > File Manager
### 2. انتقل إلى مجلد `public_html`
### 3. انتقل إلى مجلد `public`
### 4. احذف مجلد `storage` إذا كان موجوداً
### 5. انقر بالزر الأيمن > "Create Symbolic Link"
### 6. املأ الحقول:
   - **Link Path**: `storage`
   - **Target Path**: `../storage/app/public`
### 7. انقر "Create Link"

---

## 🔧 **الحل الثالث: تعديل إعدادات filesystem**

### 1. افتح ملف `config/filesystems.php` وعدّل:
```php
'public' => [
    'driver' => 'local',
    'root' => storage_path('app/public'),
    'url' => env('APP_URL').'/storage',
    'visibility' => 'public',
    'throw' => false,
],
```

### 2. في ملف `.env` على السيرفر، تأكد من:
```
APP_URL=https://yourdomain.com
FILESYSTEM_DISK=public
```

---

## 🔧 **الحل الرابع: نسخ الملفات مباشرة (مؤقت)**

إذا لم تعمل الحلول السابقة، يمكنك نسخ مجلد التخزين:

```bash
cd public_html
cp -r storage/app/public/* public/storage/
```

⚠️ **تحذير**: هذا حل مؤقت، ستحتاج لإعادة النسخ كل مرة تضيف صور جديدة.

---

## 📁 **إعداد مجلدات التخزين**

### تأكد من وجود المجلدات التالية في `storage/app/public/`:

```bash
mkdir -p storage/app/public/students/profiles
mkdir -p storage/app/public/students/documents
mkdir -p storage/app/public/applications/profiles
mkdir -p storage/app/public/applications/passports
mkdir -p storage/app/public/applications/certificates
```

### تعيين الصلاحيات المناسبة:
```bash
chmod -R 755 storage/
chmod -R 755 public/storage/
chown -R www-data:www-data storage/
chown -R www-data:www-data public/storage/
```

---

## 🗄️ **إعداد قاعدة البيانات**

### 1. إنشاء قاعدة البيانات:
- ادخل إلى cPanel > MySQL Databases
- أنشئ قاعدة بيانات جديدة باسم: `studentdata`
- أنشئ مستخدم جديد وأعطه صلاحيات كاملة

### 2. تحديث ملف `.env` على السيرفر:
```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_cpanel_username_studentdata
DB_USERNAME=your_cpanel_username_dbuser
DB_PASSWORD=your_database_password
```

### 3. تشغيل migrations:
```bash
php artisan migrate --force
```

### 4. تشغيل seeders (اختياري):
```bash
php artisan db:seed --force
```

---

## ⚙️ **إعدادات Laravel الأساسية**

### 1. تحديث ملف `.env` على السيرفر:
```env
APP_NAME="نظام إدارة الطلاب"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# قاعدة البيانات
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

# الجلسات
SESSION_DRIVER=database
SESSION_LIFETIME=120

# التخزين
FILESYSTEM_DISK=public

# الكاش
CACHE_STORE=database
```

### 2. إنشاء APP_KEY جديد:
```bash
php artisan key:generate --force
```

### 3. تنظيف الكاش:
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### 4. تحسين الأداء للإنتاج:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🔐 **إعداد الصلاحيات**

### على السيرفر، تأكد من الصلاحيات التالية:

```bash
# صلاحيات المجلدات
chmod -R 755 bootstrap/cache/
chmod -R 755 storage/
chmod -R 755 public/

# ملكية الملفات
chown -R www-data:www-data bootstrap/cache/
chown -R www-data:www-data storage/
chown -R www-data:www-data public/
```

---

## 🧪 **اختبار النظام**

### 1. تأكد من عمل الموقع:
- اذهب إلى `https://yourdomain.com`
- يجب أن تظهر صفحة الترحيب

### 2. اختبار تسجيل الدخول:
- اذهب إلى `https://yourdomain.com/login`
- استخدم بيانات المستخدم التجريبية

### 3. اختبار رفع الصور:
- جرب إضافة طالب جديد مع صورة
- تأكد من ظهور الصورة في الملف الشخصي

### 4. اختبار نموذج التقديم:
- اذهب إلى `https://yourdomain.com/apply`
- جرب ملء نموذج التقديم مع الصور

---

## 🔍 **حل المشاكل الشائعة**

### مشكلة 500 Internal Server Error:
```bash
# تحقق من logs
tail -f storage/logs/laravel.log

# تأكد من APP_KEY
php artisan key:generate --force

# تنظيف الكاش
php artisan config:clear
```

### مشكلة الصور لا تظهر:
```bash
# تحقق من symlink
ls -la public/storage

# إعادة إنشاء symlink
rm -rf public/storage
ln -s ../storage/app/public public/storage
```

### مشكلة قاعدة البيانات:
```bash
# تحقق من الاتصال
php artisan tinker
# ثم اكتب: DB::connection()->getPdo();
```

---

## 📞 **الدعم الفني**

إذا واجهت أي مشاكل:

1. **تحقق من error logs**: `storage/logs/laravel.log`
2. **تأكد من إعدادات .env**
3. **تحقق من صلاحيات الملفات**
4. **راجع وثائق hosting provider**

---

## ✅ **checklist للتأكد من النجاح**

- [ ] تم إنشاء symlink بنجاح
- [ ] قاعدة البيانات متصلة وتعمل
- [ ] الموقع يفتح بدون أخطاء
- [ ] يمكن تسجيل الدخول
- [ ] الصور تظهر بشكل صحيح
- [ ] نموذج التقديم يعمل
- [ ] رفع الملفات يعمل بشكل صحيح

---

**🎉 مبروك! نظام إدارة الطلاب جاهز للعمل على السيرفر**
