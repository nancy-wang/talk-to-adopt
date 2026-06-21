import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mic, FileText, ShieldCheck, Languages, CheckCircle2, AlertTriangle,
  Upload, Type, ChevronRight, ChevronLeft, Volume2, Pause, Play, Sparkles,
  Home as HomeIcon, User, Baby, Calendar, Phone, Lock, FileCheck, Loader2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hearth — Childcare Adoption Application" },
      { name: "description", content: "Voice-guided childcare adoption application. Upload your documents and finish in your own words." },
    ],
  }),
  component: App,
});

type Step = "landing" | "upload" | "review-ocr" | "interview" | "review-all" | "confirm";
type Lang = "en" | "es";

const t = {
  en: {
    tagline: "A kinder way to apply",
    title: "Childcare adoption,\nin your own words.",
    sub: "Upload three documents. We'll fill in what we can. Then we'll ask you the rest — out loud, in plain language.",
    start: "Start my application",
    learn: "How it works",
    pickLang: "Choose your language",
    private: "Private & secure",
    voiceFirst: "Voice-first",
    multilingual: "English & Spanish",
  },
  es: {
    tagline: "Una forma más amable de aplicar",
    title: "Adopción de cuidado infantil,\nen tus propias palabras.",
    sub: "Sube tres documentos. Llenaremos lo que podamos. Luego te preguntaremos el resto — en voz alta y en lenguaje sencillo.",
    start: "Comenzar mi solicitud",
    learn: "Cómo funciona",
    pickLang: "Elige tu idioma",
    private: "Privado y seguro",
    voiceFirst: "Por voz primero",
    multilingual: "Inglés y Español",
  },
};

function App() {
  const [step, setStep] = useState<Step>("landing");
  const [lang, setLang] = useState<Lang>("en");

  return (
    <div className="min-h-screen">
      <TopBar step={step} lang={lang} setLang={setLang} onHome={() => setStep("landing")} />
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-6">
        {step === "landing" && <Landing lang={lang} setLang={setLang} onStart={() => setStep("upload")} />}
        {step === "upload" && <UploadStep onNext={() => setStep("review-ocr")} onBack={() => setStep("landing")} />}
        {step === "review-ocr" && <ReviewOCR onNext={() => setStep("interview")} onBack={() => setStep("upload")} />}
        {step === "interview" && <Interview onNext={() => setStep("review-all")} onBack={() => setStep("review-ocr")} />}
        {step === "review-all" && <ReviewAll onNext={() => setStep("confirm")} onBack={() => setStep("interview")} />}
        {step === "confirm" && <Confirm onRestart={() => setStep("landing")} />}
      </main>
      <Footer />
    </div>
  );
}

const STEPS: { id: Step; label: string }[] = [
  { id: "upload", label: "Documents" },
  { id: "review-ocr", label: "Review" },
  { id: "interview", label: "Interview" },
  { id: "review-all", label: "Confirm" },
  { id: "confirm", label: "Done" },
];

function TopBar({ step, lang, setLang, onHome }: { step: Step; lang: Lang; setLang: (l: Lang) => void; onHome: () => void }) {
  const idx = STEPS.findIndex((s) => s.id === step);
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <button onClick={onHome} className="flex items-center gap-2 text-left">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <HomeIcon className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-lg font-semibold">Hearth</div>
            <div className="text-xs text-muted-foreground">Childcare Adoption Services</div>
          </div>
        </button>
        {step !== "landing" && step !== "confirm" && (
          <div className="hidden flex-1 px-8 md:block">
            <Stepper currentIdx={idx} />
          </div>
        )}
        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 text-sm">
          <button
            onClick={() => setLang("en")}
            className={`rounded-full px-3 py-1 transition ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >EN</button>
          <button
            onClick={() => setLang("es")}
            className={`rounded-full px-3 py-1 transition ${lang === "es" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >ES</button>
        </div>
      </div>
    </header>
  );
}

function Stepper({ currentIdx }: { currentIdx: number }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-semibold transition
              ${active ? "border-primary bg-primary text-primary-foreground" :
                done ? "border-success bg-success text-success-foreground" :
                "border-border bg-card text-muted-foreground"}`}>
              {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-sm ${active ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
            {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- Landing ---------- */
function Landing({ lang, setLang, onStart }: { lang: Lang; setLang: (l: Lang) => void; onStart: () => void }) {
  const c = t[lang];
  return (
    <section className="pt-8 md:pt-16">
      <div className="grid items-center gap-12 md:grid-cols-[1.15fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> {c.tagline}
          </div>
          <h1 className="mt-5 whitespace-pre-line font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            {c.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">{c.sub}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
            >
              <Mic className="h-5 w-5" /> {c.start}
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3.5 text-base font-medium hover:bg-secondary">
              {c.learn}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> {c.private}</span>
            <span className="inline-flex items-center gap-2"><Mic className="h-4 w-4 text-primary" /> {c.voiceFirst}</span>
            <span className="inline-flex items-center gap-2"><Languages className="h-4 w-4 text-primary" /> {c.multilingual}</span>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-4">
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.pickLang}</div>
            <div className="flex gap-2">
              {[
                { id: "en" as const, label: "English" },
                { id: "es" as const, label: "Español" },
              ].map((o) => (
                <button
                  key={o.id}
                  onClick={() => setLang(o.id)}
                  className={`flex-1 rounded-xl border px-4 py-3 text-left transition
                    ${lang === o.id ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"}`}
                >
                  <div className="font-semibold">{o.label}</div>
                  <div className="text-xs text-muted-foreground">{o.id === "en" ? "Voice & text" : "Voz y texto"}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <HeroIllustration />
      </div>

      <div className="mt-20 grid gap-4 md:grid-cols-3">
        <HowCard n="1" icon={<Upload className="h-5 w-5" />} title="Upload three things"
          body="Your ID, your W-9, and your child's school ID. Photos from your phone work great." />
        <HowCard n="2" icon={<Sparkles className="h-5 w-5" />} title="We pre-fill what we can"
          body="We read your documents and fill in the form. You confirm before anything is saved." />
        <HowCard n="3" icon={<Mic className="h-5 w-5" />} title="Finish out loud"
          body="A guided interview asks the rest. Speak naturally — full sentences, your language." />
      </div>
    </section>
  );
}

function HowCard({ n, icon, title, body }: { n: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary">{icon}</div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step {n}</span>
      </div>
      <h3 className="mt-4 font-serif text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-secondary via-background to-accent/20 blur-2xl" />
      <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_30px_60px_-30px_rgba(40,60,40,0.25)]">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Question 4 of 9</span>
          <span className="inline-flex items-center gap-1"><Volume2 className="h-3.5 w-3.5" /> Reading aloud</span>
        </div>
        <div className="mt-4 rounded-2xl bg-secondary p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">We're asking</div>
          <p className="mt-2 font-serif text-2xl leading-snug">
            "How many people live in your home right now?"
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center">
          <div className="relative">
            <div className="mic-ring relative grid h-24 w-24 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <Mic className="h-9 w-9" />
            </div>
          </div>
          <div className="mt-4 flex h-10 items-end gap-1">
            {[0.5, 0.8, 0.3, 0.9, 0.6, 1, 0.4, 0.7, 0.5].map((h, i) => (
              <span
                key={i}
                className="wave-bar block w-1 rounded-full bg-primary/70"
                style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Listening… speak whenever you're ready</p>

          <button className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:underline">
            <Type className="h-4 w-4" /> Type my answer instead
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Upload ---------- */
function UploadStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const docs = [
    { id: "id", label: "Your photo ID", hint: "Driver's license or passport. A clear phone photo is fine.", icon: <User className="h-5 w-5" /> },
    { id: "w9", label: "W-9 form", hint: "From your employer. We use it for income and address.", icon: <FileText className="h-5 w-5" /> },
    { id: "school", label: "Child's school ID", hint: "School photo ID or printed enrollment card.", icon: <Baby className="h-5 w-5" /> },
  ];
  const allDone = docs.every((d) => uploaded[d.id]);
  return (
    <StepShell
      title="Let's start with your documents"
      subtitle="We'll read them once to fill in the easy parts. They're never shared and not stored after this session."
    >
      <div className="grid gap-3">
        {docs.map((d) => (
          <div key={d.id} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary">{d.icon}</div>
            <div className="flex-1">
              <div className="font-semibold">{d.label}</div>
              <div className="text-sm text-muted-foreground">{d.hint}</div>
            </div>
            {uploaded[d.id] ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1.5 text-sm font-medium text-success">
                <CheckCircle2 className="h-4 w-4" /> Uploaded
              </span>
            ) : (
              <button
                onClick={() => setUploaded((u) => ({ ...u, [d.id]: true }))}
                className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10"
              >
                <Upload className="h-4 w-4" /> Upload
              </button>
            )}
          </div>
        ))}
      </div>

      <Privacy />
      <NavRow onBack={onBack} onNext={onNext} nextDisabled={!allDone} nextLabel="Continue" />
    </StepShell>
  );
}

/* ---------- Review OCR ---------- */
function ReviewOCR({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  type Conf = "high" | "med" | "low";
  const initial: { key: string; label: string; value: string; conf: Conf; src: string }[] = [
    { key: "name", label: "Full legal name", value: "María Elena Hernández", conf: "high", src: "Driver's license" },
    { key: "dob", label: "Date of birth", value: "March 14, 1989", conf: "high", src: "Driver's license" },
    { key: "ssn", label: "Social Security Number", value: "•••–••–4421", conf: "high", src: "W-9" },
    { key: "address", label: "Home address", value: "248 Linden St, Apt 3B, Oakland CA 94607", conf: "med", src: "Driver's license" },
    { key: "employer", label: "Employer", value: "Bayview Community Health", conf: "high", src: "W-9" },
    { key: "childName", label: "Child's full name", value: "Diego Hernández", conf: "high", src: "School ID" },
    { key: "childDob", label: "Child's date of birth", value: "Aug 2, 2019", conf: "high", src: "School ID" },
    { key: "school", label: "School name", value: "Lincoln Elementary", conf: "low", src: "School ID" },
    { key: "grade", label: "Grade", value: "Kindergarten", conf: "med", src: "School ID" },
  ];
  const [fields] = useState(initial);
  const lowCount = fields.filter((f) => f.conf !== "high").length;

  return (
    <StepShell
      title="Here's what we found"
      subtitle="Confirm anything we may have read wrong. Fields we're less sure about are marked for you."
    >
      {lowCount > 0 && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-warning-foreground" />
          <div>
            <div className="font-semibold">{lowCount} field{lowCount > 1 ? "s" : ""} need a quick look</div>
            <div className="text-sm text-muted-foreground">Tap any field to edit. Yellow = double-check. Red = please correct.</div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {fields.map((f, i) => (
          <div key={f.key} className={`flex items-center gap-4 p-4 ${i > 0 ? "border-t border-border" : ""}`}>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">{f.label} · from {f.src}</div>
              <div className="mt-0.5 font-medium">{f.value}</div>
            </div>
            <ConfChip conf={f.conf} />
            <button className="text-sm font-medium text-primary hover:underline">Edit</button>
          </div>
        ))}
      </div>

      <NavRow onBack={onBack} onNext={onNext} nextLabel="Looks good — continue" />
    </StepShell>
  );
}

function ConfChip({ conf }: { conf: "high" | "med" | "low" }) {
  if (conf === "high") return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
      <CheckCircle2 className="h-3.5 w-3.5" /> Confident
    </span>
  );
  if (conf === "med") return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/20 px-2.5 py-1 text-xs font-medium text-warning-foreground">
      <AlertTriangle className="h-3.5 w-3.5" /> Double-check
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-medium text-destructive">
      <AlertTriangle className="h-3.5 w-3.5" /> Please review
    </span>
  );
}

/* ---------- Interview ---------- */
const QUESTIONS = [
  { q: "What's the best phone number to reach you on?", section: "About you", placeholder: "e.g. 510-555-0142" },
  { q: "And an email address, if you have one?", section: "About you", placeholder: "e.g. maria@email.com" },
  { q: "About what is your household's yearly income?", section: "About you", placeholder: "A rough number is okay" },
  { q: "Do you rent your home, own it, or something else?", section: "About you", placeholder: "Rent / Own / Other" },
  { q: "How many people live in your home, including you?", section: "About you", placeholder: "e.g. 4" },
  { q: "What's your relationship to Diego?", section: "About Diego", placeholder: "e.g. Mother, Aunt, Guardian" },
  { q: "Does Diego have any medical conditions or special needs we should know about?", section: "About Diego", placeholder: "It's okay to say 'none'" },
  { q: "What kind of care are you looking for — full-time, part-time, or occasional?", section: "Care needed", placeholder: "Full-time / Part-time / Respite" },
  { q: "When would you ideally like care to start?", section: "Care needed", placeholder: "A date or month is fine" },
];

function Interview({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [i, setI] = useState(0);
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [state, setState] = useState<"idle" | "listening" | "heard" | "confirmed">("listening");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [textValue, setTextValue] = useState("");
  const total = QUESTIONS.length;
  const cur = QUESTIONS[i];

  const sample: Record<number, string> = {
    0: "Five one zero, five five five, zero one four two",
    1: "maria dot hernandez at email dot com",
    2: "About forty-two thousand a year",
    3: "We rent",
    4: "Four — me, Diego, and my two other kids",
    5: "I'm his mother",
    6: "He has mild asthma, uses an inhaler",
    7: "Full-time, Monday through Friday",
    8: "Starting in September if possible",
  };

  const next = () => {
    if (i < total - 1) {
      setI(i + 1);
      setState(mode === "voice" ? "listening" : "idle");
      setTextValue("");
    } else onNext();
  };

  const confirm = () => {
    setAnswers((a) => ({ ...a, [i]: sample[i] }));
    setState("confirmed");
    setTimeout(next, 500);
  };

  const submitText = () => {
    if (!textValue.trim()) return;
    setAnswers((a) => ({ ...a, [i]: textValue }));
    next();
  };

  return (
    <StepShell
      title="Now let's talk it through"
      subtitle="We'll ask a few questions out loud. Answer in full sentences — that works best."
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{cur.section}</span> · Question {i + 1} of {total}
        </div>
        <div className="inline-flex rounded-full border border-border bg-card p-1 text-sm">
          <button
            onClick={() => { setMode("voice"); setState("listening"); }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${mode === "voice" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          ><Mic className="h-3.5 w-3.5" /> Voice</button>
          <button
            onClick={() => { setMode("text"); setState("idle"); }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${mode === "text" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          ><Type className="h-3.5 w-3.5" /> Type</button>
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((i + 1) / total) * 100}%` }} />
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-card p-6 md:p-10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Volume2 className="h-3.5 w-3.5" /> Listen
          <button className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 hover:bg-muted">
            <Play className="h-3 w-3" /> Replay
          </button>
        </div>
        <p className="mt-3 font-serif text-3xl leading-snug md:text-4xl">"{cur.q}"</p>

        {mode === "voice" ? (
          <div className="mt-10 flex flex-col items-center">
            <div className="relative">
              <button
                onClick={() => setState(state === "listening" ? "heard" : "listening")}
                className={`relative grid h-28 w-28 place-items-center rounded-full text-primary-foreground shadow-lg transition
                  ${state === "listening" ? "mic-ring bg-primary" : "bg-primary/90 hover:bg-primary"}`}
              >
                {state === "listening" ? <Mic className="h-10 w-10" /> : <Pause className="h-10 w-10" />}
              </button>
            </div>

            {state === "listening" && (
              <>
                <div className="mt-5 flex h-10 items-end gap-1">
                  {[0.5, 0.8, 0.3, 0.9, 0.6, 1, 0.4, 0.7, 0.5, 0.8, 0.4].map((h, k) => (
                    <span key={k} className="wave-bar block w-1.5 rounded-full bg-primary/70"
                      style={{ height: `${h * 100}%`, animationDelay: `${k * 0.08}s` }} />
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Listening… tap to stop when you're done</p>
                <button onClick={() => setState("heard")} className="mt-2 text-sm font-medium text-primary hover:underline">
                  I'm done speaking
                </button>
              </>
            )}

            {state === "heard" && (
              <div className="mt-6 w-full max-w-md rounded-2xl bg-secondary p-5">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">I heard you say</div>
                <p className="mt-2 text-lg">"{sample[i]}"</p>
                <p className="mt-1 text-xs text-muted-foreground">Is that right?</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={confirm}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 font-semibold text-primary-foreground">
                    <CheckCircle2 className="h-4 w-4" /> Yes, that's right
                  </button>
                  <button onClick={() => setState("listening")}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 font-medium">
                    Try again
                  </button>
                </div>
                <button onClick={() => { setMode("text"); setState("idle"); }}
                  className="mt-3 w-full text-center text-sm text-muted-foreground hover:underline">
                  Or type my answer instead
                </button>
              </div>
            )}

            {state === "confirmed" && (
              <div className="mt-6 inline-flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" /> Saved
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8">
            <label className="text-sm font-medium">Your answer</label>
            <textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={cur.placeholder}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <div className="mt-3 flex justify-end">
              <button onClick={submitText} disabled={!textValue.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground disabled:opacity-40">
                Save & continue <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <div className="text-sm text-muted-foreground">{Object.keys(answers).length} answered</div>
        <button onClick={next} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          Skip <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </StepShell>
  );
}

/* ---------- Review all ---------- */
function ReviewAll({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const sections = [
    { title: "Applicant information", icon: <User className="h-4 w-4" />, rows: [
      ["Full legal name", "María Elena Hernández", "doc"],
      ["Date of birth", "March 14, 1989", "doc"],
      ["SSN", "•••–••–4421", "doc"],
      ["Home address", "248 Linden St, Apt 3B, Oakland CA 94607", "doc"],
      ["Phone", "(510) 555-0142", "voice"],
      ["Email", "maria.hernandez@email.com", "voice"],
      ["Employer", "Bayview Community Health", "doc"],
      ["Household income", "About $42,000 / year", "voice"],
      ["Housing", "Rent", "voice"],
      ["People in household", "4", "voice"],
    ]},
    { title: "About Diego", icon: <Baby className="h-4 w-4" />, rows: [
      ["Full name", "Diego Hernández", "doc"],
      ["Date of birth", "Aug 2, 2019", "doc"],
      ["School", "Lincoln Elementary", "doc"],
      ["Grade", "Kindergarten", "doc"],
      ["Relationship", "Mother", "voice"],
      ["Medical / special needs", "Mild asthma, uses an inhaler", "voice"],
    ]},
    { title: "Care requested", icon: <Calendar className="h-4 w-4" />, rows: [
      ["Type of care", "Full-time, Mon–Fri", "voice"],
      ["Preferred start", "September 2026", "voice"],
    ]},
    { title: "Emergency contact", icon: <Phone className="h-4 w-4" />, rows: [
      ["Name", "Add a contact", "missing"],
    ]},
  ] as const;

  return (
    <StepShell
      title="One last look before you send it"
      subtitle="Review everything below. Tap any line to make a change."
    >
      <div className="space-y-5">
        {sections.map((s) => (
          <div key={s.title} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-5 py-3">
              <div className="inline-flex items-center gap-2 font-semibold">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary">{s.icon}</span>
                {s.title}
              </div>
              <button className="text-sm font-medium text-primary hover:underline">Edit section</button>
            </div>
            <dl>
              {s.rows.map(([k, v, src], i) => (
                <div key={k} className={`flex items-start justify-between gap-4 px-5 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}>
                  <dt className="w-1/3 text-sm text-muted-foreground">{k}</dt>
                  <dd className="flex-1 font-medium">{v}</dd>
                  <SrcBadge src={src as "doc" | "voice" | "missing"} />
                </div>
              ))}
            </dl>
          </div>
        ))}

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="inline-flex items-center gap-2 font-semibold"><FileCheck className="h-4 w-4 text-primary" /> Sign & attest</div>
          <p className="mt-1 text-sm text-muted-foreground">By submitting, I confirm the information above is accurate to the best of my knowledge.</p>
          <input
            placeholder="Type your full name to sign"
            className="mt-3 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <NavRow onBack={onBack} onNext={onNext} nextLabel="Submit application" />
    </StepShell>
  );
}

function SrcBadge({ src }: { src: "doc" | "voice" | "missing" }) {
  if (src === "doc") return <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground"><FileText className="h-3 w-3" /> From document</span>;
  if (src === "voice") return <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"><Mic className="h-3 w-3" /> Said aloud</span>;
  return <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-medium text-destructive"><AlertTriangle className="h-3 w-3" /> Needed</span>;
}

/* ---------- Confirm ---------- */
function Confirm({ onRestart }: { onRestart: () => void }) {
  return (
    <section className="pt-10">
      <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h2 className="mt-5 font-serif text-3xl font-semibold">Your application is in.</h2>
        <p className="mt-3 text-muted-foreground">
          A case worker has been notified and will reach out within 2 business days. We sent a confirmation to
          <span className="font-medium text-foreground"> maria.hernandez@email.com</span>.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
          <span className="text-muted-foreground">Confirmation #</span>
          <span className="font-mono font-semibold">HRT-2026-04821</span>
        </div>

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
          {[
            { t: "Documents", v: "3 uploaded" },
            { t: "Voice answers", v: "9 recorded" },
            { t: "Time to complete", v: "11 min" },
          ].map((x) => (
            <div key={x.t} className="rounded-xl border border-border bg-background p-3">
              <div className="text-xs text-muted-foreground">{x.t}</div>
              <div className="font-semibold">{x.v}</div>
            </div>
          ))}
        </div>

        <button onClick={onRestart} className="mt-8 text-sm font-medium text-primary hover:underline">
          Start a new application
        </button>
      </div>
    </section>
  );
}

/* ---------- Shared bits ---------- */
function StepShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="pt-6">
      <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function NavRow({ onBack, onNext, nextLabel, nextDisabled }: { onBack: () => void; onNext: () => void; nextLabel: string; nextDisabled?: boolean }) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-secondary">
        <ChevronLeft className="h-4 w-4" /> Back
      </button>
      <button onClick={onNext} disabled={nextDisabled}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-95 disabled:opacity-40">
        {nextLabel} <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Privacy() {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-2xl bg-secondary/60 p-4 text-sm">
      <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div className="text-muted-foreground">
        Your documents are encrypted in transit and deleted after we fill the form. School records are used only for this application (FERPA).
        Medical information is treated as protected health information (HIPAA).
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-5 py-6 text-sm text-muted-foreground md:flex-row md:items-center">
        <div>© {new Date().getFullYear()} Hearth · A childcare adoption services prototype</div>
        <div className="flex gap-5">
          <a className="hover:text-foreground">Privacy</a>
          <a className="hover:text-foreground">Accessibility</a>
          <a className="hover:text-foreground">Get help</a>
        </div>
      </div>
    </footer>
  );
}
