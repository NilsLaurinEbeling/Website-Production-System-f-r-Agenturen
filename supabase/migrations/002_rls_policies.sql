-- Enable RLS on all tables
ALTER TABLE projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_configs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE revisions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployments     ENABLE ROW LEVEL SECURITY;

-- Projects: customers see only their own
CREATE POLICY "customers_own_projects"
  ON projects FOR ALL
  USING (customer_id = auth.uid());

-- Pipeline service role bypasses RLS (uses service key)

-- Briefs: tied to project ownership
CREATE POLICY "customers_own_briefs"
  ON briefs FOR ALL
  USING (
    project_id IN (
      SELECT id FROM projects WHERE customer_id = auth.uid()
    )
  );

-- Design briefings: read-only for project owner
CREATE POLICY "customers_read_briefings"
  ON design_briefings FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE customer_id = auth.uid()
    )
  );

-- Site configs: owner can read all versions; published configs are public for renderer
CREATE POLICY "customers_read_own_configs"
  ON site_configs FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE customer_id = auth.uid()
    )
  );

CREATE POLICY "public_read_published_configs"
  ON site_configs FOR SELECT
  USING (status = 'published');

-- Revisions: customers can insert and read their own
CREATE POLICY "customers_own_revisions"
  ON revisions FOR ALL
  USING (
    project_id IN (
      SELECT id FROM projects WHERE customer_id = auth.uid()
    )
  );

-- Deployments: read-only for project owner
CREATE POLICY "customers_read_deployments"
  ON deployments FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE customer_id = auth.uid()
    )
  );
