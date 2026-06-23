import { type BlogPreviewSection } from "@/lib/schema/site-config"

interface Props {
  content: BlogPreviewSection["content"]
}

export function BlogPreviewCards({ content }: Props) {
  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: "var(--site-background)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {content.headline && (
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-10"
            style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-text)" }}>
            {content.headline}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.items.map((post, i) => (
            <article
              key={i}
              className="group flex flex-col overflow-hidden border"
              style={{ borderColor: "var(--site-muted)", borderRadius: "var(--site-radius)" }}
            >
              {post.image_url && (
                <div className="overflow-hidden aspect-[16/9]">
                  <img src={post.image_url} alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "var(--site-muted)" }}>
                  <time>{post.date}</time>
                  {post.author && <><span>·</span><span>{post.author}</span></>}
                </div>
                <h3 className="font-semibold text-base mb-2 leading-snug flex-1"
                  style={{ fontFamily: "var(--site-heading-font)", color: "var(--site-text)" }}>
                  {post.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--site-muted)" }}>
                  {post.excerpt}
                </p>
                <a href={`/blog/${post.slug}`}
                  className="mt-4 text-sm font-semibold transition-opacity hover:opacity-70"
                  style={{ color: "var(--site-primary)" }}>
                  Weiterlesen →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
