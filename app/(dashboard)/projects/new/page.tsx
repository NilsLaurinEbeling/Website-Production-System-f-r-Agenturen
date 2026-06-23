import { redirect } from "next/navigation"
import { getAgencyContext, canManage } from "@/lib/agency/queries"
import { NewProjectForm } from "@/components/dashboard/NewProjectForm"

export default async function NewProjectPage() {
  const ctx = await getAgencyContext()
  if (!ctx) redirect("/onboarding")
  if (!canManage(ctx.role)) redirect("/")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Neues Projekt</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Lege den Kunden an und fülle den Steckbrief aus. Anschließend startet
          die KI-Pipeline automatisch.
        </p>
      </div>
      <NewProjectForm />
    </div>
  )
}

export const dynamic = "force-dynamic"
