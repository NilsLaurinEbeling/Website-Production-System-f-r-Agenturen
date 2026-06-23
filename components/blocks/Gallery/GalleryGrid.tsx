import { type GallerySection } from "@/lib/schema/site-config"

interface Props {
  content: GallerySection["content"]
}

export function GalleryGrid({ content }: Props) {
  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: "var(--site-background)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {content.headline && (
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-10 text-center"
            style={{
              fontFamily: "var(--site-heading-font)",
              color: "var(--site-text)",
            }}
          >
            {content.headline}
          </h2>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {content.images.map((img, i) => (
            <div
              key={i}
              className="group relative overflow-hidden aspect-square"
              style={{ borderRadius: "var(--site-radius)" }}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {img.caption && (
                <div className="absolute inset-0 flex items-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div
                    className="w-full p-3 text-xs"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                      color: "#fff",
                    }}
                  >
                    {img.caption}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
