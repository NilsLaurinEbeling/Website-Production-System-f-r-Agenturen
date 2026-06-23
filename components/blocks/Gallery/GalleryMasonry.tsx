import { type GallerySection } from "@/lib/schema/site-config"

interface Props {
  content: GallerySection["content"]
}

export function GalleryMasonry({ content }: Props) {
  const col1 = content.images.filter((_, i) => i % 3 === 0)
  const col2 = content.images.filter((_, i) => i % 3 === 1)
  const col3 = content.images.filter((_, i) => i % 3 === 2)

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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {[col1, col2, col3].map((col, ci) => (
            <div key={ci} className="flex flex-col gap-3">
              {col.map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden"
                  style={{ borderRadius: "var(--site-radius)" }}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full object-cover transition-transform duration-300 hover:scale-105"
                    style={{ aspectRatio: i % 2 === 0 ? "4/3" : "3/4" }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
