CREATE TABLE IF NOT EXISTS ideas (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 140),
  pillar TEXT NOT NULL CHECK (pillar IN ('tech','life','both')),
  format TEXT NOT NULL CHECK (format IN ('reels','carrossel','stories','post','live')),
  status TEXT NOT NULL DEFAULT 'idea' CHECK (status IN ('idea','script','production','published')),
  scheduled_date TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
CREATE INDEX IF NOT EXISTS idx_ideas_pillar ON ideas(pillar);

CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL CHECK (length(brand) BETWEEN 1 AND 140),
  campaign_name TEXT,
  format TEXT NOT NULL CHECK (format IN ('reels','stories','post','combo')),
  value REAL NOT NULL CHECK (value >= 0),
  campaign_status TEXT NOT NULL DEFAULT 'negotiating'
    CHECK (campaign_status IN ('negotiating','confirmed','in_progress','completed')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid')),
  campaign_date TEXT,
  payment_due_date TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_campaigns_campaign_status ON campaigns(campaign_status);
CREATE INDEX IF NOT EXISTS idx_campaigns_payment_status ON campaigns(payment_status);
