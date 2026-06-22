<?php

namespace App\Config;

class AppConfig
{
    public static function init()
    {
        date_default_timezone_set('America/Sao_Paulo');

        define('SYSTEM_NAME_DEFAULT', 'AppCar');
        define('SYSTEM_EMAIL_DEFAULT', 'rogercodeeti@gmail.com');
        define('SYSTEM_PHONE_DEFAULT', '47991899535');
    }
}