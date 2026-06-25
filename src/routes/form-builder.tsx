import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Eye,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Loader2,
  FileText,
  LayoutTemplate,
  ArrowLeft,
} from "lucide-react";
import {
  HOUSING_CONNECT_TEMPLATE,
  type FormSchema,
  type FormField,
  type Condition,
} from "../lib/form-schema";
import { formBuilderChat, type ChatMessage } from "../lib/form-builder-chat";

export const Route = createFileRoute("/form-builder")({
  head: () => ({
    meta: [
      { title: "Form Builder — Binti" },
      {
        name: "description",
        content:
          "Chat-based government benefit form builder for NYC Housing Connect.",
      },
    ],
  }),
  component: FormBuilderPage,
});

function FormBuilderPage() {
  const [schema, setSchema] = useState<FormSchema>(
    () => structuredClone(HOUSING_CONNECT_TEMPLATE),
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hi! I've loaded the NYC Housing Connect lottery application template. It has ${HOUSING_CONNECT_TEMPLATE.sections.length} sections with ${HOUSING_CONNECT_TEMPLATE.sections.reduce((n, s) => n + s.fields.length, 0)} questions.\n\nYou can ask me to:\n• Add, remove, or modify questions\n• Add conditional logic (e.g. "only show X if Y")\n• Reorder sections\n• Add eligibility rules\n• Customize labels and help text\n\nWhat would you like to change?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [view, setView] = useState<"chat" | "preview" | "split">("split");
  const [mobileTab, setMobileTab] = useState<"chat" | "preview">("chat");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setSending(true);

    try {
      const result = await formBuilderChat({
        data: { messages: updated, currentSchema: schema },
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.reply },
      ]);
      if (result.updatedSchema) {
        setSchema(result.updatedSchema);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [input, sending, messages, schema]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const totalFields = schema.sections.reduce(
    (n, s) => n + s.fields.length,
    0,
  );
  const conditionalFields = schema.sections.reduce(
    (n, s) => n + s.fields.filter((f) => f.condition).length,
    0,
  );

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border bg-white px-4 py-2.5">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </a>
          <div className="h-5 w-px bg-border" />
          <span className="font-serif text-lg font-bold tracking-tight text-[#00285f]">
            binti
          </span>
          <span className="text-xs text-muted-foreground">· Form Builder</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Stats */}
          <div className="hidden items-center gap-3 text-xs text-muted-foreground md:flex">
            <span>{schema.sections.length} sections</span>
            <span>·</span>
            <span>{totalFields} fields</span>
            {conditionalFields > 0 && (
              <>
                <span>·</span>
                <span>{conditionalFields} conditional</span>
              </>
            )}
          </div>
          <div className="h-5 w-px bg-border" />

          {/* View toggles — desktop */}
          <div className="hidden rounded-lg border border-border bg-card p-0.5 md:flex">
            {(
              [
                { id: "chat", icon: MessageSquare, label: "Chat" },
                { id: "split", icon: LayoutTemplate, label: "Split" },
                { id: "preview", icon: Eye, label: "Preview" },
              ] as const
            ).map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  view === v.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <v.icon className="h-3.5 w-3.5" />
                {v.label}
              </button>
            ))}
          </div>

          {/* Status badge */}
          <StatusBadge status={schema.status} />
        </div>
      </header>

      {/* Mobile tab bar */}
      <div className="flex border-b border-border md:hidden">
        {(
          [
            { id: "chat", icon: MessageSquare, label: "Chat" },
            { id: "preview", icon: Eye, label: "Preview" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMobileTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition ${
              mobileTab === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel */}
        <div
          className={`flex flex-col border-r border-border bg-white ${
            view === "preview"
              ? "hidden"
              : view === "split"
                ? "hidden w-[420px] shrink-0 md:flex"
                : "flex-1"
          } ${mobileTab !== "chat" ? "hidden md:flex" : "flex"}`}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="mx-auto max-w-2xl space-y-4">
              {messages.map((msg, i) => (
                <ChatBubble key={i} message={msg} />
              ))}
              {sending && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-border bg-white px-4 py-3">
            <div className="mx-auto flex max-w-2xl items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what to change…"
                rows={1}
                disabled={sending}
                className="flex-1 resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                style={{
                  height: "auto",
                  minHeight: "42px",
                  maxHeight: "120px",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mx-auto mt-1.5 max-w-2xl">
              <p className="text-[11px] text-muted-foreground">
                Try: "Add a question about pets" · "Make income required only for
                employed applicants" · "Add a section for veteran status"
              </p>
            </div>
          </div>
        </div>

        {/* Preview panel */}
        <div
          className={`flex-1 overflow-y-auto bg-gray-50 ${
            view === "chat"
              ? "hidden"
              : ""
          } ${mobileTab !== "preview" ? "hidden md:block" : "block"}`}
        >
          <FormPreview schema={schema} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: FormSchema["status"] }) {
  const config = {
    draft: { label: "Draft", cls: "bg-secondary text-muted-foreground" },
    pending_review: {
      label: "Pending review",
      cls: "bg-warning/20 text-warning-foreground",
    },
    approved: { label: "Approved", cls: "bg-success/15 text-success" },
    published: { label: "Published", cls: "bg-primary/15 text-primary" },
  };
  const c = config[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${c.cls}`}
    >
      {c.label}
    </span>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-card text-foreground"
        }`}
      >
        {message.content.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-1.5" : ""}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function FormPreview({ schema }: { schema: FormSchema }) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(schema.sections.map((s) => s.id)),
  );
  const [formValues, setFormValues] = useState<Record<string, string | string[]>>({});

  useEffect(() => {
    setExpandedSections(new Set(schema.sections.map((s) => s.id)));
  }, [schema]);

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
      case "eq":
        return strVal === condition.value;
      case "neq":
        return strVal !== condition.value;
      case "gt":
        return Number(strVal) > Number(condition.value ?? 0);
      case "lt":
        return Number(strVal) < Number(condition.value ?? 0);
      case "contains":
        return strVal.includes(condition.value ?? "");
      case "filled":
        return strVal.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-[#00285f]">
          <FileText className="h-3.5 w-3.5" />
          Live Preview
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
          {schema.title}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {schema.description}
        </p>
      </div>

      {/* Sections */}
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
                    {visibleFields.length} field
                    {visibleFields.length !== 1 ? "s" : ""}
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

      {/* Submit area */}
      <div className="mt-8 rounded-xl border border-border bg-white p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          This is a preview of the applicant-facing form. Changes made in the
          chat panel will update this preview in real time.
        </p>
        <button
          disabled
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-primary-foreground opacity-60"
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

  switch (field.type) {
    case "text":
    case "email":
    case "tel":
    case "date":
      return (
        <div>
          {labelEl}
          {helpEl}
          <input
            id={field.id}
            type={field.type}
            value={strVal}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      );

    case "number":
      return (
        <div>
          {labelEl}
          {helpEl}
          <input
            id={field.id}
            type="number"
            value={strVal}
            onChange={(e) => onChange(e.target.value)}
            min={field.validation?.min}
            max={field.validation?.max}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      );

    case "currency":
      return (
        <div>
          {labelEl}
          {helpEl}
          <div className="relative mt-1.5">
            <span className="absolute left-3 top-2 text-sm text-muted-foreground">
              $
            </span>
            <input
              id={field.id}
              type="text"
              inputMode="numeric"
              value={strVal}
              onChange={(e) => onChange(e.target.value)}
              placeholder="0"
              className="w-full rounded-md border border-input bg-background py-2 pl-7 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      );

    case "textarea":
      return (
        <div>
          {labelEl}
          {helpEl}
          <textarea
            id={field.id}
            value={strVal}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      );

    case "select":
      return (
        <div>
          {labelEl}
          {helpEl}
          <select
            id={field.id}
            value={strVal}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select…</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "radio":
      return (
        <div>
          {labelEl}
          {helpEl}
          <div className="mt-2 space-y-2">
            {field.options?.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2.5 text-sm transition hover:bg-secondary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={strVal === opt.value}
                  onChange={() => onChange(opt.value)}
                  className="accent-primary"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div>
          {labelEl}
          {helpEl}
          <div className="mt-2 space-y-2">
            {field.options?.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2.5 text-sm transition hover:bg-secondary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={arrVal.includes(opt.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...arrVal, opt.value]);
                    } else {
                      onChange(arrVal.filter((v) => v !== opt.value));
                    }
                  }}
                  className="accent-primary"
                />
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
          <p className="mt-1 text-xs text-muted-foreground italic">
            Unsupported field type: {field.type}
          </p>
        </div>
      );
  }
}
