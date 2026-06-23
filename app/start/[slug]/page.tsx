import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getIntakeAgency } from "@/lib/agency/intake"
import { ClientIntakeForm } from "@/components/intake/ClientIntakeForm"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const agency = await getIntakeAgency(slug)
  if (!agency) return {}
  return {
    title: `Website-Anfrage · ${agency.name}`,
    description: `Starte deine neue Website mit ${agency.name}.`,
    robots: { index: false, follow: false },
  }
}

/**
 * Public, white-label intake landing page for an agency's clients.
 *
 * The agency shares `/start/[slug]` with prospective clients. The client fills
 * in a short brief and submits it — no account required — which creates a
 * project inside the agency and starts the generation pipeline.
 */
export default async function ClientIntakePage({ params }: Props) {
  const { slug } = await params
  const agency = await getIntakeAgency(slug)
  if (!agency) notFound()

  const VALUE_POINTS = [
    {
      title: "In Minuten statt Wochen",
      body: "Fülle einen kurzen Steckbrief aus — den ersten Entwurf erstellen wir automatisch.",
    },
    {
      title: "Individuell auf dich zugeschnitten",
      body: "Design, Texte und Struktur entstehen passend zu deiner Branche und deinem Stil.",
    },
    {
      title: "Du behältst die Kontrolle",
      body: "Du bekommst eine Vorschau und kannst Änderungen wünschen, bevor wir live gehen.",
    },
  ]

  return (
    <div className="min-h-screen bg-[hsl(var(--muted))]">
      <header className="border-b bg-[hsl(var(--background))]">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center px-4">
          <div className="flex items-center gap-2 font-semibold">
            {agency.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={agency.logoUrl} alt={agency.name} className="h-8 w-auto" />
            ) : (
              <span className="text-lg">{agency.name}</span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-12">
        <section className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Deine neue Website — gebaut von {agency.name}
          </h1>
          <p className="mt-4 text-base text-[hsl(var(--muted-foreground))]">
            Erzähl uns kurz von deinem Unternehmen. Wir erstellen daraus einen
            ersten Entwurf und melden uns mit deiner Vorschau.
          </p>
        </section>

        <section className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {VALUE_POINTS.map((p) => (
            <div
              key={p.title}
              className="rounded-lg border bg-[hsl(var(--background))] p-4"
            >
              <h3 className="text-sm font-semibold">{p.title}</h3>
              <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                {p.body}
              </p>
            </div>
          ))}
        </section>

        <section className="mx-auto mt-12 max-w-2xl">
          <ClientIntakeForm slug={agency.slug} agencyName={agency.name} />
        </section>

        <footer className="mx-auto mt-12 max-w-2xl text-center text-xs text-[hsl(var(--muted-foreground))]">
          Bereitgestellt von {agency.name}
        </footer>
      </main>
    </div>
  )
}

export const dynamic = "force-dynamic"
