<?php

namespace App\Models;

use MF\Model\Model;

class Service extends Model {

    protected ?int $id = null;
    protected ?string $ds_service = null;
    protected ?string $estimated_time = null;
    protected ?int $is_active = null;
    protected ?int $id_labor = null;

    public function __get($atributo) {
        return $this->$atributo;
    }

    public function __set($atributo, $valor) {
        if ($atributo === 'id' || $atributo === 'is_active' || $atributo === 'id_labor') {
            $valor = $valor !== null && $valor !== '' ? (int) $valor : null;
        }
        $this->$atributo = $valor;
    }

    public function getAllServices() {
        $query = "SELECT s.id, s.ds_service, s.estimated_time, s.is_active, s.id_labor,
                         l.ds_type AS ds_labor_type
                  FROM tb_service s
                  LEFT JOIN tb_laborforce l ON l.id = s.id_labor
                  ORDER BY s.ds_service";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function findByService(string $ds_service): ?array {
        $query = "SELECT id, ds_service FROM tb_service WHERE ds_service = :ds_service LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_service', $ds_service, \PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public function getById($id) {
        $query = "SELECT * FROM tb_service WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function save() {
        $query = "INSERT INTO tb_service (ds_service, estimated_time, is_active, id_labor) VALUES (:ds_service, :estimated_time, :is_active, :id_labor)";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_service', (string) $this->__get('ds_service'), \PDO::PARAM_STR);
        $stmt->bindValue(':estimated_time', (string) $this->__get('estimated_time'), \PDO::PARAM_STR);
        $stmt->bindValue(':is_active', (int) $this->__get('is_active'), \PDO::PARAM_INT);
        $stmt->bindValue(':id_labor', $this->__get('id_labor') !== null ? (int) $this->__get('id_labor') : null, \PDO::PARAM_INT);
        $stmt->execute();
        $this->id = $this->db->lastInsertId();
        return $this->id;
    }

    public function update() {
        $query = "UPDATE tb_service SET ds_service = :ds_service, estimated_time = :estimated_time, is_active = :is_active, id_labor = :id_labor WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_service', (string) $this->__get('ds_service'), \PDO::PARAM_STR);
        $stmt->bindValue(':estimated_time', (string) $this->__get('estimated_time'), \PDO::PARAM_STR);
        $stmt->bindValue(':is_active', (int) $this->__get('is_active'), \PDO::PARAM_INT);
        $stmt->bindValue(':id_labor', $this->__get('id_labor') !== null ? (int) $this->__get('id_labor') : null, \PDO::PARAM_INT);
        $stmt->bindValue(':id', (int) $this->__get('id'), \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deleteById($id) {
        $query = "DELETE FROM tb_service WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        return $stmt->execute();
    }
}
