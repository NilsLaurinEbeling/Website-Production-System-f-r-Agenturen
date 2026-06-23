-- =============================================================================
-- Fix: agency creation fails with "new row violates row-level security policy"
--
-- POST /api/agency inserts the agency with `.select("id")`, which adds a
-- RETURNING clause. Postgres applies the SELECT policy to RETURNING rows, but
-- the owner's agency_members row is only created by the AFTER INSERT trigger
-- (enroll_agency_owner) — which has not yet made the user a member at the
-- moment RETURNING is evaluated. The new row therefore fails the SELECT policy
-- and the whole insert is rejected.
--
-- Allow an owner to always read their own agency so RETURNING succeeds.
-- =============================================================================

DROP POLICY IF EXISTS "members_read_agencies" ON agencies;

CREATE POLICY "members_read_agencies"
  ON agencies FOR SELECT
  USING (id IN (SELECT public.user_agency_ids()) OR owner_id = auth.uid());
