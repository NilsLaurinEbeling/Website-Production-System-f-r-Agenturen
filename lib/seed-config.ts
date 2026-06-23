import { type SiteConfig } from "@/lib/schema/site-config"

export const SEED_CONFIG: SiteConfig = {
  version: 1,
  metadata: {
    title: "Handwerk Meyer — Ihr Schreiner vor Ort",
    description: "Qualitäts-Schreinerei für Küchen, Treppen und Möbel. Seit 1987 in München.",
    favicon_emoji: "🪵",
  },
  navigation: {
    logo_text: "Meyer Schreinerei",
    links: [
      { label: "Leistungen", href: "#features" },
      { label: "Referenzen", href: "#testimonials" },
      { label: "Über uns",   href: "#about" },
      { label: "Kontakt",    href: "#cta" },
    ],
    cta: { label: "Anfrage stellen", href: "#cta" },
  },
  theme: {
    colors: {
      primary:    "#1a1a2e",
      secondary:  "#16213e",
      accent:     "#f5f0e8",
      background: "#fafaf9",
      text:       "#1a1a2e",
      muted:      "#6b7280",
    },
    typography: {
      headingFont: "playfair",
      bodyFont:    "lato",
      scale:       "default",
    },
    radius: "md",
    shadow: "md",
  },
  sections: [
    {
      id: "00000000-0000-0000-0000-000000000001",
      type: "hero",
      variant: "split",
      order: 0,
      enabled: true,
      content: {
        headline:    "Holz mit Herz — Schreinerei seit 1987",
        subheadline: "Von der Maßküche bis zur Treppe: Wir fertigen alles, was Ihr Zuhause braucht. Persönlich, präzise, aus München.",
        badge: "Familienbetrieb · 35+ Jahre Erfahrung",
        cta_primary:   { label: "Kostenloses Angebot", href: "#cta" },
        cta_secondary: { label: "Referenzen ansehen",  href: "#testimonials" },
      },
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      type: "features",
      variant: "grid",
      order: 1,
      enabled: true,
      content: {
        headline:    "Was wir für Sie tun",
        subheadline: "Jedes Stück entsteht in unserer Werkstatt in München-Pasing — von Hand gefertigt, auf Sie zugeschnitten.",
        items: [
          {
            icon: "star",
            title: "Maßküchen",
            description: "Individuell geplant, bis ins letzte Detail abgestimmt. Vom Entwurf bis zur Montage aus einer Hand.",
          },
          {
            icon: "settings",
            title: "Treppen & Geländer",
            description: "Massivholz oder Kombination: Wir bauen Treppen, die halten — und die man sehen will.",
          },
          {
            icon: "leaf",
            title: "Möbel nach Maß",
            description: "Regale, Schränke, Sideboards. Alles genau für Ihren Raum — kein Kompromiss nötig.",
          },
          {
            icon: "shield",
            title: "Restaurierung",
            description: "Alte Stücke neu beleben. Wir reparieren, schleifen und ölen Erbstücke mit dem gleichen Respekt wie Neuanfertigungen.",
          },
          {
            icon: "check",
            title: "Montage & Service",
            description: "Pünktlich, sauber, fertig. Unser Team kümmert sich um alles — Sie müssen nichts tun.",
          },
          {
            icon: "heart",
            title: "Nachhaltige Materialien",
            description: "Wir arbeiten mit zertifizierten Hölzern und umweltfreundlichen Ölen und Lacken.",
          },
        ],
      },
    },
    {
      id: "00000000-0000-0000-0000-000000000003",
      type: "testimonials",
      variant: "cards",
      order: 2,
      enabled: true,
      content: {
        headline: "Was unsere Kunden sagen",
        items: [
          {
            quote:  "Die Küche ist ein Traum. Herr Meyer hat jeden Wunsch umgesetzt — und das zu einem fairen Preis. Immer wieder!",
            author: "Sabine K.",
            role:   "München-Schwabing",
            rating: 5,
          },
          {
            quote:  "Unsere alte Eichentreppe hat eine zweite Jugend bekommen. Handwerk auf höchstem Niveau.",
            author: "Thomas R.",
            role:   "München-Bogenhausen",
            rating: 5,
          },
          {
            quote:  "Super Kommunikation, termingerecht fertig, kein Staub in der Wohnung. Perfekt.",
            author: "Julia M.",
            role:   "Grünwald",
            rating: 5,
          },
        ],
      },
    },
    {
      id: "00000000-0000-0000-0000-000000000004",
      type: "about",
      variant: "split",
      order: 3,
      enabled: true,
      content: {
        headline: "Drei Generationen. Eine Leidenschaft.",
        body:     "Seit 1987 führt die Familie Meyer ihren Schreinereibetrieb in München-Pasing. Was als kleine Werkstatt begann, ist heute ein Team von zwölf Fachleuten mit modernsten Maschinen — und dem gleichen Anspruch wie am ersten Tag: jedes Stück so bauen, als wäre es für die eigene Wohnung.\n\nUnser Geheimnis? Wir hören zu. Bevor ein Span fällt, sprechen wir ausführlich über Ihre Wünsche, Ihren Raum und Ihr Budget.",
        stats: [
          { value: "35+", label: "Jahre Erfahrung" },
          { value: "1.200+", label: "Projekte abgeschlossen" },
          { value: "12",   label: "Fachkräfte im Team" },
          { value: "98 %", label: "Weiterempfehlungsrate" },
        ],
      },
    },
    {
      id: "00000000-0000-0000-0000-000000000005",
      type: "cta",
      variant: "centered",
      order: 4,
      enabled: true,
      content: {
        headline:    "Bereit für Ihr Projekt?",
        subheadline: "Schreiben Sie uns — wir melden uns innerhalb von 24 Stunden mit einem kostenlosen Erstgespräch.",
        cta_primary:   { label: "Jetzt Anfrage senden", href: "mailto:kontakt@meyer-schreinerei.de" },
        cta_secondary: { label: "0 89 / 12 34 56 78",  href: "tel:+498912345678" },
      },
    },
    {
      id: "00000000-0000-0000-0000-000000000006",
      type: "footer",
      variant: "minimal",
      order: 5,
      enabled: true,
      content: {
        logo_text: "Meyer Schreinerei",
        tagline:   "Holz mit Herz seit 1987",
        copyright: "© 2025 Schreinerei Meyer GmbH & Co. KG",
        legal_links: [
          { label: "Impressum",    href: "/impressum" },
          { label: "Datenschutz", href: "/datenschutz" },
        ],
      },
    },
  ],
}
