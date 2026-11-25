-- ============================================================
-- DAMA — Migração para suporte a Simulados com tempo limite
-- ------------------------------------------------------------
-- Uso:
--   1) Faça backup do banco antes (mysqldump -u root mathapp > backup.sql)
--   2) mysql -u root mathapp < sql/atualizacao_simulados.sql
--
-- Compatibilidade: MySQL 8.0+
-- Idempotente: pode rodar mais de uma vez sem erro.
-- ============================================================

USE `mathapp`;

-- ------------------------------------------------------------
-- 1) SIMULADO — colunas de estado, tempo e pontuação
-- ------------------------------------------------------------
-- Adiciona apenas se ainda não existirem (idempotente).
SET @db = 'mathapp';

SET @sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE `simulado`
       ADD COLUMN `status` ENUM(''criado'',''em_andamento'',''concluido'',''expirado'')
         NOT NULL DEFAULT ''criado'' AFTER `id_estudante`',
    'SELECT ''status já existe em simulado'' AS aviso'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'simulado' AND COLUMN_NAME = 'status'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE `simulado`
       ADD COLUMN `data_criacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `status`',
    'SELECT ''data_criacao já existe em simulado'' AS aviso'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'simulado' AND COLUMN_NAME = 'data_criacao'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE `simulado`
       ADD COLUMN `data_inicio` DATETIME DEFAULT NULL AFTER `data_criacao`',
    'SELECT ''data_inicio já existe em simulado'' AS aviso'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'simulado' AND COLUMN_NAME = 'data_inicio'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE `simulado`
       ADD COLUMN `data_fim` DATETIME DEFAULT NULL AFTER `data_inicio`',
    'SELECT ''data_fim já existe em simulado'' AS aviso'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'simulado' AND COLUMN_NAME = 'data_fim'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE `simulado`
       ADD COLUMN `pontuacao` INT NOT NULL DEFAULT 0 AFTER `data_fim`',
    'SELECT ''pontuacao já existe em simulado'' AS aviso'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'simulado' AND COLUMN_NAME = 'pontuacao'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ------------------------------------------------------------
-- 2) SIMULADO_QUESTAO — coluna de ordem
-- ------------------------------------------------------------
SET @sql = (
  SELECT IF(
    COUNT(*) = 0,
    'ALTER TABLE `simulado_questao`
       ADD COLUMN `ordem` INT NOT NULL DEFAULT 0',
    'SELECT ''ordem já existe em simulado_questao'' AS aviso'
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'simulado_questao' AND COLUMN_NAME = 'ordem'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ------------------------------------------------------------
-- 3) ESTUDANTE_QUESTAO — recriar com estrutura nova
-- ------------------------------------------------------------
-- Detecta se a tabela antiga (sem coluna `id`) ainda está lá.
-- Se estiver, dropa e recria. Se já estiver no formato novo,
-- não faz nada.
SET @precisa_recriar = (
  SELECT IF(
    COUNT(*) > 0 AND SUM(COLUMN_NAME = 'id') = 0,
    1, 0
  )
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'estudante_questao'
);

SET @sql = IF(
  @precisa_recriar = 1,
  'DROP TABLE `estudante_questao`',
  'SELECT ''estudante_questao já está no formato novo'' AS aviso'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS `estudante_questao` (
  `id`               INT NOT NULL AUTO_INCREMENT,
  `id_estudante`     INT NOT NULL,
  `id_questao`       INT NOT NULL,
  `id_simulado`      INT DEFAULT NULL,
  `alternativa_id`   INT DEFAULT NULL,
  `resposta`         CHAR(1) DEFAULT NULL,
  `acerto`           TINYINT(1) DEFAULT NULL,
  `data_realizacao`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unica_por_simulado` (`id_estudante`,`id_questao`,`id_simulado`),
  KEY `idx_eq_estudante`   (`id_estudante`),
  KEY `idx_eq_questao`     (`id_questao`),
  KEY `idx_eq_simulado`    (`id_simulado`),
  KEY `idx_eq_alternativa` (`alternativa_id`),
  CONSTRAINT `eq_ibfk_1` FOREIGN KEY (`id_estudante`)   REFERENCES `estudante`   (`id`) ON DELETE CASCADE,
  CONSTRAINT `eq_ibfk_2` FOREIGN KEY (`id_questao`)     REFERENCES `questao`     (`id`) ON DELETE CASCADE,
  CONSTRAINT `eq_ibfk_3` FOREIGN KEY (`id_simulado`)    REFERENCES `simulado`    (`id`) ON DELETE CASCADE,
  CONSTRAINT `eq_ibfk_4` FOREIGN KEY (`alternativa_id`) REFERENCES `alternativa` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 4) Conferência final
-- ------------------------------------------------------------
SELECT 'simulado' AS tabela, COLUMN_NAME, COLUMN_TYPE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'simulado'
ORDER BY ORDINAL_POSITION;

SELECT 'simulado_questao' AS tabela, COLUMN_NAME, COLUMN_TYPE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'simulado_questao'
ORDER BY ORDINAL_POSITION;

SELECT 'estudante_questao' AS tabela, COLUMN_NAME, COLUMN_TYPE
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = @db AND TABLE_NAME = 'estudante_questao'
ORDER BY ORDINAL_POSITION;