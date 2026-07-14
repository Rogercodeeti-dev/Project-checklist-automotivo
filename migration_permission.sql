-- Tabela de Permissões
CREATE TABLE IF NOT EXISTS tb_permission (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ds_module VARCHAR(50) NOT NULL,
    ds_description VARCHAR(50) NOT NULL,
    dt_register DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_module_description (ds_module, ds_description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
