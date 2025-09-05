# مشروع Laravel + React + Inertia.js

## نظرة عامة

هذا المشروع يستخدم:
- **Laravel** كـ Backend Framework
- **React** كـ Frontend Library  
- **Inertia.js** لربط Laravel مع React بدون API
- **Tailwind CSS** للتصميم
- **Vite** لبناء وتطوير المشروع

## المتطلبات

- PHP 8.1+
- Node.js 20.19+
- Composer
- NPM

## طريقة التشغيل

### 1. تثبيت المكتبات

```bash
# تثبيت مكتبات PHP
composer install

# تثبيت مكتبات JavaScript
npm install
```

### 2. إعداد قاعدة البيانات

```bash
# إنشاء ملف البيئة
cp .env.example .env

# توليد مفتاح التطبيق
php artisan key:generate

# تشغيل المايقريشن
php artisan migrate
```

### 3. تشغيل خوادم التطوير

```bash
# تشغيل خادم Laravel (في terminal منفصل)
php artisan serve

# تشغيل خادم Vite للـ frontend (في terminal آخر)
npm run dev
```

### 4. زيارة التطبيق

افتح المتصفح وتوجه إلى: `http://127.0.0.1:8000`

## هيكل المجلدات

```
resources/js/
├── Pages/          # صفحات React
│   ├── Welcome.jsx
│   └── Dashboard.jsx
├── Layouts/        # تخطيطات الصفحات
│   └── AppLayout.jsx
├── Components/     # مكونات React قابلة للإعادة
├── utils/          # أدوات مساعدة
│   └── route.js
└── app.jsx         # نقطة البداية الرئيسية
```

## كيفية إضافة صفحة جديدة

### 1. إنشاء مكون React

```jsx
// resources/js/Pages/NewPage.jsx
import AppLayout from '../Layouts/AppLayout';

export default function NewPage({ data }) {
    return (
        <AppLayout title="صفحة جديدة">
            <div className="py-12">
                <h1>مرحباً بك في الصفحة الجديدة</h1>
                <p>البيانات من Laravel: {data}</p>
            </div>
        </AppLayout>
    );
}
```

### 2. إضافة Route في Laravel

```php
// routes/web.php
Route::get('/new-page', function () {
    return Inertia::render('NewPage', [
        'data' => 'هذه بيانات من Laravel'
    ]);
});
```

## المزايا

✅ **لا حاجة لـ API منفصل** - البيانات تمر مباشرة من Laravel لـ React  
✅ **SEO ممتاز** - Server-side rendering  
✅ **أمان محسن** - Laravel يتحكم في كل شيء  
✅ **تطوير أسرع** - لا حاجة لـ endpoints منفصلة  
✅ **State management بسيط** - Inertia يدير الحالة  

## الأدوات المستخدمة

- **@inertiajs/react**: ربط React مع Laravel
- **@heroicons/react**: مكتبة أيقونات
- **react-hot-toast**: إشعارات
- **tailwindcss**: إطار عمل CSS
- **lucide-react**: أيقونات إضافية
- **react-icons**: مجموعة أيقونات شاملة

## التطوير

للبدء في تطوير مشروعك:

1. قم بتحديد متطلبات مشروعك
2. أنشئ الـ Models و Controllers في Laravel
3. أنشئ صفحات React في `resources/js/Pages/`
4. أضف Routes في `routes/web.php`
5. استخدم Inertia لتمرير البيانات

## الحالة الحالية

✅ تم إعداد Laravel + React + Inertia.js  
✅ تم إعداد Tailwind CSS  
✅ تم إنشاء صفحة Welcome  
✅ تم إنشاء صفحة Dashboard كمثال  
✅ تم إعداد خوادم التطوير  

المشروع جاهز للتطوير! 🚀
