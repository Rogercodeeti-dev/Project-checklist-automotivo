<?php

namespace App\Models;

use MF\Model\Model;

class Checklist extends Model {

    protected ?int $id = null;
    protected ?string $nr_workorder = null;
    protected ?int $id_status = null;
    protected ?int $current_step = null;
    protected ?int $id_user = null;
    protected ?int $id_laborforce = null;
    protected ?string $dt_servicedate = null;
    protected ?string $hr_servicehours = null;
    protected ?string $nm_customer = null;
    protected ?string $nr_phone = null;
    protected ?string $ds_email = null;
    protected ?string $ds_testimonialcustomer = null;

    // Campos do veículo
    protected ?string $nr_vehiclelicenseplate = null;
    protected ?string $ds_vehicle = null;
    protected ?string $ds_color = null;
    protected ?int $nr_year = null;
    protected ?int $nrKilometer = null;
    protected ?int $nr_fuellevel = null;
    protected ?string $dt_finished_at = null;

    public function __get($atributo) {
        return $this->$atributo;
    }

    public function __set($atributo, $valor) {
        $this->$atributo = $valor;
    }

    public function save() {
        $query = "INSERT INTO tb_checklist
        (
            nr_workorder,
            id_status,
            current_step,
            id_user,
            id_laborforce,
            dt_servicedate,
            hr_servicehours,
            nm_customer,
            nr_phone,
            ds_email,
            ds_testimonialcustomer,
            nr_vehiclelicenseplate,
            ds_vehicle,
            ds_color,
            nr_year,
            nrKilometer,
            nr_fuellevel,
            dt_finished_at
        )
        VALUES
        (
            :nr_workorder,
            :id_status,
            :current_step,
            :id_user,
            :id_laborforce,
            :dt_servicedate,
            :hr_servicehours,
            :nm_customer,
            :nr_phone,
            :ds_email,
            :ds_testimonialcustomer,
            :nr_vehiclelicenseplate,
            :ds_vehicle,
            :ds_color,
            :nr_year,
            :nrKilometer,
            :nr_fuellevel,
            :dt_finished_at
        )";

        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':nr_workorder', $this->__get('nr_workorder'));
        $stmt->bindValue(':id_status', $this->__get('id_status') ?? 1, \PDO::PARAM_INT);
        $stmt->bindValue(':current_step', $this->__get('current_step') ?? 1, \PDO::PARAM_INT);
        $stmt->bindValue(':id_user', $this->__get('id_user'), \PDO::PARAM_INT);
        $stmt->bindValue(':id_laborforce', $this->__get('id_laborforce') ?: null);
        $stmt->bindValue(':dt_servicedate', $this->__get('dt_servicedate') ?: null);
        $stmt->bindValue(':hr_servicehours', $this->__get('hr_servicehours') ?: null);
        $stmt->bindValue(':nm_customer', $this->__get('nm_customer') ?: null);
        $stmt->bindValue(':nr_phone', $this->__get('nr_phone') ?: null);
        $stmt->bindValue(':ds_email', $this->__get('ds_email') ?: null);
        $stmt->bindValue(':ds_testimonialcustomer', $this->__get('ds_testimonialcustomer') ?: null);
        $stmt->bindValue(':nr_vehiclelicenseplate', $this->__get('nr_vehiclelicenseplate') ?: null);
        $stmt->bindValue(':ds_vehicle', $this->__get('ds_vehicle') ?: null);
        $stmt->bindValue(':ds_color', $this->__get('ds_color') ?: null);
        $stmt->bindValue(':nr_year', $this->__get('nr_year') ?: null);
        $stmt->bindValue(':nrKilometer', $this->__get('nrKilometer') ?: null);
        $stmt->bindValue(':nr_fuellevel', $this->__get('nr_fuellevel') ?: null);
        $stmt->bindValue(':dt_finished_at', $this->__get('dt_finished_at') ?: null);

        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
    


    public function update() {
        $fields = [];
        $params = [];

        $fieldMap = [
            'nr_workorder' => 'nr_workorder',
            'id_status' => 'id_status',
            'current_step' => 'current_step',
            'id_user' => 'id_user',
            'id_laborforce' => 'id_laborforce',
            'dt_servicedate' => 'dt_servicedate',
            'hr_servicehours' => 'hr_servicehours',
            'nm_customer' => 'nm_customer',
            'nr_phone' => 'nr_phone',
            'ds_email' => 'ds_email',
            'ds_testimonialcustomer' => 'ds_testimonialcustomer',
            'nr_vehiclelicenseplate' => 'nr_vehiclelicenseplate',
            'ds_vehicle' => 'ds_vehicle',
            'ds_color' => 'ds_color',
            'nr_year' => 'nr_year',
            'nrKilometer' => 'nrKilometer',
            'nr_fuellevel' => 'nr_fuellevel',
            'dt_finished_at' => 'dt_finished_at',
        ];

        foreach ($fieldMap as $prop => $col) {
            $val = $this->__get($prop);
            if ($val !== null && $val !== '') {
                $fields[] = "$col = :$col";
                $params[$col] = $val;
            }
        }

        // Preencher dt_finished_at automaticamente ao finalizar (status 2)
        if (isset($params['id_status']) && $params['id_status'] == 2 && !isset($params['dt_finished_at'])) {
            $fields[] = "dt_finished_at = :dt_finished_at";
            $params['dt_finished_at'] = date('Y-m-d H:i:s');
        }

        if (empty($fields)) {
            return false;
        }

        $query = "UPDATE tb_checklist SET " . implode(', ', $fields) . " WHERE nr_workorder = :where_nr_workorder";
        $params['where_nr_workorder'] = $this->__get('nr_workorder');

        $stmt = $this->db->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue(':' . $key, $value);
        }

        return $stmt->execute();
    }

    public function getByWorkorder() {
        $query = "SELECT * FROM tb_checklist WHERE nr_workorder = :nr_workorder LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':nr_workorder', $this->__get('nr_workorder'));
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public function getById() {
        $query = "SELECT * FROM tb_checklist WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', $this->__get('id'), \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getAllChecklists() {
        $query = "SELECT c.*, u.nm_name AS nm_user_name
                  FROM tb_checklist c
                  LEFT JOIN tb_user u ON u.id = c.id_user
                  ORDER BY c.dt_created DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getFinishedChecklists() {
        $query = "SELECT c.nr_workorder, c.nm_customer, c.nr_phone, c.ds_email,
                         c.nr_vehiclelicenseplate, c.ds_vehicle, c.ds_color, c.nr_year,
                         c.dt_servicedate, c.dt_finished_at,
                         u.nm_name AS nm_user_name,
                         s.ds_status
                  FROM tb_checklist c
                  LEFT JOIN tb_user u ON u.id = c.id_user
                  LEFT JOIN tb_status s ON s.id_status = c.id_status
                  WHERE c.id_status = 2
                  ORDER BY c.dt_finished_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}
