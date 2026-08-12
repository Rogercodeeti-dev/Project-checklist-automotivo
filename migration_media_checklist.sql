-- Migration: Adicionar coluna nr_workorder em tb_checklist_media
-- Permite relação 1:N (um checklist pode ter várias fotos e vídeos)

ALTER TABLE tb_checklist_media
    ADD COLUMN nr_workorder VARCHAR(30) NULL AFTER media_id;

-- Índice para performance nas consultas por checklist
CREATE INDEX idx_checklist_media_workorder ON tb_checklist_media(nr_workorder);

-- Remover coluna media_id de tb_checklist (não é mais necessária)
-- A relação agora é via nr_workorder em tb_checklist_media
ALTER TABLE tb_checklist DROP COLUMN media_id;
