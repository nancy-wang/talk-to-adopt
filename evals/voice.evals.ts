import type { Eval } from "./types";

/**
 * Evals for voice response parsing.
 *
 * Each eval gives the system a raw speech transcript (as the STT engine would
 * return it) and expects it to extract the correct structured value for the
 * target form field. The system must handle natural speech, hedging language,
 * accented phrasing, and Spanish input without fabricating values.
 */
export const voiceEvals: Eval[] = [
  // ── Phone number ───────────────────────────────────────────────────────────

  {
    id: "voice-phone-spoken-digits",
    description: "Phone spoken as individual digits → normalized to E.164-ish format",
    component: "voice_parsing",
    tags: ["phone", "happy-path", "en"],
    language: "en",
    input: {
      question: "What's the best phone number to reach you on?",
      targetField: "phone",
      transcript: "Five one zero, five five five, zero one four two",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "phone", expected: "510-555-0142", strict: true }],
    },
  },

  {
    id: "voice-phone-natural",
    description: "Phone spoken as a number with area code phrasing → normalized",
    component: "voice_parsing",
    tags: ["phone", "happy-path", "en"],
    language: "en",
    input: {
      question: "What's the best phone number to reach you on?",
      targetField: "phone",
      transcript: "My number is area code 510, 555 0142",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "phone", expected: "510-555-0142", strict: true }],
    },
  },

  {
    id: "voice-phone-spanish",
    description: "Phone spoken in Spanish → normalized correctly",
    component: "voice_parsing",
    tags: ["phone", "happy-path", "es"],
    language: "es",
    input: {
      question: "¿Cuál es el mejor número de teléfono para contactarte?",
      targetField: "phone",
      transcript: "Cinco uno cero, cinco cinco cinco, cero uno cuatro dos",
      language: "es",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "phone", expected: "510-555-0142", strict: true }],
    },
  },

  // ── Income ─────────────────────────────────────────────────────────────────

  {
    id: "voice-income-approximate",
    description: "Income given as an approximation → stored as integer dollars",
    component: "voice_parsing",
    tags: ["income", "happy-path", "en"],
    language: "en",
    input: {
      question: "About what is your household's yearly income?",
      targetField: "household_income",
      transcript: "About forty-two thousand a year",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "household_income", expected: 42000, strict: true }],
    },
  },

  {
    id: "voice-income-range",
    description: "Income given as a range → system uses midpoint or prompts for single value",
    component: "voice_parsing",
    tags: ["income", "edge-case", "en"],
    language: "en",
    input: {
      question: "About what is your household's yearly income?",
      targetField: "household_income",
      transcript: "Somewhere between thirty-five and forty thousand",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "household_income", expected: 37500, strict: false }],
      systemFlags: ["value_is_range_estimate"],
    },
  },

  {
    id: "voice-income-spanish",
    description: "Income spoken in Spanish → parsed to integer",
    component: "voice_parsing",
    tags: ["income", "happy-path", "es"],
    language: "es",
    input: {
      question: "¿Cuál es aproximadamente el ingreso anual de su hogar?",
      targetField: "household_income",
      transcript: "Unos cuarenta y dos mil dólares al año",
      language: "es",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "household_income", expected: 42000, strict: true }],
    },
  },

  {
    id: "voice-income-refused",
    description: "User declines to share income → field is null, not fabricated",
    component: "voice_parsing",
    tags: ["income", "edge-case", "hallucination-guard"],
    language: "en",
    input: {
      question: "About what is your household's yearly income?",
      targetField: "household_income",
      transcript: "I'd rather not say",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      mustBeNull: ["household_income"],
      fields: [{ field: "household_income", expected: null }],
      systemFlags: ["field_skipped_by_user"],
    },
  },

  // ── Housing type ───────────────────────────────────────────────────────────

  {
    id: "voice-housing-rent",
    description: "'We rent' → housing_type = rent",
    component: "voice_parsing",
    tags: ["housing", "happy-path", "en"],
    language: "en",
    input: {
      question: "Do you rent your home, own it, or something else?",
      targetField: "housing_type",
      transcript: "We rent",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "housing_type", expected: "rent", strict: true }],
    },
  },

  {
    id: "voice-housing-own",
    description: "'I own my home' → housing_type = own",
    component: "voice_parsing",
    tags: ["housing", "happy-path", "en"],
    language: "en",
    input: {
      question: "Do you rent your home, own it, or something else?",
      targetField: "housing_type",
      transcript: "I own my home",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "housing_type", expected: "own", strict: true }],
    },
  },

  {
    id: "voice-housing-other-staying-with-family",
    description: "'Staying with family' → housing_type = other",
    component: "voice_parsing",
    tags: ["housing", "edge-case", "en"],
    language: "en",
    input: {
      question: "Do you rent your home, own it, or something else?",
      targetField: "housing_type",
      transcript: "I'm staying with my sister right now",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "housing_type", expected: "other", strict: true }],
    },
  },

  {
    id: "voice-housing-spanish",
    description: "Housing type spoken in Spanish → normalized",
    component: "voice_parsing",
    tags: ["housing", "happy-path", "es"],
    language: "es",
    input: {
      question: "¿Vive en una casa alquilada, propia o algo diferente?",
      targetField: "housing_type",
      transcript: "Rentamos el apartamento",
      language: "es",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "housing_type", expected: "rent", strict: true }],
    },
  },

  // ── Household size ─────────────────────────────────────────────────────────

  {
    id: "voice-household-size-with-context",
    description: "Household size stated with context ('me, Diego, and my two other kids') → 4",
    component: "voice_parsing",
    tags: ["household", "happy-path", "en"],
    language: "en",
    input: {
      question: "How many people live in your home, including you?",
      targetField: "household_size",
      transcript: "Four — me, Diego, and my two other kids",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "household_size", expected: 4, strict: true }],
    },
  },

  {
    id: "voice-household-size-just-number",
    description: "Household size as a bare number → parsed correctly",
    component: "voice_parsing",
    tags: ["household", "happy-path", "en"],
    language: "en",
    input: {
      question: "How many people live in your home, including you?",
      targetField: "household_size",
      transcript: "Just three of us",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "household_size", expected: 3, strict: true }],
    },
  },

  // ── Relationship to child ──────────────────────────────────────────────────

  {
    id: "voice-relationship-mother",
    description: "'I'm his mother' → relationship = Mother",
    component: "voice_parsing",
    tags: ["relationship", "happy-path", "en"],
    language: "en",
    input: {
      question: "What's your relationship to Diego?",
      targetField: "relationship_to_child",
      transcript: "I'm his mother",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "relationship_to_child", expected: "Mother", strict: false }],
    },
  },

  {
    id: "voice-relationship-guardian-informal",
    description: "Informal guardian phrasing → normalized to Guardian",
    component: "voice_parsing",
    tags: ["relationship", "edge-case", "en"],
    language: "en",
    input: {
      question: "What's your relationship to Diego?",
      targetField: "relationship_to_child",
      transcript: "I've been taking care of him since his parents passed",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "relationship_to_child", expected: "Guardian", strict: false }],
      systemFlags: ["relationship_inferred_from_context"],
    },
  },

  // ── Medical / special needs ────────────────────────────────────────────────

  {
    id: "voice-medical-condition-stated",
    description: "Medical condition stated → stored verbatim, not summarized",
    component: "voice_parsing",
    tags: ["medical", "happy-path", "hipaa", "en"],
    language: "en",
    input: {
      question: "Does Diego have any medical conditions or special needs we should know about?",
      targetField: "medical_notes",
      transcript: "He has mild asthma, uses an inhaler before exercise",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "medical_notes", expected: "Mild asthma, uses an inhaler before exercise", strict: false }],
    },
  },

  {
    id: "voice-medical-none",
    description: "'None that I know of' → medical_notes = none",
    component: "voice_parsing",
    tags: ["medical", "happy-path", "en"],
    language: "en",
    input: {
      question: "Does Diego have any medical conditions or special needs we should know about?",
      targetField: "medical_notes",
      transcript: "Nothing that I know of",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "medical_notes", expected: "none", strict: false }],
    },
  },

  {
    id: "voice-medical-spanish",
    description: "Medical notes in Spanish → stored in Spanish, not auto-translated",
    component: "voice_parsing",
    tags: ["medical", "happy-path", "hipaa", "es"],
    language: "es",
    input: {
      question: "¿Diego tiene alguna condición médica o necesidades especiales que debamos saber?",
      targetField: "medical_notes",
      transcript: "Tiene asma leve, usa un inhalador antes de hacer ejercicio",
      language: "es",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "medical_notes", expected: "Tiene asma leve, usa un inhalador antes de hacer ejercicio", strict: false }],
    },
  },

  // ── Care type ──────────────────────────────────────────────────────────────

  {
    id: "voice-care-type-fulltime",
    description: "Full-time care with days specified → care_type = full-time",
    component: "voice_parsing",
    tags: ["care-type", "happy-path", "en"],
    language: "en",
    input: {
      question: "What kind of care are you looking for — full-time, part-time, or occasional?",
      targetField: "care_type",
      transcript: "Full-time, Monday through Friday",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "care_type", expected: "full-time", strict: true }],
    },
  },

  {
    id: "voice-care-type-ambiguous",
    description: "Ambiguous care need ('a few days a week') → system flags for clarification",
    component: "voice_parsing",
    tags: ["care-type", "edge-case", "en"],
    language: "en",
    input: {
      question: "What kind of care are you looking for — full-time, part-time, or occasional?",
      targetField: "care_type",
      transcript: "Maybe a few days a week, I'm not sure yet",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "care_type", expected: "part-time", strict: false }],
      systemFlags: ["clarification_recommended"],
    },
  },

  // ── Start date ─────────────────────────────────────────────────────────────

  {
    id: "voice-start-date-month-only",
    description: "Start date as a month name → stored as month + current year",
    component: "voice_parsing",
    tags: ["start-date", "happy-path", "en"],
    language: "en",
    input: {
      question: "When would you ideally like care to start?",
      targetField: "preferred_start_date",
      transcript: "Starting in September if possible",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "preferred_start_date", expected: "September 2026", strict: false }],
    },
  },

  {
    id: "voice-start-date-asap",
    description: "'As soon as possible' → stored as ASAP flag, not a fabricated date",
    component: "voice_parsing",
    tags: ["start-date", "edge-case", "hallucination-guard"],
    language: "en",
    input: {
      question: "When would you ideally like care to start?",
      targetField: "preferred_start_date",
      transcript: "As soon as possible",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      fields: [{ field: "preferred_start_date", expected: "ASAP", strict: false }],
      systemFlags: ["no_specific_date"],
    },
  },

  // ── Empty / silence ────────────────────────────────────────────────────────

  {
    id: "voice-empty-response",
    description: "Empty transcript (silence or noise) → field is not saved, re-prompt triggered",
    component: "voice_parsing",
    tags: ["edge-case", "error-handling"],
    language: "en",
    input: {
      question: "What's the best phone number to reach you on?",
      targetField: "phone",
      transcript: "",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      mustBeNull: ["phone"],
      fields: [{ field: "phone", expected: null }],
      systemFlags: ["reprompt_required"],
    },
  },

  {
    id: "voice-noise-only",
    description: "Transcript contains only filler ('um', 'uh') → treated as empty, re-prompt",
    component: "voice_parsing",
    tags: ["edge-case", "error-handling"],
    language: "en",
    input: {
      question: "How many people live in your home?",
      targetField: "household_size",
      transcript: "Um... uh...",
      language: "en",
    },
    expected: {
      threshold: 1.0,
      mustBeNull: ["household_size"],
      fields: [{ field: "household_size", expected: null }],
      systemFlags: ["reprompt_required"],
    },
  },
];
