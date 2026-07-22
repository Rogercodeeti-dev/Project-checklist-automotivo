<?php

namespace App\Models;

use MF\Model\Model;

class Laborforce extends Model {

    protected ?int $id = null;
    protected ?string $ds_type = null;
    protected ?float $vl_labor = null;

    public function __get($atributo) {
        return $this->$atributo;
    }

    public function __set($atributo, $valor) {
        if ($atributo === 'id') {
            $valor = (int) $valor;
        }
        if ($atributo === 'vl_labor') {
            $valor = (float) $valor;
        }
        $this->$atributo = $valor;
    }

    public function getAllLaborforces() {
        $query = "SELECT id, ds_type, vl_labor FROM tb_laborforce ORDER BY ds_type";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function findByType(string $ds_type): ?array {
        $query = "SELECT id, ds_type, vl_labor FROM tb_laborforce WHERE ds_type = :ds_type LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_type', $ds_type, \PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public function getById($id) {
        $query = "SELECT * FROM tb_laborforce WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function save() {
        $query = "INSERT INTO tb_laborforce (ds_type, vl_labor) VALUES (:ds_type, :vl_labor)";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_type', (string) $this->__get('ds_type'), \PDO::PARAM_STR);
        $stmt->bindValue(':vl_labor', (float) $this->__get('vl_labor'), \PDO::PARAM_STR);
        $stmt->execute();
        $this->id = $this->db->lastInsertId();
        return $this->id;
    }

    public function update() {
        $query = "UPDATE tb_laborforce SET ds_type = :ds_type, vl_labor = :vl_labor WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_type', (string) $this->__get('ds_type'), \PDO::PARAM_STR);
        $stmt->bindValue(':vl_labor', (float) $this->__get('vl_labor'), \PDO::PARAM_STR);
        $stmt->bindValue(':id', (int) $this->__get('id'), \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deleteById($id) {
        $query = "DELETE FROM tb_laborforce WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        return $stmt->execute();
    }
}
