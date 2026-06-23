"use client"

import { useState } from "react"
import { type FAQSection } from "@/lib/schema/site-config"

interface Props {
  content: FAQSection["content"]
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="border-b"
      style={{ borderColor: "var(--site-muted)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left text-base font-medium transition-opacity hover:opacity-70"
        style={{ color: "var(--site-text)" }}
        aria-expanded={open}
      >
        <span>{question}</span>
        <span
          className="ml-4 flex-shrink-0 text-lg transition-transform duration-200"
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            color: "var(--site-primary)",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div
          className="pb-5 text-sm leading-relaxed"
          style={{ color: "var(--site-muted)" }}
        >
          {answer}
        </div>
      )}
    </div>
  )
}

export function FAQAccordion({ content }: Props) {
  return (
    <section
      className="py-16 sm:py-24"
      style={{ backgroundColor: "var(--site-background)" }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
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
        <div className="border-t" style={{ borderColor: "var(--site-muted)" }}>
          {content.items.map((item, i) => (
            <FAQItem key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}
