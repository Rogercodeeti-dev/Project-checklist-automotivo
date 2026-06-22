-- Adicionar campos para recuperação de senha na tabela tb_user
ALTER TABLE tb_user ADD COLUMN reset_token VARCHAR(255) NULL;
ALTER TABLE tb_user ADD COLUMN reset_expires DATETIME NULL;
-- Adicionar coluna id_company em tb_setting para referenciar empresa
ALTER TABLE tb_setting ADD COLUMN IF NOT EXISTS id_company INT NULL;
-- Adicionar novos campos de sistema e empresa em tb_setting
ALTER TABLE tb_setting ADD COLUMN IF NOT EXISTS nm_socialreazon VARCHAR(255) NULL;
ALTER TABLE tb_setting ADD COLUMN IF NOT EXISTS nm_fantasyname VARCHAR(255) NULL;
ALTER TABLE tb_setting ADD COLUMN IF NOT EXISTS nr_cnpj VARCHAR(20) NULL;
ALTER TABLE tb_setting ADD COLUMN IF NOT EXISTS nr_zipcode VARCHAR(15) NULL;
ALTER TABLE tb_setting ADD COLUMN IF NOT EXISTS ds_url VARCHAR(255) NULL;
ALTER TABLE tb_setting ADD COLUMN IF NOT EXISTS ds_instagram VARCHAR(80) NULL;
-- Adicionar chave estrangeira (ajuste conforme necessário no ambiente)
ALTER TABLE tb_setting ADD CONSTRAINT IF NOT EXISTS fk_setting_company FOREIGN KEY (id_company) REFERENCES tb_company(id_company) ON DELETE SET NULL;

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS tb_client (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ds_persontype ENUM('F','J') NOT NULL DEFAULT 'F' COMMENT 'F=Física, J=Jurídica',
    nr_cpf VARCHAR(14) NULL,
    nr_cnpj VARCHAR(18) NULL,
    nm_name VARCHAR(255) NOT NULL,
    nm_socialreazon VARCHAR(255) NULL,
    nm_fantasyname VARCHAR(255) NULL,
    nr_phone VARCHAR(20) NULL,
    ds_email VARCHAR(255) NULL,
    nr_zipcode VARCHAR(15) NULL,
    ds_street VARCHAR(255) NULL,
    nr_address VARCHAR(20) NULL,
    ds_neighborhood VARCHAR(255) NULL,
    nm_city VARCHAR(255) NULL,
    sg_state VARCHAR(2) NULL,
    dt_register DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_cpf (nr_cpf),
    UNIQUE KEY uk_cnpj (nr_cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;