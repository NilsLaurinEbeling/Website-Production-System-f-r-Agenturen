-- =============================================================================
-- Phase 7 — Agency Mode
--
-- Introduces the agency tenancy model on top of the original per-customer
-- schema:
--   agencies            — the tenant; one row per agency
--   agency_members      — auth.users ↔ agencies with a role
--   white_label_configs — per-agency dashboard branding (logo, portal domain)
--
-- Projects become agency-owned (agency_id + created_by). The legacy
-- projects.customer_id is kept (nullable) for backward compatibility and is
-- backfilled into a personal agency for every existing owner.
-- =============================================================================

-- --- Tables ------------------------------------------------------------------

CREATE TABLE agencies (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  slug       text UNIQUE NOT NULL,          -- white-label subdomain / portal slug
  logo_url   text,
  plan       text NOT NULL DEFAULT 'free'
               CHECK (plan IN ('free', 'growth', 'agency')),
  owner_id   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE agency_members (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id  uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       text NOT NULL DEFAULT 'member'
               CHECK (role IN ('owner', 'admin', 'member')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (agency_id, user_id)
);

CREATE INDEX agency_members_user_idx ON agency_members (user_id);

CREATE TABLE white_label_configs (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id      uuid UNIQUE NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  agency_name    text NOT NULL,
  logo_url       text,
  custom_domain  text UNIQUE,               -- dashboard portal domain, e.g. portal.agency.com
  from_email     text,
  reply_to_email text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- --- Projects: become agency-owned --------------------------------------------

ALTER TABLE projects
  ADD COLUMN agency_id    uuid REFERENCES agencies(id) ON DELETE CASCADE,
  ADD COLUMN created_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN client_name  text,
  ADD COLUMN client_email text;

CREATE INDEX projects_agency_idx ON projects (agency_id);

-- --- Backfill: a personal agency per existing project owner --------------------

DO $$
DECLARE
  owner record;
  new_agency_id uuid;
BEGIN
  FOR owner IN
    SELECT DISTINCT customer_id
    FROM projects
    WHERE customer_id IS NOT NULL
  LOOP
    INSERT INTO agencies (name, slug, owner_id)
    VALUES (
      'My Agency',
      'agency-' || replace(owner.customer_id::text, '-', ''),
      owner.customer_id
    )
    RETURNING id INTO new_agency_id;

    INSERT INTO agency_members (agency_id, user_id, role)
    VALUES (new_agency_id, owner.customer_id, 'owner');

    UPDATE projects
    SET agency_id = new_agency_id,
        created_by = customer_id
    WHERE customer_id = owner.customer_id;
  END LOOP;
END $$;

-- --- Auto-enroll the owner as the first member --------------------------------

-- When an agency is created, the creator can't yet insert their own
-- agency_members row (the roster RLS policy requires existing membership), so a
-- SECURITY DEFINER trigger enrolls the owner as 'owner' automatically.
CREATE OR REPLACE FUNCTION public.enroll_agency_owner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.owner_id IS NOT NULL THEN
    INSERT INTO agency_members (agency_id, user_id, role)
    VALUES (NEW.id, NEW.owner_id, 'owner')
    ON CONFLICT (agency_id, user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER agencies_enroll_owner
  AFTER INSERT ON agencies
  FOR EACH ROW EXECUTE FUNCTION public.enroll_agency_owner();

-- --- RLS helpers --------------------------------------------------------------

-- The set of agencies the current user belongs to. SECURITY DEFINER avoids
-- recursive RLS evaluation when policies reference agency_members.
CREATE OR REPLACE FUNCTION public.user_agency_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT agency_id FROM agency_members WHERE user_id = auth.uid()
$$;

-- The set of agencies the current user can administer (owner/admin).
CREATE OR REPLACE FUNCTION public.managed_agency_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT agency_id FROM agency_members
  WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
$$;

-- --- Replace per-customer RLS with agency-scoped RLS --------------------------

DROP POLICY IF EXISTS "customers_own_projects"     ON projects;
DROP POLICY IF EXISTS "customers_own_briefs"       ON briefs;
DROP POLICY IF EXISTS "customers_read_briefings"   ON design_briefings;
DROP POLICY IF EXISTS "customers_read_own_configs" ON site_configs;
DROP POLICY IF EXISTS "customers_own_revisions"    ON revisions;
DROP POLICY IF EXISTS "customers_read_deployments" ON deployments;

ALTER TABLE agencies            ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_members      ENABLE ROW LEVEL SECURITY;
ALTER TABLE white_label_configs ENABLE ROW LEVEL SECURITY;

-- Agencies: members read; owners/admins update; any authenticated user may
-- create an agency (they become the owner via the API).
CREATE POLICY "members_read_agencies"
  ON agencies FOR SELECT
  USING (id IN (SELECT public.user_agency_ids()));

CREATE POLICY "managers_update_agencies"
  ON agencies FOR UPDATE
  USING (id IN (SELECT public.managed_agency_ids()));

CREATE POLICY "users_create_agencies"
  ON agencies FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Agency members: members read the roster; managers add/remove members.
CREATE POLICY "members_read_roster"
  ON agency_members FOR SELECT
  USING (agency_id IN (SELECT public.user_agency_ids()));

CREATE POLICY "managers_write_roster"
  ON agency_members FOR ALL
  USING (agency_id IN (SELECT public.managed_agency_ids()))
  WITH CHECK (agency_id IN (SELECT public.managed_agency_ids()));

-- White-label: members read; managers write.
CREATE POLICY "members_read_white_label"
  ON white_label_configs FOR SELECT
  USING (agency_id IN (SELECT public.user_agency_ids()));

CREATE POLICY "managers_write_white_label"
  ON white_label_configs FOR ALL
  USING (agency_id IN (SELECT public.managed_agency_ids()))
  WITH CHECK (agency_id IN (SELECT public.managed_agency_ids()));

-- Projects: any member may read/update; owners/admins may create/delete.
CREATE POLICY "members_read_projects"
  ON projects FOR SELECT
  USING (agency_id IN (SELECT public.user_agency_ids()));

CREATE POLICY "members_update_projects"
  ON projects FOR UPDATE
  USING (agency_id IN (SELECT public.user_agency_ids()));

CREATE POLICY "managers_insert_projects"
  ON projects FOR INSERT
  WITH CHECK (agency_id IN (SELECT public.managed_agency_ids()));

CREATE POLICY "managers_delete_projects"
  ON projects FOR DELETE
  USING (agency_id IN (SELECT public.managed_agency_ids()));

-- Child tables: access follows project membership.
CREATE POLICY "members_own_briefs"
  ON briefs FOR ALL
  USING (project_id IN (
    SELECT id FROM projects WHERE agency_id IN (SELECT public.user_agency_ids())
  ));

CREATE POLICY "members_read_briefings"
  ON design_briefings FOR SELECT
  USING (project_id IN (
    SELECT id FROM projects WHERE agency_id IN (SELECT public.user_agency_ids())
  ));

CREATE POLICY "members_read_configs"
  ON site_configs FOR SELECT
  USING (project_id IN (
    SELECT id FROM projects WHERE agency_id IN (SELECT public.user_agency_ids())
  ));

CREATE POLICY "members_own_revisions"
  ON revisions FOR ALL
  USING (project_id IN (
    SELECT id FROM projects WHERE agency_id IN (SELECT public.user_agency_ids())
  ));

CREATE POLICY "members_read_deployments"
  ON deployments FOR SELECT
  USING (project_id IN (
    SELECT id FROM projects WHERE agency_id IN (SELECT public.user_agency_ids())
  ));

-- public_read_published_configs (from 002) is retained: the live renderer reads
-- published configs by hostname via the service role, but keeping public SELECT
-- on published rows is harmless and supports anon preview of live sites.
