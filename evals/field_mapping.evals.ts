import type { Eval } from "./types";

/**
 * Evals for cross-document field mapping and conflict detection.
 *
 * These evals validate that when OCR results from multiple documents are
 * merged into the form, the system correctly resolves conflicts, picks the
 * right source of truth, and flags discrepancies for user review rather than
 * silently overwriting.
 */
export const fieldMappingEvals: Eval[] = [
  // ── Name reconciliation ────────────────────────────────────────────────────

  {
    id: "map-name-matches-across-docs",
    description: "Name on driver's license matches W-9 → high confidence, no flag",
    component: "field_mapping",
    tags: ["name", "happy-path", "conflict-detection"],
    input: {
      ocrResults: {
        "applicant_id.applicant_name": "María Elena Hernández",
        "w9.applicant_name":           "María Elena Hernández",
      },
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "applicant_name", expected: "María Elena Hernández", strict: false, maxConfidence: "high" },
      ],
    },
  },

  {
    id: "map-name-mismatch-between-docs",
    description: "Name differs between ID and W-9 (maiden vs married name) → flag discrepancy, surface to user",
    component: "field_mapping",
    tags: ["name", "conflict-detection"],
    input: {
      ocrResults: {
        "applicant_id.applicant_name": "María Elena Torres",
        "w9.applicant_name":           "María Elena Hernández",
      },
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "applicant_name", expected: "María Elena Hernández", strict: false, maxConfidence: "med" },
      ],
      systemFlags: ["name_mismatch_between_documents"],
    },
  },

  {
    id: "map-name-nickname-vs-legal",
    description: "W-9 has nickname, ID has legal name → prefer legal name from ID",
    component: "field_mapping",
    tags: ["name", "conflict-detection"],
    input: {
      ocrResults: {
        "applicant_id.applicant_name": "María Elena Hernández",
        "w9.applicant_name":           "Maria Hernandez",
      },
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "applicant_name", expected: "María Elena Hernández", strict: false },
      ],
      systemFlags: ["name_normalized_to_id"],
    },
  },

  // ── Address reconciliation ─────────────────────────────────────────────────

  {
    id: "map-address-matches-across-docs",
    description: "Address on ID matches W-9 → high confidence",
    component: "field_mapping",
    tags: ["address", "happy-path"],
    input: {
      ocrResults: {
        "applicant_id.address": "248 Linden St Apt 3B Oakland CA 94607",
        "w9.address":           "248 Linden St Apt 3B Oakland CA 94607",
      },
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "address", expected: "248 Linden St Apt 3B Oakland CA 94607", strict: false, maxConfidence: "high" },
      ],
    },
  },

  {
    id: "map-address-mismatch",
    description: "Address differs between ID and W-9 → flag for user to confirm current address",
    component: "field_mapping",
    tags: ["address", "conflict-detection"],
    input: {
      ocrResults: {
        "applicant_id.address": "248 Linden St Apt 3B Oakland CA 94607",
        "w9.address":           "101 Mission St San Francisco CA 94105",
      },
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "address", expected: "248 Linden St Apt 3B Oakland CA 94607", strict: false, maxConfidence: "med" },
      ],
      systemFlags: ["address_mismatch_between_documents"],
    },
  },

  {
    id: "map-address-passport-no-address",
    description: "User uploaded passport (no address) + W-9 → address comes from W-9 only",
    component: "field_mapping",
    tags: ["address", "passport"],
    input: {
      ocrResults: {
        "applicant_id.address": null,
        "w9.address":           "248 Linden St Apt 3B Oakland CA 94607",
      },
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "address", expected: "248 Linden St Apt 3B Oakland CA 94607", strict: false },
      ],
    },
  },

  // ── SSN handling ───────────────────────────────────────────────────────────

  {
    id: "map-ssn-redacted-in-output",
    description: "SSN from W-9 → shown as masked value in UI, raw value never in response payload",
    component: "field_mapping",
    tags: ["ssn", "compliance", "pii"],
    input: {
      ocrResults: {
        "w9.ssn": "123456789",
      },
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "ssn", expected: "XXX-XX-6789", strict: true, mustBeRedacted: true },
      ],
    },
  },

  // ── Child fields ───────────────────────────────────────────────────────────

  {
    id: "map-child-fields-from-school-id",
    description: "All child fields sourced from school ID → correctly attributed",
    component: "field_mapping",
    tags: ["child", "school-id", "happy-path"],
    input: {
      ocrResults: {
        "school_id.child_name":  "Diego Hernández",
        "school_id.child_dob":   "2019-08-02",
        "school_id.school_name": "Lincoln Elementary",
        "school_id.grade":       "Kindergarten",
      },
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "child_name",  expected: "Diego Hernández",   strict: false, maxConfidence: "high" },
        { field: "child_dob",   expected: "2019-08-02",         strict: false, maxConfidence: "high" },
        { field: "school_name", expected: "Lincoln Elementary", strict: false, maxConfidence: "high" },
        { field: "grade",       expected: "Kindergarten",       strict: false, maxConfidence: "high" },
      ],
    },
  },

  // ── Doc + voice merge ──────────────────────────────────────────────────────

  {
    id: "map-doc-fields-not-overwritten-by-voice",
    description: "Fields pre-filled from docs are not overwritten if the voice interview skips them",
    component: "field_mapping",
    tags: ["merge", "idempotency"],
    input: {
      ocrResults: {
        "applicant_id.applicant_name": "María Elena Hernández",
        "applicant_id.dob":            "1989-03-14",
      },
      voiceAnswers: {
        applicant_name: "",
      },
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "applicant_name", expected: "María Elena Hernández", strict: false },
        { field: "dob",            expected: "1989-03-14",             strict: false },
      ],
    },
  },

  {
    id: "map-voice-correction-overrides-ocr",
    description: "User corrects an OCR-populated field via voice → voice answer takes precedence",
    component: "field_mapping",
    tags: ["merge", "user-correction"],
    input: {
      ocrResults: {
        "applicant_id.address": "248 Linden St Apt 3B Oakland CA 94607",
      },
      voiceAnswers: {
        address: "312 Foothill Blvd Oakland CA 94601",
      },
    },
    expected: {
      threshold: 1.0,
      fields: [
        { field: "address", expected: "312 Foothill Blvd Oakland CA 94601", strict: false },
      ],
    },
  },

  // ── Missing required fields ────────────────────────────────────────────────

  {
    id: "map-required-field-missing-flagged",
    description: "Required field not found in any document and not answered via voice → flagged as missing",
    component: "field_mapping",
    tags: ["missing-data", "required-fields"],
    input: {
      ocrResults: {
        "applicant_id.applicant_name": "María Elena Hernández",
      },
      voiceAnswers: {},
    },
    expected: {
      threshold: 1.0,
      mustBeNull: ["phone", "household_income", "housing_type", "household_size"],
      fields: [
        { field: "applicant_name", expected: "María Elena Hernández", strict: false },
        { field: "phone",          expected: null },
        { field: "household_income", expected: null },
      ],
      systemFlags: ["required_fields_incomplete"],
    },
  },

  {
    id: "map-no-fabrication-on-missing-docs",
    description: "If a document type was not uploaded, its fields must be null — not guessed",
    component: "field_mapping",
    tags: ["missing-data", "hallucination-guard"],
    input: {
      ocrResults: {
        "applicant_id.applicant_name": "María Elena Hernández",
        // school_id was never uploaded
      },
    },
    expected: {
      threshold: 1.0,
      mustBeNull: ["child_name", "child_dob", "school_name", "grade"],
      fields: [
        { field: "child_name",  expected: null },
        { field: "child_dob",   expected: null },
        { field: "school_name", expected: null },
        { field: "grade",       expected: null },
      ],
    },
  },
];
