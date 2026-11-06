import { Link } from 'react-router-dom'

import { TERMS_VERSION } from '../Data/Accounts.jsx' // adjust the path if Terms.jsx is not in src/pages

// DRAFT for review by your adviser (and a lawyer, if possible). It is not legal advice.
// When you change the text below, bump TERMS_VERSION in Data/Accounts.jsx so you know
// which version each user accepted.
const LAST_UPDATED = 'October 2026'
const CONTACT_EMAIL = 'your-email@example.com' // TODO: replace with a real address before sharing the site

const SECTIONS = [
  {
    title: '1. About Furpect Match',
    paragraphs: [
      'Furpect Match is an online platform that helps people who can offer a home to a pet (guardians) find domestic pets listed for adoption by pet owners and foster caretakers (providers). It was developed as an academic thesis project.',
      'Furpect Match is not a shelter, a pet shop or an adoption agency. We do not own, sell or hold any of the pets listed on the platform.',
    ],
  },
  {
    title: '2. Eligibility and your account',
    paragraphs: [
      'You must be at least 18 years old to create an account. The information you give us must be true and up to date.',
      'You are responsible for keeping your password secure and for everything that happens under your account. Please create only one account per person.',
    ],
  },
  {
    title: '3. Identity verification',
    paragraphs: [
      'To keep the community safe, we may ask you to verify your identity with a valid government-issued ID. Until your account is verified, you can browse pets, but you cannot send adoption requests or messages.',
      'We use ID images only to check your identity. They are stored privately, and only authorized administrators can open them. We keep them only as long as needed for verification and as the law requires.',
    ],
  },
  {
    title: '4. Listing a pet',
    paragraphs: [
      'Only domestic pets may be listed, such as dogs, cats, rabbits, birds and other small domestic animals. Wild animals, exotic animals and protected species are not allowed.',
      'If you are a provider, you confirm that you are the owner or an authorized caretaker of the pet, and that the details and photos you post are accurate and honest, including the pet’s health, vaccination status and behavior.',
      'Listings are for adoption or rehoming. Do not use the platform to sell, breed for sale or traffic animals.',
    ],
  },
  {
    title: '5. Adoption requests and your responsibilities',
    paragraphs: [
      'Furpect Match helps guardians and providers get in touch. Providers decide whom to approve, and guardians decide whether to proceed. Any agreement about an adoption is between the guardian and the provider, and Furpect Match is not a party to it.',
      'Guardians should be prepared to give a pet proper food, shelter, veterinary care and attention for its whole life. We recommend meeting in a safe public place and checking the pet’s health records before adopting.',
    ],
  },
  {
    title: '6. Match scores and recommendations',
    paragraphs: [
      'Match scores and recommendations are produced by a computer model from the answers you give and from pet listings. They are meant to help you review candidate pets and are not a guarantee that a pet is right for you or that an adoption will succeed.',
      'A match percentage is relative: it compares pets with each other and does not measure the chance of a successful adoption. Always use your own judgment and the normal steps of responsible adoption.',
    ],
  },
  {
    title: '7. Your personal information',
    paragraphs: [
      'We collect the information you give us, such as your name, email address, mobile number, location, lifestyle and pet preferences, pet listings, messages and, for verification, an ID image. We use it to run the platform, to match guardians with pets, to keep the community safe and to contact you about your account.',
      'We do not sell your personal information. We show other users only what is needed for an adoption, such as your name and the details in your requests and messages. We handle personal data in line with the Data Privacy Act of 2012 (Republic Act No. 10173).',
      `You may ask to see, correct or delete your information, or to close your account, by writing to ${CONTACT_EMAIL}.`,
    ],
  },
  {
    title: '8. Acceptable use',
    paragraphs: [
      'Do not post false or misleading information, harass or threaten others, run scams, send spam, list animals you are not allowed to list, or try to reach other people’s accounts or data. We may remove listings, suspend accounts or refuse verification when these rules are broken.',
    ],
  },
  {
    title: '9. Content you post',
    paragraphs: [
      'You keep ownership of the photos and text you post. By posting them, you allow Furpect Match to display them on the platform so that the service can work. Only post photos you have the right to share.',
    ],
  },
  {
    title: '10. No warranty and limits of responsibility',
    paragraphs: [
      'Furpect Match is a prototype provided as is. It may be unavailable at times and may contain errors. We do not check every listing and are not responsible for disagreements between users, for the health or behavior of any pet, or for the outcome of any adoption, to the extent the law allows.',
    ],
  },
  {
    title: '11. Changes to these terms',
    paragraphs: [
      'We may update these terms. The version and date are shown at the top of this page. If we make an important change, we may ask you to accept the new version before you continue.',
    ],
  },
  {
    title: '12. Contact',
    paragraphs: [`Questions about these terms or about your data can be sent to ${CONTACT_EMAIL}.`],
  },
]

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#CACACA]/20 via-white to-[#CACACA]/20 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-2xl ring-1 ring-black/5 sm:p-10">
        <p className="text-sm uppercase tracking-[0.25em] text-[#683B0D]">Furpect Match</p>
        <h1 className="mt-4 text-3xl font-semibold text-[#683B0D]">Terms and Conditions</h1>
        <p className="mt-2 text-sm text-[#989797]">
          Version {TERMS_VERSION} · Last updated {LAST_UPDATED}
        </p>

        <div className="mt-8 space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-[#683B0D]">{section.title}</h2>
              <div className="mt-2 space-y-3 text-sm leading-relaxed text-[#683B0D]/90">
                {section.paragraphs.map((text) => (
                  <p key={text}>{text}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm text-[#989797]">
          <Link to="/" className="font-semibold text-[#683B0D] hover:text-[#CEA74E]">
            Back to Furpect Match
          </Link>
        </p>
      </div>
    </div>
  )
}
