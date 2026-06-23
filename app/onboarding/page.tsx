import { redirect } from "next/navigation"
import { getAgencyContext, getCurrentUser } from "@/lib/agency/queries"
import { OnboardingForm } from "@/components/dashboard/OnboardingForm"

/**
 * First-run onboarding: a freshly signed-up user has no agency yet. Once they
 * create one they land on the dashboard. Users who already have an agency skip
 * straight through.
 */
export default async function OnboardingPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const ctx = await getAgencyContext()
  if (ctx) redirect("/")

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--muted))] p-4">
      <OnboardingForm />
    </div>
  )
}

export const dynamic = "force-dynamic"
