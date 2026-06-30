-- Adicionar colunas de endereço na tabela tb_client caso não existam
ALTER TABLE tb_client ADD COLUMN IF NOT EXISTS ds_street VARCHAR(255) NULL;
ALTER TABLE tb_client ADD COLUMN IF NOT EXISTS nr_address VARCHAR(20) NULL;
ALTER TABLE tb_client ADD COLUMN IF NOT EXISTS ds_neighborhood VARCHAR(255) NULL;
ALTER TABLE tb_client ADD COLUMN IF NOT EXISTS nm_city VARCHAR(255) NULL;
ALTER TABLE tb_client ADD COLUMN IF NOT EXISTS sg_state VARCHAR(2) NULL;