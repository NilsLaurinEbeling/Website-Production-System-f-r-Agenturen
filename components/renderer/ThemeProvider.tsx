import { type Theme } from "@/lib/schema/site-config"

const FONT_STACK: Record<string, string> = {
  inter:         '"Inter", system-ui, sans-serif',
  "cal-sans":    '"Cal Sans", "Inter", system-ui, sans-serif',
  playfair:      '"Playfair Display", Georgia, serif',
  "space-grotesk": '"Space Grotesk", system-ui, sans-serif',
  "dm-sans":     '"DM Sans", system-ui, sans-serif',
  lato:          '"Lato", system-ui, sans-serif',
  "source-sans": '"Source Sans 3", system-ui, sans-serif',
  nunito:        '"Nunito", system-ui, sans-serif',
}

const RADIUS_MAP: Record<Theme["radius"], string> = {
  none: "0px",
  sm:   "4px",
  md:   "8px",
  lg:   "12px",
  full: "9999px",
}

const SHADOW_MAP: Record<Theme["shadow"], string> = {
  none:      "none",
  sm:        "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md:        "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  dramatic:  "0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
}

const FONT_URLS: Record<string, string> = {
  playfair:       "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap",
  "space-grotesk":"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap",
  "dm-sans":      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap",
  lato:           "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap",
  "source-sans":  "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap",
  nunito:         "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap",
}

interface ThemeProviderProps {
  theme: Theme
  children: React.ReactNode
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const { colors, typography, radius, shadow } = theme

  const cssVars: Record<string, string> = {
    "--site-primary":    colors.primary,
    "--site-secondary":  colors.secondary,
    "--site-accent":     colors.accent,
    "--site-background": colors.background,
    "--site-text":       colors.text,
    "--site-muted":      colors.muted,
    "--site-radius":     RADIUS_MAP[radius],
    "--site-shadow":     SHADOW_MAP[shadow],
    "--site-heading-font": FONT_STACK[typography.headingFont] ?? FONT_STACK.inter,
    "--site-body-font":    FONT_STACK[typography.bodyFont]    ?? FONT_STACK.inter,
  }

  const fontUrls = [
    FONT_URLS[typography.headingFont],
    FONT_URLS[typography.bodyFont],
  ].filter(Boolean)

  return (
    <>
      {fontUrls.map((url) => (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link key={url} rel="stylesheet" href={url} />
      ))}
      <div
        style={cssVars as React.CSSProperties}
        className="min-h-screen"
      >
        {children}
      </div>
    </>
  )
}
