<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // إنشاء مستخدم الأدمن
        User::factory()->admin()->create([
            'name' => 'الادمن',
            'phone' => '07742209251',
            'password' => bcrypt('123456'),
        ]);

        // إنشاء مستخدم موظف
        User::factory()->employee()->create([
            'name' => 'الموضف',
            'phone' => '07742209252',
            'password' => bcrypt('123456'),
        ]);
    }
}
