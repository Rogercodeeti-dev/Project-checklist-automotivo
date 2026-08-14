<?php

namespace App\Models;

use MF\Model\Model;

class ChecklistItemMedia extends Model {

    protected ?int $media_id = null;
    protected ?string $media_type = null;
    protected ?string $file_path = null;
    protected ?string $original_name = null;
    protected ?string $ds_description = null;
    protected ?int $file_size = null;
    protected ?string $mime_type = null;

    public function __get($atributo) {
        return $this->$atributo;
    }

    public function __set($atributo, $valor) {
        $this->$atributo = $valor;
    }

    public function save() {
        $query = "INSERT INTO tb_checklist_item_media
        (
            media_type,
            file_path,
            original_name,
            ds_description,
            file_size,
            mime_type
        )
        VALUES
        (
            :media_type,
            :file_path,
            :original_name,
            :ds_description,
            :file_size,
            :mime_type
        )";

        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':media_type', $this->__get('media_type'));
        $stmt->bindValue(':file_path', $this->__get('file_path'));
        $stmt->bindValue(':original_name', $this->__get('original_name') ?: null);
        $stmt->bindValue(':ds_description', $this->__get('ds_description') ?: null);
        $stmt->bindValue(':file_size', $this->__get('file_size') ?: null, \PDO::PARAM_INT);
        $stmt->bindValue(':mime_type', $this->__get('mime_type') ?: null);
        $stmt->execute();
        $this->media_id = $this->db->lastInsertId();
        return $this->media_id;
    }

    public function getByMediaId() {
        $query = "SELECT * FROM tb_checklist_item_media WHERE media_id = :media_id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':media_id', $this->__get('media_id'), \PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public function deleteById() {
        $query = "DELETE FROM tb_checklist_item_media WHERE media_id = :media_id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':media_id', $this->__get('media_id'), \PDO::PARAM_INT);
        return $stmt->execute();
    }

}
