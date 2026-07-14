<?php

namespace App\Models;

use MF\Model\Model;

class Permission extends Model {

    protected ?int $id = null;
    protected ?string $ds_module = null;
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

    public function getAllPermissions() {
        $query = "SELECT id, ds_module, ds_description FROM tb_permission ORDER BY ds_module, ds_description";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getPermissionsGroupedByModule() {
        $query = "SELECT ds_module, GROUP_CONCAT(ds_description ORDER BY ds_description SEPARATOR ', ') AS permissions
                  FROM tb_permission
                  GROUP BY ds_module
                  ORDER BY ds_module";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $query = "SELECT * FROM tb_permission WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function getByModule($ds_module) {
        $query = "SELECT id, ds_module, ds_description FROM tb_permission WHERE ds_module = :ds_module ORDER BY ds_description";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_module', (string)$ds_module, \PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function findByModuleAndDescription(string $module, string $description): ?array {
        $query = "SELECT id FROM tb_permission WHERE ds_module = :ds_module AND ds_description = :ds_description LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_module', $module, \PDO::PARAM_STR);
        $stmt->bindValue(':ds_description', $description, \PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public function save() {
        $query = "INSERT INTO tb_permission (ds_module, ds_description) VALUES (:ds_module, :ds_description)";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_module', (string) $this->__get('ds_module'), \PDO::PARAM_STR);
        $stmt->bindValue(':ds_description', (string) $this->__get('ds_description'), \PDO::PARAM_STR);
        $stmt->execute();
        $this->id = $this->db->lastInsertId();
        return $this->id;
    }

    public function update() {
        $query = "UPDATE tb_permission SET ds_module = :ds_module, ds_description = :ds_description WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_module', (string) $this->__get('ds_module'), \PDO::PARAM_STR);
        $stmt->bindValue(':ds_description', (string) $this->__get('ds_description'), \PDO::PARAM_STR);
        $stmt->bindValue(':id', (int) $this->__get('id'), \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deleteById($id) {
        $query = "DELETE FROM tb_permission WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deleteByModule($ds_module) {
        $query = "DELETE FROM tb_permission WHERE ds_module = :ds_module";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_module', (string)$ds_module, \PDO::PARAM_STR);
        return $stmt->execute();
    }

    public function getAllModules() {
        $query = "SELECT DISTINCT ds_module FROM tb_permission ORDER BY ds_module";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_COLUMN);
    }
}
