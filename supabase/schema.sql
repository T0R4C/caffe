-- ============================================================
-- JakartaCaffe — Database Schema
-- Run this SQL in Supabase SQL Editor to set up the database
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- Table: areas (Wilayah DKI Jakarta)
-- ============================================================
CREATE TABLE IF NOT EXISTS areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  cafe_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Table: cafes (Data Utama Kafe & Coffee Shop)
-- ============================================================
CREATE TABLE IF NOT EXISTS cafes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id TEXT UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  address TEXT,
  area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  phone TEXT,
  website TEXT,
  instagram TEXT,
  google_maps_url TEXT,
  rating DECIMAL(2, 1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  price_level TEXT CHECK (price_level IN ('$', '$$', '$$$', '$$$$')),
  opening_hours JSONB DEFAULT '{}',
  photos TEXT[] DEFAULT '{}',
  thumbnail TEXT,
  amenities JSONB DEFAULT '{}',
  description TEXT,
  cuisine_type TEXT[] DEFAULT ARRAY['coffee'],
  is_verified BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'overpass',
  last_scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Table: scrape_logs (Log Scraping Otomatis)
-- ============================================================
CREATE TABLE IF NOT EXISTS scrape_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  area TEXT,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'failed')),
  total_found INTEGER DEFAULT 0,
  total_new INTEGER DEFAULT 0,
  total_updated INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_cafes_area_id ON cafes(area_id);
CREATE INDEX IF NOT EXISTS idx_cafes_rating ON cafes(rating DESC);
CREATE INDEX IF NOT EXISTS idx_cafes_coordinates ON cafes(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_cafes_source ON cafes(source);
CREATE INDEX IF NOT EXISTS idx_cafes_slug ON cafes(slug);
CREATE INDEX IF NOT EXISTS idx_scrape_logs_status ON scrape_logs(status);

-- Trigram index for fuzzy name search
CREATE INDEX IF NOT EXISTS idx_cafes_name_trgm ON cafes USING gin(name gin_trgm_ops);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrape_logs ENABLE ROW LEVEL SECURITY;

-- Public read access for cafes
CREATE POLICY "Anyone can read cafes"
  ON cafes FOR SELECT
  USING (true);

-- Public read access for areas
CREATE POLICY "Anyone can read areas"
  ON areas FOR SELECT
  USING (true);

-- Service role can do everything on cafes
CREATE POLICY "Service role manages cafes"
  ON cafes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Service role can do everything on areas
CREATE POLICY "Service role manages areas"
  ON areas FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Service role can do everything on scrape_logs
CREATE POLICY "Service role manages scrape_logs"
  ON scrape_logs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================
-- Function: Auto-update updated_at timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cafes_updated_at
  BEFORE UPDATE ON cafes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Function: Auto-update cafe_count on areas
-- ============================================================
CREATE OR REPLACE FUNCTION update_area_cafe_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE areas SET cafe_count = (
      SELECT COUNT(*) FROM cafes WHERE area_id = NEW.area_id
    ) WHERE id = NEW.area_id;
  END IF;
  IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
    UPDATE areas SET cafe_count = (
      SELECT COUNT(*) FROM cafes WHERE area_id = OLD.area_id
    ) WHERE id = OLD.area_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cafes_area_count
  AFTER INSERT OR UPDATE OR DELETE ON cafes
  FOR EACH ROW
  EXECUTE FUNCTION update_area_cafe_count();

-- ============================================================
-- Seed Data: DKI Jakarta Areas
-- ============================================================
INSERT INTO areas (name, slug, latitude, longitude) VALUES
  ('Jakarta Pusat', 'jakarta-pusat', -6.1864, 106.8341),
  ('Jakarta Selatan', 'jakarta-selatan', -6.2615, 106.8106),
  ('Jakarta Barat', 'jakarta-barat', -6.1681, 106.7588),
  ('Jakarta Timur', 'jakarta-timur', -6.2250, 106.9005),
  ('Jakarta Utara', 'jakarta-utara', -6.1384, 106.8631),
  ('Kepulauan Seribu', 'kepulauan-seribu', -5.7222, 106.5947)
ON CONFLICT (slug) DO NOTHING;
