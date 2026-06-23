import { type TeamSection } from "@/lib/schema/site-config"

interface Props {
  content: TeamSection["content"]
}

export function TeamList({ content }: Props) {
  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: "var(--site-background)" }}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {content.headline && (
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-10"
            style={{
              fontFamily: "var(--site-heading-font)",
              color: "var(--site-text)",
            }}
          >
            {content.headline}
          </h2>
        )}
        <div className="divide-y" style={{ borderColor: "var(--site-muted)" }}>
          {content.members.map((member, i) => (
            <div key={i} className="flex items-start gap-6 py-6">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-bold"
                  style={{
                    backgroundColor: "var(--site-accent)",
                    color: "var(--site-primary)",
                  }}
                >
                  {member.name[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3">
                  <p
                    className="font-semibold"
                    style={{
                      fontFamily: "var(--site-heading-font)",
                      color: "var(--site-text)",
                    }}
                  >
                    {member.name}
                  </p>
                  <span className="text-sm" style={{ color: "var(--site-muted)" }}>
                    {member.role}
                  </span>
                </div>
                {member.bio && (
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--site-muted)" }}>
                    {member.bio}
                  </p>
                )}
              </div>
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--site-primary)" }}
                >
                  in
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
