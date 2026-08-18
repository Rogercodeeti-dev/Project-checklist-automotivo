<?php

namespace App\Models;

use MF\Model\Model;

class ChecklistItem extends Model {

    protected ?int $item_id = null;
    protected ?string $nr_workorder = null;
    protected ?int $product_id = null;
    protected ?float $quantity = null;
    protected ?float $unit_price = null;
    protected ?int $labor_time_minutes = null;

    public function __get($atributo) {
        return $this->$atributo;
    }

    public function __set($atributo, $valor) {
        $this->$atributo = $valor;
    }

    public function save() {
        $query = "INSERT INTO tb_checklist_item
        (
            nr_workorder,
            product_id,
            quantity,
            unit_price,
            labor_time_minutes
        )
        VALUES
        (
            :nr_workorder,
            :product_id,
            :quantity,
            :unit_price,
            :labor_time_minutes
        )";

        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':nr_workorder', $this->__get('nr_workorder'));
        $stmt->bindValue(':product_id', $this->__get('product_id') ?: null, \PDO::PARAM_INT);
        $stmt->bindValue(':quantity', $this->__get('quantity') ?: null);
        $stmt->bindValue(':unit_price', $this->__get('unit_price') ?: null);
        $stmt->bindValue(':labor_time_minutes', $this->__get('labor_time_minutes') ?: null, \PDO::PARAM_INT);
        $stmt->execute();
        $this->item_id = $this->db->lastInsertId();
        return $this->item_id;
    }

    public function getByWorkorder() {
        $query = "SELECT ci.*, p.ds_product, p.unit
                  FROM tb_checklist_item ci
                  LEFT JOIN tb_product p ON p.id = ci.product_id
                  WHERE ci.nr_workorder = :nr_workorder
                  ORDER BY ci.item_id ASC";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':nr_workorder', $this->__get('nr_workorder'));
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function deleteByWorkorder() {
        $query = "DELETE FROM tb_checklist_item WHERE nr_workorder = :nr_workorder";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':nr_workorder', $this->__get('nr_workorder'));
        return $stmt->execute();
    }

    public function deleteById() {
        $query = "DELETE FROM tb_checklist_item WHERE item_id = :item_id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':item_id', $this->__get('item_id'), \PDO::PARAM_INT);
        return $stmt->execute();
    }

}
