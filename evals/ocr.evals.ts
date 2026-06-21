import type { Eval } from "./types";

/**
 * Evals for OCR document extraction.
 *
 * Each eval describes one document scan → extracted fields scenario.
 * The system must extract fields accurately, flag low-confidence reads,
 * redact sensitive values in the UI, and never fabricate values it cannot read.
 */
export const ocrEvals: Eval[] = [
  // ── W-9 ────────────────────────────────────────────────────────────────────

  {
    id: "ocr-w9-standard",
    description: "Clean, typed W-9 scan → all fields extracted at high confidence",
    component: "ocr",
    tags: ["w9", "happy-path"],
    input: {
      documentType: "w9",
      fixture: "fixtures/w9_typed_clean.png",
      quality: "high",
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "applicant_name",   expected: "María Elena Hernández",       strict: false },
        { field: "ssn",              expected: "XXX-XX-4421",                  strict: true, mustBeRedacted: true },
        { field: "address",          expected: "248 Linden St Apt 3B Oakland CA 94607", strict: false },
        { field: "employer_name",    expected: "Bayview Community Health",     strict: false },
      ],
    },
  },

  {
    id: "ocr-w9-handwritten",
    description: "Handwritten W-9 → fields extracted but low/med confidence flags triggered",
    component: "ocr",
    tags: ["w9", "degraded-input"],
    input: {
      documentType: "w9",
      fixture: "fixtures/w9_handwritten.png",
      quality: "handwritten",
    },
    expected: {
      threshold: 0.75,
      fields: [
        { field: "applicant_name",   expected: "María Elena Hernández", strict: false, maxConfidence: "med" },
        { field: "ssn",              expected: "XXX-XX-4421",           strict: true,  mustBeRedacted: true, maxConfidence: "med" },
        { field: "employer_name",    expected: "Bayview Community Health", strict: false, maxConfidence: "med" },
      ],
    },
  },

  {
    id: "ocr-w9-blurry",
    description: "Blurry W-9 photo → low-confidence flags on most fields, user prompted to re-upload",
    component: "ocr",
    tags: ["w9", "degraded-input", "error-handling"],
    input: {
      documentType: "w9",
      fixture: "fixtures/w9_blurry.png",
      quality: "blurry",
    },
    expected: {
      threshold: 0.5,
      fields: [
        { field: "applicant_name",   expected: null, maxConfidence: "low" },
        { field: "ssn",              expected: null, mustBeRedacted: true, maxConfidence: "low" },
      ],
      systemFlags: ["reupload_recommended"],
    },
  },

  {
    id: "ocr-w9-ssn-redaction",
    description: "SSN from W-9 must never appear in plaintext in extracted output",
    component: "ocr",
    tags: ["w9", "compliance", "pii"],
    input: {
      documentType: "w9",
      fixture: "fixtures/w9_typed_clean.png",
      quality: "high",
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "ssn", expected: "XXX-XX-4421", strict: true, mustBeRedacted: true },
      ],
    },
  },

  {
    id: "ocr-w9-partial",
    description: "Incomplete W-9 (employer field blank) → missing field is null, not fabricated",
    component: "ocr",
    tags: ["w9", "missing-data", "hallucination-guard"],
    input: {
      documentType: "w9",
      fixture: "fixtures/w9_incomplete.png",
      quality: "high",
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "applicant_name", expected: "María Elena Hernández", strict: false },
        { field: "employer_name",  expected: null },
      ],
      mustBeNull: ["employer_name"],
    },
  },

  // ── School ID ──────────────────────────────────────────────────────────────

  {
    id: "ocr-school-id-standard",
    description: "Standard printed school ID → child name, DOB, school, grade extracted",
    component: "ocr",
    tags: ["school-id", "happy-path", "ferpa"],
    input: {
      documentType: "school_id",
      fixture: "fixtures/school_id_standard.png",
      quality: "high",
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "child_name",   expected: "Diego Hernández",    strict: false },
        { field: "child_dob",    expected: "2019-08-02",          strict: false },
        { field: "school_name",  expected: "Lincoln Elementary",  strict: false },
        { field: "grade",        expected: "Kindergarten",        strict: false },
      ],
    },
  },

  {
    id: "ocr-school-id-accent-preserved",
    description: "Child name with accent characters must be preserved exactly (FERPA accuracy)",
    component: "ocr",
    tags: ["school-id", "unicode", "ferpa"],
    input: {
      documentType: "school_id",
      fixture: "fixtures/school_id_accented_name.png",
      quality: "high",
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "child_name", expected: "Sofía García-Reyes", strict: true },
      ],
    },
  },

  {
    id: "ocr-school-id-no-grade",
    description: "School ID without grade field → grade is null, not guessed from DOB",
    component: "ocr",
    tags: ["school-id", "missing-data", "hallucination-guard"],
    input: {
      documentType: "school_id",
      fixture: "fixtures/school_id_no_grade.png",
      quality: "high",
    },
    expected: {
      threshold: 1.0,
      mustBeNull: ["grade"],
      fields: [
        { field: "child_name",  expected: "Diego Hernández",   strict: false },
        { field: "school_name", expected: "Lincoln Elementary", strict: false },
        { field: "grade",       expected: null },
      ],
    },
  },

  {
    id: "ocr-school-id-photo-only",
    description: "Enrollment card / photo card with poor contrast → low confidence flagged",
    component: "ocr",
    tags: ["school-id", "degraded-input"],
    input: {
      documentType: "school_id",
      fixture: "fixtures/school_id_low_contrast.png",
      quality: "degraded",
    },
    expected: {
      threshold: 0.6,
      fields: [
        { field: "child_name",  expected: "Diego Hernández",   strict: false, maxConfidence: "med" },
        { field: "school_name", expected: "Lincoln Elementary", strict: false, maxConfidence: "low" },
      ],
      systemFlags: ["manual_review_recommended"],
    },
  },

  // ── Applicant ID ───────────────────────────────────────────────────────────

  {
    id: "ocr-applicant-id-drivers-license",
    description: "Standard driver's license → name, DOB, address extracted",
    component: "ocr",
    tags: ["applicant-id", "happy-path"],
    input: {
      documentType: "applicant_id",
      fixture: "fixtures/drivers_license_standard.png",
      quality: "high",
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "applicant_name", expected: "María Elena Hernández",                    strict: false },
        { field: "dob",            expected: "1989-03-14",                               strict: false },
        { field: "address",        expected: "248 Linden St Apt 3B Oakland CA 94607",    strict: false },
      ],
    },
  },

  {
    id: "ocr-applicant-id-passport",
    description: "Passport → name and DOB extracted; address is null (passports have no address)",
    component: "ocr",
    tags: ["applicant-id", "happy-path"],
    input: {
      documentType: "applicant_id",
      fixture: "fixtures/passport_standard.png",
      quality: "high",
    },
    expected: {
      threshold: 1.0,
      mustBeNull: ["address"],
      fields: [
        { field: "applicant_name", expected: "María Elena Hernández", strict: false },
        { field: "dob",            expected: "1989-03-14",             strict: false },
        { field: "address",        expected: null },
      ],
    },
  },

  {
    id: "ocr-applicant-id-expired",
    description: "Expired ID → fields still extracted; system flags expiry but does not block",
    component: "ocr",
    tags: ["applicant-id", "edge-case"],
    input: {
      documentType: "applicant_id",
      fixture: "fixtures/drivers_license_expired.png",
      quality: "high",
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "applicant_name", expected: "María Elena Hernández", strict: false },
        { field: "dob",            expected: "1989-03-14",             strict: false },
      ],
      systemFlags: ["id_expired"],
    },
  },
];
