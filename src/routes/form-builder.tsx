import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  ChevronRight,
  ChevronDown,
  FileText,
  ArrowLeft,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  HOUSING_CONNECT_TEMPLATE,
  type FormSchema,
  type FormField,
  type Condition,
} from "../lib/form-schema";

export const Route = createFileRoute("/form-builder")({
  head: () => ({
    meta: [
      { title: "Form Builder — Binti" },
      {
        name: "description",
        content: "Government benefit form builder for NYC Housing Connect.",
      },
    ],
  }),
  component: FormBuilderPage,
});

type Stage = "input" | "generating" | "preview";

function FormBuilderPage() {
  const [stage, setStage] = useState<Stage>("input");
  const [programDescription, setProgramDescription] = useState("");
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = () => {
    if (!programDescription.trim()) return;
    setStage("generating");
    setTimeout(() => {
      setSchema(structuredClone(HOUSING_CONNECT_TEMPLATE));
      setStage("preview");
    }, 2200);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-white/95 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </a>
          <div className="h-5 w-px bg-border" />
          <span className="font-serif text-lg font-bold tracking-tight text-[#00285f]">
            binti
          </span>
          <span className="text-xs text-muted-foreground">· Form Builder</span>
        </div>
        {stage === "preview" && schema && (
          <button
            onClick={() => { setStage("input"); setSchema(null); }}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            ← Start over
          </button>
        )}
      </header>

      {stage === "input" && (
        <InputStage
          value={programDescription}
          onChange={setProgramDescription}
          onGenerate={handleGenerate}
          textareaRef={textareaRef}
        />
      )}

      {stage === "generating" && (
        <GeneratingStage description={programDescription} />
      )}

      {stage === "preview" && schema && (
        <PreviewStage schema={schema} />
      )}
    </div>
  );
}

// ── Input stage ──────────────────────────────────────────────────────────────

const EXAMPLE_PROMPTS = [
  "Affordable housing lottery for low-to-moderate income NYC residents. Applicants must be 18+, have household income below 80% AMI, and currently live or work in NYC. Need to collect household size, income sources, and accessibility needs.",
  "Section 8 waitlist application for families with children under 18. Prioritize veterans and people with disabilities. Collect employment history and reason for needing assistance.",
  "Senior affordable housing for residents 62 and older. Units are ADA accessible. Need income verification, proof of age, and emergency contact.",
];

function InputStage({
  value,
  onChange,
  onGenerate,
  textareaRef,
}: {
  value: string;
  onChange: (v: string) => void;
  onGenerate: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-[#00285f]">
          <Sparkles className="h-3.5 w-3.5" />
          AI Form Generator
        </div>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
          Describe your program.
        </h1>
        <p className="mt-2 max-w-xl text-base text-muted-foreground">
          Tell us about the benefit program in plain language — who it's for,
          what the eligibility rules are, and what information you need to
          collect. We'll turn it into a ready-to-publish applicant form.
        </p>
      </div>

      {/* Main input */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-3">
          <label
            htmlFor="program-desc"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Program description
          </label>
        </div>
        <textarea
          id="program-desc"
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.metaKey) onGenerate();
          }}
          placeholder="Describe the program, who qualifies, what documents or information you need to collect, any income or age limits, priorities for certain groups (veterans, seniors, people with disabilities), and anything else that should appear on the application…"
          rows={10}
          className="w-full resize-none rounded-b-xl bg-transparent px-5 py-4 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Press{" "}
          <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[11px] font-mono">
            ⌘ Enter
          </kbd>{" "}
          to generate
        </p>
        <button
          onClick={onGenerate}
          disabled={!value.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-[#006cff] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0058d6] disabled:opacity-40"
        >
          <Sparkles className="h-4 w-4" />
          Generate form
        </button>
      </div>

      {/* Example prompts */}
      <div className="mt-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Examples — click to use
        </p>
        <div className="space-y-2">
          {EXAMPLE_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onChange(prompt)}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-left text-sm text-muted-foreground transition hover:border-primary/40 hover:bg-secondary/60 hover:text-foreground"
            >
              "{prompt.slice(0, 120)}…"
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

// ── Generating stage ─────────────────────────────────────────────────────────

const GENERATION_STEPS = [
  "Reading program requirements…",
  "Identifying required fields…",
  "Applying eligibility rules…",
  "Structuring sections and conditional logic…",
  "Finalising form…",
];

function GeneratingStage({ description }: { description: string }) {
  const [stepIdx, setStepIdx] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, GENERATION_STEPS.length - 1));
    }, 420);
    return () => clearInterval(interval);
  });

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 py-24">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Building your form…</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This usually takes a few seconds.
        </p>

        <div className="mt-8 space-y-2 text-left">
          {GENERATION_STEPS.map((step, i) => (
            <div
              key={step}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all ${
                i < stepIdx
                  ? "text-muted-foreground line-through"
                  : i === stepIdx
                    ? "bg-secondary font-semibold text-foreground"
                    : "text-muted-foreground/40"
              }`}
            >
              {i < stepIdx ? (
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/20 text-success text-[11px]">
                  ✓
                </span>
              ) : i === stepIdx ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
              ) : (
                <span className="h-5 w-5 shrink-0" />
              )}
              {step}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card px-4 py-3 text-left text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Your input: </span>
          {description.slice(0, 160)}
          {description.length > 160 ? "…" : ""}
        </div>
      </div>
    </div>
  );
}

// ── Preview stage ─────────────────────────────────────────────────────────────

function PreviewStage({ schema }: { schema: FormSchema }) {
  return (
    <div className="flex-1 bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Banner */}
        <div className="mb-8 flex items-start justify-between gap-4 rounded-xl border border-success/30 bg-success/8 px-5 py-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-success">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-success/20 text-[11px]">
                ✓
              </span>
              Form generated
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {schema.sections.length} sections ·{" "}
              {schema.sections.reduce((n, s) => n + s.fields.length, 0)} fields
              · {schema.sections.reduce((n, s) => n + s.fields.filter(f => f.condition).length, 0)} conditional
            </p>
          </div>
          <button
            disabled
            className="inline-flex items-center gap-2 rounded-lg bg-[#006cff]/90 px-4 py-2 text-xs font-bold text-white opacity-60"
          >
            Submit for review →
          </button>
        </div>

        <FormPreview schema={schema} />
      </div>
    </div>
  );
}

// ── Form preview ─────────────────────────────────────────────────────────────

function FormPreview({ schema }: { schema: FormSchema }) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(schema.sections.map((s) => s.id)),
  );
  const [formValues, setFormValues] = useState<Record<string, string | string[]>>({});

  const toggle = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setValue = (fieldId: string, value: string | string[]) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const isConditionMet = (condition?: Condition): boolean => {
    if (!condition) return true;
    const val = formValues[condition.fieldId];
    const strVal = Array.isArray(val) ? val.join(",") : (val ?? "");
    switch (condition.op) {
      case "eq": return strVal === condition.value;
      case "neq": return strVal !== condition.value;
      case "gt": return Number(strVal) > Number(condition.value ?? 0);
      case "lt": return Number(strVal) < Number(condition.value ?? 0);
      case "contains": return strVal.includes(condition.value ?? "");
      case "filled": return strVal.length > 0;
      default: return true;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          {schema.title}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {schema.description}
        </p>
      </div>

      <div className="space-y-4">
        {schema.sections.map((section) => {
          if (!isConditionMet(section.condition)) return null;
          const isOpen = expandedSections.has(section.id);
          const visibleFields = section.fields.filter((f) =>
            isConditionMet(f.condition),
          );

          return (
            <div
              key={section.id}
              className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
            >
              <button
                onClick={() => toggle(section.id)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-secondary/30"
              >
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {section.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {visibleFields.length} field{visibleFields.length !== 1 ? "s" : ""}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border px-6 py-5">
                  <div className="space-y-5">
                    {section.fields.map((field) => {
                      if (!isConditionMet(field.condition)) return null;
                      return (
                        <PreviewField
                          key={field.id}
                          field={field}
                          value={formValues[field.id]}
                          onChange={(v) => setValue(field.id, v)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-white p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          This is a preview of the applicant-facing form. Submit for admin
          review to publish it.
        </p>
        <button
          disabled
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground opacity-50"
        >
          Submit Application (Preview Only)
        </button>
      </div>
    </div>
  );
}

function PreviewField({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: string | string[] | undefined;
  onChange: (v: string | string[]) => void;
}) {
  const strVal = typeof value === "string" ? value : "";
  const arrVal = Array.isArray(value) ? value : [];

  const labelEl = (
    <label htmlFor={field.id} className="block text-sm font-semibold text-foreground">
      {field.label}
      {field.required && <span className="ml-1 text-destructive">*</span>}
      {field.condition && (
        <span className="ml-2 inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
          Conditional
        </span>
      )}
    </label>
  );

  const helpEl = field.helpText ? (
    <p className="mt-1 text-xs text-muted-foreground">{field.helpText}</p>
  ) : null;

  const inputCls =
    "mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  switch (field.type) {
    case "text":
    case "email":
    case "tel":
    case "date":
      return (
        <div>
          {labelEl}{helpEl}
          <input id={field.id} type={field.type} value={strVal}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder} className={inputCls} />
        </div>
      );

    case "number":
      return (
        <div>
          {labelEl}{helpEl}
          <input id={field.id} type="number" value={strVal}
            onChange={(e) => onChange(e.target.value)}
            min={field.validation?.min} max={field.validation?.max}
            className={inputCls} />
        </div>
      );

    case "currency":
      return (
        <div>
          {labelEl}{helpEl}
          <div className="relative mt-1.5">
            <span className="absolute left-3 top-2 text-sm text-muted-foreground">$</span>
            <input id={field.id} type="text" inputMode="numeric" value={strVal}
              onChange={(e) => onChange(e.target.value)}
              placeholder="0"
              className="w-full rounded-md border border-input bg-background py-2 pl-7 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
      );

    case "textarea":
      return (
        <div>
          {labelEl}{helpEl}
          <textarea id={field.id} value={strVal}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder} rows={3} className={inputCls} />
        </div>
      );

    case "select":
      return (
        <div>
          {labelEl}{helpEl}
          <select id={field.id} value={strVal}
            onChange={(e) => onChange(e.target.value)} className={inputCls}>
            <option value="">Select…</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );

    case "radio":
      return (
        <div>
          {labelEl}{helpEl}
          <div className="mt-2 space-y-2">
            {field.options?.map((opt) => (
              <label key={opt.value}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2.5 text-sm transition hover:bg-secondary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input type="radio" name={field.id} value={opt.value}
                  checked={strVal === opt.value} onChange={() => onChange(opt.value)}
                  className="accent-primary" />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div>
          {labelEl}{helpEl}
          <div className="mt-2 space-y-2">
            {field.options?.map((opt) => (
              <label key={opt.value}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2.5 text-sm transition hover:bg-secondary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input type="checkbox" value={opt.value}
                  checked={arrVal.includes(opt.value)}
                  onChange={(e) => {
                    onChange(e.target.checked
                      ? [...arrVal, opt.value]
                      : arrVal.filter((v) => v !== opt.value));
                  }}
                  className="accent-primary" />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div>
          {labelEl}
          <p className="mt-1 text-xs italic text-muted-foreground">
            Unsupported field type: {field.type}
          </p>
        </div>
      );
  }
}
