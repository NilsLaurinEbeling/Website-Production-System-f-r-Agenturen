import { type TeamSection } from "@/lib/schema/site-config"

interface Props {
  content: TeamSection["content"]
}

export function TeamGrid({ content }: Props) {
  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: "var(--site-background)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {(content.headline || content.subheadline) && (
          <div className="text-center mb-12">
            {content.headline && (
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                style={{
                  fontFamily: "var(--site-heading-font)",
                  color: "var(--site-text)",
                }}
              >
                {content.headline}
              </h2>
            )}
            {content.subheadline && (
              <p className="mt-4 text-lg" style={{ color: "var(--site-muted)" }}>
                {content.subheadline}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {content.members.map((member, i) => (
            <div key={i} className="text-center">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  style={{ boxShadow: "var(--site-shadow)" }}
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                  style={{
                    backgroundColor: "var(--site-accent)",
                    color: "var(--site-primary)",
                  }}
                >
                  {member.name[0]}
                </div>
              )}
              <p
                className="font-semibold"
                style={{
                  fontFamily: "var(--site-heading-font)",
                  color: "var(--site-text)",
                }}
              >
                {member.name}
              </p>
              <p className="text-sm mt-0.5" style={{ color: "var(--site-muted)" }}>
                {member.role}
              </p>
              {member.bio && (
                <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--site-muted)" }}>
                  {member.bio}
                </p>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--site-primary)" }}
                >
                  LinkedIn →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
