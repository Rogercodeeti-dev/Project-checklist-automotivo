<?php

namespace App\Models;

use MF\Model\Model;

class Mark extends Model {

    protected ?int $id = null;
    protected ?string $nm_name = null;
    protected ?string $cartype = null;  // tipo do carro (ex: SUV, sedan, hatch, etc.)
    protected ?string $ds_soon = null;    // lançamento em breve (0 ou 1)
    protected ?string $dt_register = null;  // data de registro (pode virar DateTime depois)

	public function __get($atributo) {
		return $this->$atributo;
	}

	public function __set($atributo, $valor) {
        if ($atributo === 'id') {
            $valor = (int) $valor;
        }
        if ($atributo === 'ds_soon') {
            $valor = $valor === '' || $valor === null ? '0' : (string) $valor;
        }
        $this->$atributo = $valor;
	}
    

    public function getAllMarks() {
        $query = "SELECT id, nm_name, cartype, ds_soon, dt_register FROM tb_mark ORDER BY nm_name";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $query = "SELECT * FROM tb_mark WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function save() {
        $query = "INSERT INTO tb_mark (nm_name, cartype, ds_soon, dt_register) VALUES (:nm_name, :cartype, :ds_soon, NOW())";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':nm_name', (string) $this->__get('nm_name'), \PDO::PARAM_STR);
        $stmt->bindValue(':cartype', (string) $this->__get('cartype'), \PDO::PARAM_STR);
        $stmt->bindValue(':ds_soon', (string) $this->__get('ds_soon'), \PDO::PARAM_STR);
        $stmt->execute();
        $this->id = $this->db->lastInsertId();
        return $this->id;
    }

    public function update() {
        $query = "UPDATE tb_mark SET nm_name = :nm_name, cartype = :cartype, ds_soon = :ds_soon WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':nm_name', (string) $this->__get('nm_name'), \PDO::PARAM_STR);
        $stmt->bindValue(':cartype', (string) $this->__get('cartype'), \PDO::PARAM_STR);
        $stmt->bindValue(':ds_soon', (string) $this->__get('ds_soon'), \PDO::PARAM_STR);
        $stmt->bindValue(':id', (int) $this->__get('id'), \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deleteById($id) {
        $query = "DELETE FROM tb_mark WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function hasModels($id) {
        $query = "SELECT COUNT(*) as cnt FROM tb_model WHERE id_mark = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);
        return isset($row['cnt']) && (int)$row['cnt'] > 0;
    }
}
