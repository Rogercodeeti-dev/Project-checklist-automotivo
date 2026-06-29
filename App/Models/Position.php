<?php

namespace App\Models;

use MF\Model\Model;

class Position extends Model {

    protected ?int $id = null;
    protected ?string $ds_description = null;

    public function __get($atributo) {
        return $this->$atributo;
    }

    public function __set($atributo, $valor) {
        if ($atributo === 'id') {
            $valor = (int) $valor;
        }
        $this->$atributo = $valor;
    }

    public function getAllPositions() {
        $query = "SELECT id, ds_description FROM tb_position ORDER BY ds_description";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function findByDescription(string $description): ?array {
        $query = "SELECT id, ds_description FROM tb_position WHERE ds_description = :ds_description LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_description', $description, \PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public function getById($id) {
        $query = "SELECT * FROM tb_position WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function save() {
        $query = "INSERT INTO tb_position (ds_description) VALUES (:ds_description)";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_description', (string) $this->__get('ds_description'), \PDO::PARAM_STR);
        $stmt->execute();
        $this->id = $this->db->lastInsertId();
        return $this->id;
    }

    public function update() {
        $query = "UPDATE tb_position SET ds_description = :ds_description WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_description', (string) $this->__get('ds_description'), \PDO::PARAM_STR);
        $stmt->bindValue(':id', (int) $this->__get('id'), \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deleteById($id) {
        $query = "DELETE FROM tb_position WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        return $stmt->execute();
    }
}
