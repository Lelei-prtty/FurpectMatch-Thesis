import { Fragment } from 'react'
import { TERMS_BY_ROLE, normalizeTermsRole } from '../Data/TermsContent.jsx'

// Shows **bold** parts of a string in bold.
function Inline({ text }) {
  return text.split('**').map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : <Fragment key={index}>{part}</Fragment>
  )
}

function TermsTable({ table }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-2xl border border-[#CACACA]">
      <table className="w-full min-w-[480px] border-collapse text-left text-sm text-[#683B0D]">
        <thead className="bg-[#CACACA]/30">
          <tr>
            {table.headers.map((header) => (
              <th key={header} className="px-4 py-2 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row[0]} className="border-t border-[#CACACA] align-top">
              {row.map((cell, index) => (
                <td key={index} className="px-4 py-2 text-[#683B0D]/90">
                  <Inline text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// The full Terms and Conditions for one role ('guardian' or 'provider').
// `headingLevel` lets the title be an h1 on the page and an h2 inside a pop-up.
export default function TermsDocument({ role, headingLevel = 2 }) {
  const terms = TERMS_BY_ROLE[normalizeTermsRole(role)]
  const Title = `h${headingLevel}`

  return (
    <article className="text-sm leading-relaxed text-[#683B0D]/90">
      <Title className="text-2xl font-semibold text-[#683B0D]">{terms.title}</Title>
      <p className="mt-3">
        <strong>Research title:</strong> {terms.researchTitle}
      </p>
      <p className="mt-1">
        <strong>Applies to:</strong> {terms.appliesTo}
      </p>

      {terms.sections.map((section) => (
        <section key={section.heading} className="mt-6">
          <h3 className="text-base font-semibold text-[#683B0D]">{section.heading}</h3>
          {section.intro && (
            <p className="mt-2">
              <Inline text={section.intro} />
            </p>
          )}
          {section.table && <TermsTable table={section.table} />}
          {section.bullets && (
            <ul className="mt-2 list-disc space-y-2 pl-5">
              {section.bullets.map((bullet) => (
                <li key={bullet}>
                  <Inline text={bullet} />
                </li>
              ))}
            </ul>
          )}
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="mt-3">
              <Inline text={paragraph} />
            </p>
          ))}
        </section>
      ))}

      <p className="mt-8 border-t border-[#CACACA] pt-5">{terms.closing}</p>
    </article>
  )
}
