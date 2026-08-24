-- Corrigir tipo da coluna hr_servicehours: TIMESTAMP → TIME
-- O formulário envia apenas HH:MM, não datetime completo
ALTER TABLE tb_checklist MODIFY COLUMN hr_servicehours TIME NULL;

-- Garantir que dt_finished_at existe (pode já ter sido executado separadamente)
ALTER TABLE tb_checklist ADD COLUMN IF NOT EXISTS dt_finished_at DATETIME NULL DEFAULT NULL COMMENT 'Data/hora em que o checklist foi finalizado' AFTER nr_fuellevel;
