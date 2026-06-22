<?php
use App\Models\Setting;

class System
{
    private static $settings;

    public static function load()
    {
        $settingModel = new Setting();
        self::$settings = $settingModel->getSettings();
    }

    public static function get($key)
    {
        return self::$settings[$key] ?? null;
    }

    
}