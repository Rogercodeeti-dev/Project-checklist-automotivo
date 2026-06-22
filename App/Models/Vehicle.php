<?php

namespace App\Models;

use MF\Model\Model;

class Vehicle extends Model {

    protected ?int $id_vehicle = null;
    protected ?int $id_client = null;
    protected ?int $id_model = null;
    protected ?string $nr_platevehicle = null;
    protected ?string $nr_chassis = null;
    protected ?int $id_typevehicle = null;
    protected ?string $ds_color = null;
    protected ?string $ds_fuel = null;
    protected ?int $nr_currentkm = null;
    protected ?string $ds_observation = null;
    protected ?string $dt_register = null;

    public function __get($atributo) {
        return $this->$atributo;
    }

    public function __set($atributo, $valor) {
        if (in_array($atributo, ['id_vehicle', 'id_client', 'id_model', 'id_typevehicle', 'nr_currentkm'])) {
            $valor = (int) $valor;
        }
        $this->$atributo = $valor;
    }

    public function getAllVehicles() {
        $query = "SELECT v.id_vehicle, v.id_client, v.id_model, v.nr_platevehicle, v.nr_chassis,
                         v.id_typevehicle, v.ds_color, v.ds_fuel, v.nr_currentkm, v.ds_observation, v.dt_register,
                         c.nm_client,
                         m.ds_model, mk.nm_name AS mark_name,
                         tv.ds_type
                  FROM tb_vehicle v
                  LEFT JOIN tb_client c ON v.id_client = c.id_client
                  LEFT JOIN tb_model m ON v.id_model = m.id
                  LEFT JOIN tb_mark mk ON m.id_mark = mk.id
                  LEFT JOIN tb_typevehicle tv ON v.id_typevehicle = tv.id
                  ORDER BY v.dt_register DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $query = "SELECT * FROM tb_vehicle WHERE id_vehicle = :id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function save() {
        $query = "INSERT INTO tb_vehicle (id_client, id_model, nr_platevehicle, nr_chassis, id_typevehicle, ds_color, ds_fuel, nr_currentkm, ds_observation, dt_register)
                  VALUES (:id_client, :id_model, :nr_platevehicle, :nr_chassis, :id_typevehicle, :ds_color, :ds_fuel, :nr_currentkm, :ds_observation, NOW())";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id_client', (int) $this->__get('id_client'), \PDO::PARAM_INT);
        $stmt->bindValue(':id_model', (int) $this->__get('id_model'), \PDO::PARAM_INT);
        $stmt->bindValue(':nr_platevehicle', $this->__get('nr_platevehicle') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nr_chassis', $this->__get('nr_chassis') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':id_typevehicle', (int) $this->__get('id_typevehicle'), \PDO::PARAM_INT);
        $stmt->bindValue(':ds_color', $this->__get('ds_color') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':ds_fuel', $this->__get('ds_fuel') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nr_currentkm', $this->__get('nr_currentkm') !== null ? (int) $this->__get('nr_currentkm') : 0, \PDO::PARAM_INT);
        $stmt->bindValue(':ds_observation', $this->__get('ds_observation') ?: null, \PDO::PARAM_STR);
        if (!$stmt->execute()) {
            $err = $stmt->errorInfo();
            throw new \PDOException($err[2] ?? 'Erro desconhecido ao inserir veículo', (int)$err[0]);
        }
        return $this->db->lastInsertId();
    }

    public function update() {
        $query = "UPDATE tb_vehicle SET id_client = :id_client, id_model = :id_model, nr_platevehicle = :nr_platevehicle, nr_chassis = :nr_chassis, id_typevehicle = :id_typevehicle, ds_color = :ds_color, ds_fuel = :ds_fuel, nr_currentkm = :nr_currentkm, ds_observation = :ds_observation WHERE id_vehicle = :id_vehicle";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id_client', (int) $this->__get('id_client'), \PDO::PARAM_INT);
        $stmt->bindValue(':id_model', (int) $this->__get('id_model'), \PDO::PARAM_INT);
        $stmt->bindValue(':nr_platevehicle', $this->__get('nr_platevehicle') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nr_chassis', $this->__get('nr_chassis') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':id_typevehicle', (int) $this->__get('id_typevehicle'), \PDO::PARAM_INT);
        $stmt->bindValue(':ds_color', $this->__get('ds_color') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':ds_fuel', $this->__get('ds_fuel') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nr_currentkm', $this->__get('nr_currentkm') !== null ? (int) $this->__get('nr_currentkm') : 0, \PDO::PARAM_INT);
        $stmt->bindValue(':ds_observation', $this->__get('ds_observation') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':id_vehicle', (int) $this->__get('id_vehicle'), \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deleteById($id) {
        $query = "DELETE FROM tb_vehicle WHERE id_vehicle = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        return $stmt->execute();
    }
}
