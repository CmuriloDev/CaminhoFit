-- 1. EXTENSÕES E TIPOS CUSTOMIZADOS 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tipo de atividade
CREATE TYPE activity_type AS ENUM ('corrida', 'academia', 'luta', 'calistenia', 'crossfit', 'funcional', 'esportes_coletivos');

-- Nível de movimento/lotação
CREATE TYPE crowd_level_type AS ENUM ('baixo', 'medio', 'alto');

-- 2. TABELA PRINCIPAL: LOCATIONS
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type activity_type NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  description TEXT,
  
  -- Campos Diferenciais
  busiest_time TEXT,
  crowd_level crowd_level_type DEFAULT 'medio',
  tags TEXT[], 
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices para busca rápida por localização
CREATE INDEX idx_locations_lat_long ON locations (latitude, longitude);

-- 3. SEGURANÇA (RLS - ROW LEVEL SECURITY)

-- Habilitar RLS na tabela de locais
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Criar Política: Qualquer pessoa (mesmo sem login) pode ler os locais
CREATE POLICY "Public Read Access" ON locations
  FOR SELECT USING (true);

-- 4. SEED DATA (DADOS PARA TESTE EM TERESINA)
INSERT INTO locations (name, type, latitude, longitude, description, busiest_time, crowd_level, tags)
VALUES 
(
  'Parque da Cidadania', 
  'corrida', 
  -5.0805, 
  -42.8115, 
  'Principal parque central de Teresina, com pista de cooper excelente.', 
  '05:30 - 08:00',  
  'alto', 
  '{"pista de cooper", "skate", "gratuito", "banheiros"}'
),
(
  'Academia Popular Raul Lopes', 
  'calistenia', 
  -5.0691, 
  -42.7937, 
  'Equipamentos de musculação ao ar livre próximos à Ponte Estaiada.', 
  '17:00 - 20:00',  
  'medio', 
  '{"ar livre", "gratuito", "vista rio"}'
),
(
  'Complexo Esportivo Parentão', 
  'esportes_coletivos', 
  -5.1278, 
  -42.7845, 
  'Quadras poliesportivas e campo de futebol na zona sul.', 
  'Noite',  
  'alto', 
  '{"futebol", "vôlei", "quadra", "popular"}'
);