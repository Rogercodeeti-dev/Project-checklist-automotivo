<?php

namespace App\Models;

use MF\Model\Model;

class VehicleModel extends Model {
    protected ?int $id = null;
    protected ?int $id_mark = null;
    protected ?string $ds_model = null;  
    protected ?string $type_model = null;  // tipo do modelo (ex: SUV, sedan, hatch, etc.)
    protected ?string $dt_register = null;  // data de registro (pode virar DateTime depois)


    public function __get($atributo) {
		return $this->$atributo;
	}

	public function __set($atributo, $valor) {
        if ($atributo === 'id' || $atributo === 'id_mark') {
            $valor = (int) $valor;
        }        
        $this->$atributo = $valor;
	}

    public function getAllModels() {
        $query = "SELECT m.id, m.id_mark, m.ds_model, m.type_model, m.dt_register, mk.nm_name as mark_name
                  FROM tb_model m
                  LEFT JOIN tb_mark mk ON m.id_mark = mk.id
                  ORDER BY m.ds_model";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $query = "SELECT * FROM tb_model WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function update() {
        $query = "UPDATE tb_model SET id_mark = :id_mark, ds_model = :ds_model, type_model = :type_model WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id_mark', (int) $this->__get('id_mark'));
        $stmt->bindValue(':ds_model', $this->__get('ds_model'));
        $stmt->bindValue(':type_model', $this->__get('type_model'));
        $stmt->bindValue(':id', (int) $this->__get('id'), \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deleteById($id) {
        $query = "DELETE FROM tb_model WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function save() {
        $query = "INSERT INTO tb_model (id_mark, ds_model, type_model, dt_register) VALUES (:id_mark, :ds_model, :type_model, NOW())";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id_mark', (int) $this->__get('id_mark'));
        $stmt->bindValue(':ds_model', $this->__get('ds_model'));
        $stmt->bindValue(':type_model', $this->__get('type_model'));
        $stmt->execute();
        return $this->db->lastInsertId();
    }
}
