<?php

namespace App\Models;

use MF\Model\Model;

class Client extends Model {

    protected ?int $id_client = null;
    protected ?string $tp_person = null;
    protected ?string $nr_cpf = null;
    protected ?string $nr_cnpj = null;
    protected ?string $nm_client = null;
    protected ?string $nm_socialreazon = null;
    protected ?string $nm_fantasy = null;
    protected ?string $nr_phone = null;
    protected ?string $nr_cellphone = null;
    protected ?string $ds_email = null;
    protected ?string $nr_zipcode = null;
    protected ?string $nr_address = null;
    protected ?string $dt_register = null;

    public function __get($atributo) {
        return $this->$atributo;
    }

    public function __set($atributo, $valor) {
        if ($atributo === 'id_client') {
            $valor = (int) $valor;
        }
        $this->$atributo = $valor;
    }

    public function getAllClients() {
        $query = "SELECT id_client, tp_person, nr_cpf, nr_cnpj, nm_client, nm_socialreazon, nm_fantasy, nr_phone, ds_email, dt_register FROM tb_client ORDER BY nm_client";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $query = "SELECT id_client, tp_person, nr_cpf, nr_cnpj, nm_client, nm_socialreazon, nm_fantasy, nr_phone, nr_cellphone, ds_email, nr_zipcode, nr_address, dt_register FROM tb_client WHERE id_client = :id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function save() {
        $query = "INSERT INTO tb_client (tp_person, nr_cpf, nr_cnpj, nm_client, nm_socialreazon, nm_fantasy, nr_phone, nr_cellphone, ds_email, nr_zipcode, nr_address, dt_register)
        VALUES (:tp_person, :nr_cpf, :nr_cnpj, :nm_client, :nm_socialreazon, :nm_fantasy, :nr_phone, :nr_cellphone, :ds_email, :nr_zipcode, :nr_address, NOW())";

        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':tp_person', (string) $this->__get('tp_person'), \PDO::PARAM_STR);
        $stmt->bindValue(':nr_cpf', $this->__get('nr_cpf') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nr_cnpj', $this->__get('nr_cnpj') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nm_client', (string) $this->__get('nm_client'), \PDO::PARAM_STR);
        $stmt->bindValue(':nm_socialreazon', $this->__get('nm_socialreazon') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nm_fantasy', $this->__get('nm_fantasy') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nr_phone', $this->__get('nr_phone') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nr_cellphone', $this->__get('nr_cellphone') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':ds_email', $this->__get('ds_email') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nr_zipcode', $this->__get('nr_zipcode') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nr_address', $this->__get('nr_address') ?: null, \PDO::PARAM_STR);

        if (!$stmt->execute()) {
            $err = $stmt->errorInfo();
            throw new \PDOException($err[2] ?? 'Erro desconhecido ao inserir cliente', (int)$err[0]);
        }
        return $this->db->lastInsertId();
    }

    public function update() {
        $query = "UPDATE tb_client SET tp_person = :tp_person, nr_cpf = :nr_cpf, nr_cnpj = :nr_cnpj, nm_client = :nm_client, nm_socialreazon = :nm_socialreazon, nm_fantasy = :nm_fantasy, nr_phone = :nr_phone, nr_cellphone = :nr_cellphone, ds_email = :ds_email, nr_zipcode = :nr_zipcode, nr_address = :nr_address WHERE id_client = :id_client";

        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':tp_person', (string) $this->__get('tp_person'), \PDO::PARAM_STR);
        $stmt->bindValue(':nr_cpf', $this->__get('nr_cpf') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nr_cnpj', $this->__get('nr_cnpj') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nm_client', (string) $this->__get('nm_client'), \PDO::PARAM_STR);
        $stmt->bindValue(':nm_socialreazon', $this->__get('nm_socialreazon') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nm_fantasy', $this->__get('nm_fantasy') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nr_phone', $this->__get('nr_phone') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nr_cellphone', $this->__get('nr_cellphone') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':ds_email', $this->__get('ds_email') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nr_zipcode', $this->__get('nr_zipcode') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':nr_address', $this->__get('nr_address') ?: null, \PDO::PARAM_STR);
        $stmt->bindValue(':id_client', (int) $this->__get('id_client'), \PDO::PARAM_INT);

        return $stmt->execute();
    }

    public function deleteById($id) {
        $query = "DELETE FROM tb_client WHERE id_client = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        return $stmt->execute();
    }
}
