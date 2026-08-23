-- Tabela de status do checklist
CREATE TABLE IF NOT EXISTS tb_checklist_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ds_status VARCHAR(50) NOT NULL,
    ds_description VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO tb_checklist_status (id, ds_status, ds_description) VALUES
(1, 'Em andamento', 'Checklist ainda está sendo preenchido'),
(2, 'Aguardando aprovação', 'Todas as etapas foram concluídas, aguardando aprovação');

-- Adicionar campo current_step na tabela tb_checklist
ALTER TABLE tb_checklist ADD COLUMN current_step INT NOT NULL DEFAULT 1 COMMENT 'Etapa atual do checklist (1-4)' AFTER id_status;

-- Adicionar foreign key de id_status para tb_checklist_status
ALTER TABLE tb_checklist ADD CONSTRAINT fk_checklist_status FOREIGN KEY (id_status) REFERENCES tb_checklist_status(id) ON DELETE RESTRICT;
