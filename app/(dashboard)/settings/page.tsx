import { redirect } from "next/navigation"
import { getAgencyContext, canManage } from "@/lib/agency/queries"
import { createAdminClient } from "@/lib/supabase/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WhiteLabelForm } from "@/components/dashboard/WhiteLabelForm"
import { MembersManager, type MemberRow } from "@/components/dashboard/MembersManager"

export default async function SettingsPage() {
  const ctx = await getAgencyContext()
  if (!ctx) redirect("/onboarding")

  const manage = canManage(ctx.role)

  // Resolve member emails via the service role (the user is a member of this
  // agency, so listing its roster + emails is authorized at the app layer).
  const admin = createAdminClient()
  const { data: memberRows } = await admin
    .from("agency_members")
    .select("id, user_id, role, created_at")
    .eq("agency_id", ctx.agency.id)
    .order("created_at", { ascending: true })

  const members: MemberRow[] = []
  for (const m of memberRows ?? []) {
    const { data } = await admin.auth.admin.getUserById(m.user_id)
    members.push({
      id: m.id,
      role: m.role,
      email: data.user?.email ?? "—",
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Einstellungen</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Agentur „{ctx.agency.name}“ · deine Rolle: {ctx.role}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">White-Label-Branding</CardTitle>
          <CardDescription>
            Dein Logo, deine Portal-Domain und Absender-Adressen. Kunden sehen
            ausschließlich deine Marke.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WhiteLabelForm
            disabled={!manage}
            initial={{
              agency_name: ctx.whiteLabel?.agency_name ?? ctx.agency.name,
              logo_url: ctx.whiteLabel?.logo_url ?? "",
              custom_domain: ctx.whiteLabel?.custom_domain ?? "",
              from_email: ctx.whiteLabel?.from_email ?? "",
              reply_to_email: ctx.whiteLabel?.reply_to_email ?? "",
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team</CardTitle>
          <CardDescription>
            Lade Kolleg:innen zu deiner Agentur ein und verwalte Rollen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MembersManager members={members} canManage={manage} />
        </CardContent>
      </Card>
    </div>
  )
}

export const dynamic = "force-dynamic"
