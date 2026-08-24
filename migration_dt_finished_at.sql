-- Adicionar coluna dt_finished_at na tabela tb_checklist
-- Campo preenchido automaticamente ao finalizar o checklist (status 2)
ALTER TABLE tb_checklist ADD COLUMN dt_finished_at DATETIME NULL DEFAULT NULL COMMENT 'Data/hora em que o checklist foi finalizado' AFTER nr_fuellevel;
