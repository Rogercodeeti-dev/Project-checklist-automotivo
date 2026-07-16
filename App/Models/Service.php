<?php

namespace App\Models;

use MF\Model\Model;

class Service extends Model {

    protected ?int $id = null;
    protected ?string $ds_service = null;

    public function __get($atributo) {
        return $this->$atributo;
    }

    public function __set($atributo, $valor) {
        if ($atributo === 'id') {
            $valor = (int) $valor;
        }
        $this->$atributo = $valor;
    }

    public function getAllServices() {
        $query = "SELECT id, ds_service FROM tb_service ORDER BY ds_service";
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
        $query = "INSERT INTO tb_service (ds_service) VALUES (:ds_service)";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_service', (string) $this->__get('ds_service'), \PDO::PARAM_STR);
        $stmt->execute();
        $this->id = $this->db->lastInsertId();
        return $this->id;
    }

    public function update() {
        $query = "UPDATE tb_service SET ds_service = :ds_service WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_service', (string) $this->__get('ds_service'), \PDO::PARAM_STR);
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
