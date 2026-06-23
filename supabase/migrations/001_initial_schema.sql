-- Projects: one row per customer website project
CREATE TABLE projects (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status        text NOT NULL DEFAULT 'intake'
                  CHECK (status IN (
                    'intake', 'planning', 'research', 'generating',
                    'review', 'preview', 'revising', 'approved',
                    'deploying', 'live', 'failed'
                  )),
  domain        text UNIQUE,
  error_message text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Intake form data submitted by the customer
CREATE TABLE briefs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  data       jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Research output from the Research Agent (Sonnet + web_search)
CREATE TABLE design_briefings (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  data       jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Versioned site configs — the source of truth for rendering
CREATE TABLE site_configs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version    integer NOT NULL DEFAULT 1,
  status     text NOT NULL DEFAULT 'draft'
               CHECK (status IN ('draft', 'published')),
  config     jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, version)
);

-- Revision requests and their resulting config patches
CREATE TABLE revisions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  message      text NOT NULL,
  intents      jsonb,
  config_patch jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Vercel deployment records
CREATE TABLE deployments (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id           uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  vercel_deployment_id text,
  vercel_project_id    text,
  domain               text,
  status               text NOT NULL DEFAULT 'queued'
                         CHECK (status IN ('queued', 'building', 'ready', 'error')),
  created_at           timestamptz NOT NULL DEFAULT now()
);

-- Auto-update projects.updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
