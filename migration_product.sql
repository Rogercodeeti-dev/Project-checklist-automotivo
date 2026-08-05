-- Migration: Tabela de Produtos
CREATE TABLE IF NOT EXISTS tb_product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ds_product VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL DEFAULT 'UN',
    sale_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0,
    minimum_stock INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    UNIQUE KEY uk_ds_product (ds_product)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
