export type EvalComponent = "ocr" | "voice_parsing" | "field_mapping";
export type Scorer = "field_match_rate" | "exact_match" | "semantic_match" | "regex_match";
export type Confidence = "high" | "med" | "low";
export type Language = "en" | "es";

export interface FieldExpectation {
  field: string;
  expected: string | number | null;
  /** If true, the value must be exactly equal; otherwise semantic equivalence is accepted */
  strict?: boolean;
  /** If set, the field should be flagged at this confidence level or below */
  maxConfidence?: Confidence;
  /** If true, the field must never appear in plain text in logs or UI (e.g. SSN) */
  mustBeRedacted?: boolean;
}

export interface Eval {
  id: string;
  description: string;
  component: EvalComponent;
  tags: string[];
  language?: Language;
  input: OcrInput | VoiceInput | FieldMappingInput;
  expected: {
    fields?: FieldExpectation[];
    /** Overall pass threshold: ratio of fields that must meet their expectation */
    threshold: number;
    /** Fields expected to be absent / null (system must not fabricate) */
    mustBeNull?: string[];
    /** Flags or warnings the system should emit */
    systemFlags?: string[];
  };
}

export interface OcrInput {
  documentType: "w9" | "school_id" | "applicant_id";
  /** Path to a fixture image, or a description for a human tester */
  fixture: string;
  /** Simulated OCR quality for test purposes */
  quality: "high" | "degraded" | "blurry" | "handwritten";
}

export interface VoiceInput {
  question: string;
  targetField: string;
  transcript: string;
  language: Language;
}

export interface FieldMappingInput {
  /** Simulated OCR results from multiple documents */
  ocrResults: Record<string, string | null>;
  /** Simulated voice answers keyed by field */
  voiceAnswers?: Record<string, string>;
}
