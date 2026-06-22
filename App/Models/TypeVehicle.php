<?php

namespace App\Models;

use MF\Model\Model;

class TypeVehicle extends Model {

    protected ?int $id = null;
    protected ?string $ds_type = null;

    public function __get($atributo) {
        return $this->$atributo;
    }

    public function __set($atributo, $valor) {
        if ($atributo === 'id') {
            $valor = (int) $valor;
        }
        $this->$atributo = $valor;
    }

    public function getAllTypeVehicles() {
        $query = "SELECT id, ds_type FROM tb_typevehicle ORDER BY ds_type";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $query = "SELECT * FROM tb_typevehicle WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function save() {
        $query = "INSERT INTO tb_typevehicle (ds_type) VALUES (:ds_type)";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_type', (string) $this->__get('ds_type'), \PDO::PARAM_STR);
        $stmt->execute();
        $this->id = $this->db->lastInsertId();
        return $this->id;
    }

    public function update() {
        $query = "UPDATE tb_typevehicle SET ds_type = :ds_type WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_type', (string) $this->__get('ds_type'), \PDO::PARAM_STR);
        $stmt->bindValue(':id', (int) $this->__get('id'), \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deleteById($id) {
        $query = "DELETE FROM tb_typevehicle WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        return $stmt->execute();
    }
}
