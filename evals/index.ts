/**
 * Eval suite entry point.
 *
 * Usage:
 *   bun run evals/index.ts              — print eval manifest and counts
 *   bun run evals/index.ts --tag hipaa  — filter by tag
 *   bun run evals/index.ts --component ocr
 *
 * Actual model execution is plugged in via runEval() below.
 * Wire it to your OCR provider, STT parser, or field-mapping LLM call.
 */

import { ocrEvals }          from "./ocr.evals";
import { voiceEvals }         from "./voice.evals";
import { fieldMappingEvals }  from "./field_mapping.evals";
import type { Eval }          from "./types";

export const ALL_EVALS: Eval[] = [
  ...ocrEvals,
  ...voiceEvals,
  ...fieldMappingEvals,
];

// ── Filtering ──────────────────────────────────────────────────────────────

export function filterEvals(opts: { tag?: string; component?: string }): Eval[] {
  return ALL_EVALS.filter((e) => {
    if (opts.component && e.component !== opts.component) return false;
    if (opts.tag && !e.tags.includes(opts.tag)) return false;
    return true;
  });
}

// ── Scoring helpers ────────────────────────────────────────────────────────

export interface EvalResult {
  evalId: string;
  passed: boolean;
  fieldResults: { field: string; expected: unknown; actual: unknown; passed: boolean }[];
  flagResults: { flag: string; present: boolean }[];
  score: number;
}

/**
 * Score a single eval given the model's raw output.
 *
 * actualFields  — the fields the model extracted, keyed by field name
 * actualFlags   — any system flags the model emitted
 */
export function scoreEval(
  ev: Eval,
  actualFields: Record<string, unknown>,
  actualFlags: string[] = [],
): EvalResult {
  const fieldResults = (ev.expected.fields ?? []).map((f) => {
    const actual = actualFields[f.field] ?? null;
    const expected = f.expected;

    let passed: boolean;
    if (expected === null) {
      passed = actual === null || actual === undefined || actual === "";
    } else if (f.strict) {
      passed = String(actual).trim() === String(expected).trim();
    } else {
      // Semantic: lowercased substring / close-enough check (replace with embedding sim in prod)
      passed = String(actual).toLowerCase().includes(String(expected).toLowerCase())
            || String(expected).toLowerCase().includes(String(actual).toLowerCase());
    }

    // Redaction check: if mustBeRedacted and value looks like raw SSN pattern, fail
    if (f.mustBeRedacted && /\b\d{9}\b|\b\d{3}-\d{2}-\d{4}\b/.test(String(actual))) {
      passed = false;
    }

    return { field: f.field, expected, actual, passed };
  });

  const flagResults = (ev.expected.systemFlags ?? []).map((flag) => ({
    flag,
    present: actualFlags.includes(flag),
  }));

  const mustBeNullResults = (ev.expected.mustBeNull ?? []).map((field) => {
    const actual = actualFields[field];
    const passed = actual === null || actual === undefined || actual === "";
    return { field, expected: null, actual, passed };
  });

  const allFieldResults = [...fieldResults, ...mustBeNullResults];
  const totalChecks = allFieldResults.length + flagResults.length;
  const passedChecks =
    allFieldResults.filter((r) => r.passed).length +
    flagResults.filter((r) => r.present).length;

  const score = totalChecks > 0 ? passedChecks / totalChecks : 1;
  const passed = score >= ev.expected.threshold;

  return { evalId: ev.id, passed, fieldResults: allFieldResults, flagResults, score };
}

// ── Manifest / CLI ─────────────────────────────────────────────────────────

if (import.meta.main) {
  const args = process.argv.slice(2);
  const tagIdx = args.indexOf("--tag");
  const compIdx = args.indexOf("--component");

  const filtered = filterEvals({
    tag: tagIdx >= 0 ? args[tagIdx + 1] : undefined,
    component: compIdx >= 0 ? args[compIdx + 1] : undefined,
  });

  console.log(`\nBinti LLM Eval Suite — ${filtered.length} evals\n`);

  const byComponent = filtered.reduce<Record<string, Eval[]>>((acc, e) => {
    (acc[e.component] ??= []).push(e);
    return acc;
  }, {});

  for (const [component, evals] of Object.entries(byComponent)) {
    console.log(`  ${component} (${evals.length})`);
    for (const e of evals) {
      console.log(`    · [${e.tags.join(", ")}] ${e.id}`);
      console.log(`      ${e.description}`);
    }
    console.log();
  }

  console.log("To run against a model, import scoreEval() and wire in your LLM/OCR calls.");
}
