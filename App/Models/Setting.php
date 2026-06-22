<?php

namespace App\Models;

use App\Connection;
use PDO;

class Setting
{
    private $db;

    public function __construct()
    {
        $this->db = Connection::getDb();
    }

    public function getSettings()
    {
   
    $query = $this->db->query("SELECT * FROM tb_setting LIMIT 1");
        $result = $query->fetch(PDO::FETCH_ASSOC);

        // Se não existir registro → cria padrão
        if(!$result) {
            $defaultName = defined('SYSTEM_NAME_DEFAULT') ? SYSTEM_NAME_DEFAULT : 'AppCar';
            $defaultEmail = defined('SYSTEM_EMAIL_DEFAULT') ? SYSTEM_EMAIL_DEFAULT : 'rogercodeeti@gmail.com';
            $defaultPhone = defined('SYSTEM_PHONE_DEFAULT') ? SYSTEM_PHONE_DEFAULT : '47991899535';

            $this->db->query("
                INSERT INTO tb_setting 
                SET nm_systemname = '" . $defaultName . "',
                    nm_socialreazon = '',
                    nm_fantasyname = '',
                    nr_cnpj = '',
                    nr_zipcode = '',
                    ds_email = '" . $defaultEmail . "',
                    ds_url = '',
                    ds_instagram = '',
                    nr_phone = '" . $defaultPhone . "',
                    ds_system_logo = 'logo.png',
                    ds_reporticon  = 'logo.jpg',
                    ds_icon        = 'icone.png',
                    ds_active = '1'
            ");

            // Busca novamente
            $query = $this->db->query("SELECT * FROM tb_setting LIMIT 1");
            $result = $query->fetch(PDO::FETCH_ASSOC);
        }

        return $result;
    }

    public function updateSettings(array $data)
    {
        $query = $this->db->prepare(
            "UPDATE tb_setting SET
                nm_systemname = :nm_systemname,
                nm_socialreazon = :nm_socialreazon,
                nm_fantasyname = :nm_fantasyname,
                nr_cnpj = :nr_cnpj,
                nr_zipcode = :nr_zipcode,
                ds_email = :ds_email,
                ds_url = :ds_url,
                ds_instagram = :ds_instagram,
                nr_phone = :nr_phone,
                ds_system_logo = :ds_system_logo,
                ds_reporticon = :ds_reporticon,
                ds_icon = :ds_icon,
                ds_active = :ds_active
            LIMIT 1"
        );

        $query->bindValue(':nm_systemname', $data['nm_systemname'] ?? '');
        $query->bindValue(':nm_socialreazon', $data['nm_socialreazon'] ?? '');
        $query->bindValue(':nm_fantasyname', $data['nm_fantasyname'] ?? '');
        $query->bindValue(':nr_cnpj', $data['nr_cnpj'] ?? '');
        $query->bindValue(':nr_zipcode', $data['nr_zipcode'] ?? '');
        $query->bindValue(':ds_email', $data['ds_email'] ?? '');
        $query->bindValue(':ds_url', $data['ds_url'] ?? '');
        $query->bindValue(':ds_instagram', $data['ds_instagram'] ?? '');
        $query->bindValue(':nr_phone', $data['nr_phone'] ?? '');
        $query->bindValue(':ds_system_logo', $data['ds_system_logo'] ?? '');
        $query->bindValue(':ds_reporticon', $data['ds_reporticon'] ?? '');
        $query->bindValue(':ds_icon', $data['ds_icon'] ?? '');
        $query->bindValue(':ds_active', $data['ds_active'] ?? 0);

        return $query->execute();
    }
}