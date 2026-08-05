<?php

namespace App\Models;

use MF\Model\Model;

class Product extends Model {

    protected ?int $id = null;
    protected ?string $ds_product = null;
    protected ?string $unit = null;
    protected ?float $sale_price = null;
    protected ?int $stock_quantity = null;
    protected ?int $minimum_stock = null;
    protected ?int $is_active = null;

    public function __get($atributo) {
        return $this->$atributo;
    }

    public function __set($atributo, $valor) {
        if (in_array($atributo, ['id', 'stock_quantity', 'minimum_stock', 'is_active'])) {
            $valor = $valor !== null && $valor !== '' ? (int) $valor : null;
        }
        if ($atributo === 'sale_price') {
            $valor = $valor !== null && $valor !== '' ? (float) $valor : null;
        }
        $this->$atributo = $valor;
    }

    public function getAllProducts() {
        $query = "SELECT id, ds_product, unit, sale_price, stock_quantity, minimum_stock, is_active
                  FROM tb_product
                  ORDER BY ds_product";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function findByProduct(string $ds_product): ?array {
        $query = "SELECT id, ds_product FROM tb_product WHERE ds_product = :ds_product LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_product', $ds_product, \PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(\PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public function getById($id) {
        $query = "SELECT * FROM tb_product WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }

    public function save() {
        $query = "INSERT INTO tb_product (ds_product, unit, sale_price, stock_quantity, minimum_stock, is_active)
                  VALUES (:ds_product, :unit, :sale_price, :stock_quantity, :minimum_stock, :is_active)";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_product', (string) $this->__get('ds_product'), \PDO::PARAM_STR);
        $stmt->bindValue(':unit', (string) $this->__get('unit'), \PDO::PARAM_STR);
        $stmt->bindValue(':sale_price', (float) $this->__get('sale_price'), \PDO::PARAM_STR);
        $stmt->bindValue(':stock_quantity', (int) $this->__get('stock_quantity'), \PDO::PARAM_INT);
        $stmt->bindValue(':minimum_stock', (int) $this->__get('minimum_stock'), \PDO::PARAM_INT);
        $stmt->bindValue(':is_active', (int) $this->__get('is_active'), \PDO::PARAM_INT);
        $stmt->execute();
        $this->id = $this->db->lastInsertId();
        return $this->id;
    }

    public function update() {
        $query = "UPDATE tb_product SET ds_product = :ds_product, unit = :unit, sale_price = :sale_price,
                  stock_quantity = :stock_quantity, minimum_stock = :minimum_stock, is_active = :is_active
                  WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':ds_product', (string) $this->__get('ds_product'), \PDO::PARAM_STR);
        $stmt->bindValue(':unit', (string) $this->__get('unit'), \PDO::PARAM_STR);
        $stmt->bindValue(':sale_price', (float) $this->__get('sale_price'), \PDO::PARAM_STR);
        $stmt->bindValue(':stock_quantity', (int) $this->__get('stock_quantity'), \PDO::PARAM_INT);
        $stmt->bindValue(':minimum_stock', (int) $this->__get('minimum_stock'), \PDO::PARAM_INT);
        $stmt->bindValue(':is_active', (int) $this->__get('is_active'), \PDO::PARAM_INT);
        $stmt->bindValue(':id', (int) $this->__get('id'), \PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function deleteById($id) {
        $query = "DELETE FROM tb_product WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(':id', (int)$id, \PDO::PARAM_INT);
        return $stmt->execute();
    }
}
