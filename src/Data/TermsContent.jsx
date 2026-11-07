// The Terms and Conditions text, taken from the research team's documents
// ("Terms and Conditions: Pet Guardian" and "Terms and Conditions: Pet Provider").
//
// Text between ** ** is shown in bold. To change a term, edit it here: the registration
// pop-up and the /terms page both read from this file. When the wording changes, also bump
// TERMS_VERSION in Data/Accounts.jsx so each account records which version was accepted.

const RESEARCH_TITLE =
  'Furpect Match: A Graph Neural Network-Based Pet Adoption Recommendation System with Reinforcement Learning'

const CONTACTS = {
  headers: ['Name', 'Email'],
  rows: [
    ['Abello, Keneth Luigi', 'keneth.luigi.abello@adamson.edu.ph'],
    ['Calimag, Rafael Owen', 'rafael.owen.calimag@adamson.edu.ph'],
    ['Dabu, John Lloyd', 'john.lloyd.dabu@adamson.edu.ph'],
    ['Reynancia, Jessie Lei', 'jessie.lei.reynancia@adamson.edu.ph'],
    ['Zambale, Henry', 'henry.zambale@adamson.edu.ph'],
  ],
}

const CONFIDENTIALITY = {
  heading: '4. Confidentiality and Data Privacy',
  paragraphs: [
    'All information you provide will be kept confidential and handled in compliance with the **Data Privacy Act of 2012 (Republic Act No. 10173)**. Access is limited to the research team. Results will be reported in summarized or anonymized form, and personal details will not be published.',
  ],
}

const RIGHTS = {
  heading: '6. Your Rights',
  intro: 'Under the Data Privacy Act, you have the right to:',
  bullets: [
    'Be informed about how your data is collected and used.',
    'Access and request correction of your data.',
    'Withdraw your consent and request removal of your data, subject to what the law allows.',
    'File a complaint with the National Privacy Commission if you believe your rights were violated.',
  ],
}

const NOT_PARTY =
  'The research team is not a party to, and is not responsible for, any adoption agreement made between a Pet Provider and a Pet Guardian.'

export const TERMS_BY_ROLE = {
  guardian: {
    title: 'Terms and Conditions: Pet Guardian',
    researchTitle: RESEARCH_TITLE,
    appliesTo: 'Possible Pet Guardians (adopters)',
    sections: [
      {
        heading: '1. About the Study',
        paragraphs: [
          'This research study aims to develop a web-based pet recommendation application for adoption. You will register as a possible **Pet Guardian**. You will be asked to share your preferences for taking care of a pet and information about your lifestyle.',
        ],
      },
      {
        heading: '2. Information We Will Collect',
        intro: 'By clicking **“I Agree”**, you allow the system to collect and process the following Pet Guardian Profile Data.',
        table: {
          headers: ['Category', 'What it includes', 'Why we collect it'],
          rows: [
            [
              '**Adoption Preferences**',
              'Preferred breed, pet size, age, sex, and any behavioral characteristics you are looking for in a pet',
              'To identify pets that fit what you want',
            ],
            [
              '**Lifestyle Factors**',
              'Living situation (e.g., apartment or house with open space); household structure (e.g., presence of children or other pets); amount of daily activity; hours spent at work; history of pet ownership',
              'To determine whether a pet’s care needs are compatible with your lifestyle',
            ],
          ],
        },
      },
      {
        heading: '3. How Your Information Will Be Used',
        bullets: [
          'To train, test, and evaluate the pet recommendation system, which uses Graph Neural Networks and Reinforcement Learning.',
          'To match you with pets whose care needs fit your lifestyle and preferences.',
          'For **academic purposes only**, including thesis writing and presentation of findings.',
        ],
        paragraphs: ['Your information will **not** be sold or used for commercial purposes.'],
      },
      CONFIDENTIALITY,
      {
        heading: '5. Your Responsibilities as a Pet Guardian',
        bullets: [
          'Provide information that is **accurate and honest**, since inaccurate details can lead to poor matches that affect both you and the pet.',
          'Understand that a recommendation is only a suggestion. Adopting a pet is a long-term commitment, and you remain responsible for deciding whether to adopt and for the pet’s welfare.',
        ],
      },
      RIGHTS,
      {
        heading: '7. Limitations',
        bullets: [
          'The system is an **academic prototype**. Recommendations are for research purposes and do not guarantee a successful or suitable adoption.',
          NOT_PARTY,
        ],
      },
      {
        heading: '8. Contact the Research Team',
        intro: 'For questions or concerns, please contact:',
        table: CONTACTS,
      },
    ],
    closing:
      'By clicking “I Agree”, I confirm that I have read and understood these Terms and Conditions, that I am participating voluntarily as a Pet Guardian, and that I allow the system to collect and use the Pet Guardian Profile Data listed above for academic purposes, in accordance with R.A. 10173.',
  },

  provider: {
    title: 'Terms and Conditions: Pet Provider',
    researchTitle: RESEARCH_TITLE,
    appliesTo: 'Pet Providers (Pet Owners, Foster Caretakers, and Pet Shops)',
    sections: [
      {
        heading: '1. About the Study',
        paragraphs: [
          'This research study aims to develop a web-based pet recommendation application for pet adoption. You will register as a **Pet Provider**. You will be asked to share firsthand information, based on your own experience, about a pet under your care, including its attributes, behavior, health, and care requirements.',
        ],
      },
      {
        heading: '2. Information We Will Collect',
        intro: 'By clicking **“I Agree”**, you allow the system to collect and process the following Pet Profile Data.',
        table: {
          headers: ['Category', 'What it includes', 'Why we collect it'],
          rows: [
            [
              '**Pet Attributes**',
              'Breed, age, sex, pet size, and color',
              'Primary identifiers for matching and filtering',
            ],
            [
              '**Behavioral Traits**',
              'Activity level (low, moderate, high); temperament (e.g., friendly, aggressive, shy); interaction with other animals and children',
              'Essential for lifestyle-based matching',
            ],
            [
              '**Health Information**',
              'Vaccination, medical, illness, or injury history',
              'Helps ensure guardians are aware of their obligations for the pet’s health',
            ],
            [
              '**Care Requirements**',
              'Feeding frequency, grooming needs, outdoor exercise',
              'Evaluated against the guardian’s lifestyle and capabilities',
            ],
          ],
        },
      },
      {
        heading: '3. How Your Information Will Be Used',
        bullets: [
          'To train, test, and evaluate the pet recommendation system, which uses Graph Neural Networks and Reinforcement Learning.',
          'To match pets with possible Pet Guardians based on compatibility.',
          'For **academic purposes only**, including thesis writing and presentation of findings.',
        ],
        paragraphs: ['Your information will **not** be sold or used for commercial purposes.'],
      },
      CONFIDENTIALITY,
      {
        heading: '5. Your Responsibilities as a Pet Provider',
        bullets: [
          'Provide information that is **accurate, honest, and based on your own firsthand experience** with the pet.',
          'Disclose known health, medical, and behavioral issues truthfully, since inaccurate details can affect matching results and the welfare of the pet and the future guardian.',
          'Provide information only about pets that are under your care.',
        ],
      },
      RIGHTS,
      {
        heading: '7. Limitations',
        bullets: [
          'The system is an **academic prototype**. Recommendations are for research purposes and do not guarantee a successful adoption.',
          NOT_PARTY,
        ],
      },
      {
        heading: '8. Contact the Research Team',
        intro: 'For questions or concerns, please contact:',
        table: CONTACTS,
      },
    ],
    closing:
      'By clicking “I Agree”, I confirm that I have read and understood these Terms and Conditions, that I am participating voluntarily as a Pet Provider, and that I allow the system to collect and use the Pet Profile Data listed above for academic purposes, in accordance with R.A. 10173.',
  },
}

/** 'guardian' or 'provider' (anything else becomes 'guardian'). */
export const normalizeTermsRole = (role) => (role === 'provider' ? 'provider' : 'guardian')
