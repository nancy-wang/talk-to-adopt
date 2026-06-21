import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Mic, FileText, ShieldCheck, Languages, CheckCircle2, AlertTriangle,
  Upload, Type, ChevronRight, ChevronLeft, Volume2, Pause, Play,
  User, Baby, Phone, Lock, FileCheck, X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Binti — Adoption Application" },
      { name: "description", content: "Voice-guided adoption application. Upload your documents and finish in your own words." },
    ],
  }),
  component: App,
});

type Step = "landing" | "upload" | "review-ocr" | "interview" | "review-all" | "confirm";
type Lang = "en" | "es";

// ── Translations ────────────────────────────────────────────────────────────

const t = {
  en: {
    // Landing
    tagline: "Powered by Binti",
    title: "Every child deserves\na loving home.",
    sub: "We're here to make the paperwork the easy part. Upload your documents, confirm what we found, and answer the rest in your own words — at your own pace.",
    start: "Start my application",
    resume: "Resume my application",
    learn: "How it works",
    pickLang: "Choose your language",
    private: "Private & secure",
    voiceFirst: "Voice-first",
    multilingual: "English & Spanish",
    how1title: "Upload three documents",
    how1body: "Your ID, proof of income, and your child's school ID. We only read them to fill the form — they're deleted right after.",
    how2title: "We fill in what we can",
    how2body: "We read your documents and pre-fill the form for you. Review everything before moving on — nothing is saved without your confirmation.",
    how3title: "Answer the rest your way",
    how3body: "A few short questions, most taking seconds. One open question lets you speak freely in your own words.",
    // Upload
    uploadTitle: "Let's start with your documents",
    uploadSubtitle: "We only read these once to fill in the form, then delete them. Don't have one? That's okay — you can skip it.",
    uploadDont: "I don't have this",
    uploadSkipped: "Skipped",
    uploadUploaded: "Uploaded",
    uploadContinue: "Continue",
    uploadPrivacy: "Your documents are encrypted in transit and deleted as soon as we fill in the form. School records are used only for this application (FERPA). Medical information is handled as protected health information (HIPAA).",
    docIdLabel: "Your photo ID",
    docIdHint: "Driver's license or passport. A clear phone photo is fine.",
    docIncomeLabel: "Proof of income",
    docIncomeHint: "A recent pay stub or W-2. Helps verify your household income and address.",
    docSchoolLabel: "Child's school ID",
    docSchoolHint: "School photo ID or printed enrollment card. Helps confirm your child's information.",
    // OCR
    ocrTitle: "Here's what we found",
    ocrSubtitle: "Take a moment to check these. Tap Edit on anything that looks wrong — it's easy to fix.",
    ocrNeedLook_one: "field needs a quick look",
    ocrNeedLook_other: "fields need a quick look",
    ocrInstruction: "Tap Edit on any field to correct it. Yellow = please double-check. Red = please correct before continuing.",
    ocrEdit: "Edit",
    ocrSave: "Save",
    ocrCancel: "Cancel",
    ocrContinue: "Everything looks right — continue",
    ocrConfident: "Confirmed",
    ocrDoubleCheck: "Double-check",
    ocrReview: "Please correct",
    ocrSsnNote: "Only the last 4 digits are shown — your full number is never displayed or stored.",
    // Interview
    interviewTitle: "Just a few more questions",
    interviewSubtitle: "These help us understand your family's situation. Take your time — there are no wrong answers.",
    voiceQuestion: "Speak your answer",
    readAloud: "Read aloud",
    replay: "Replay",
    listeningPrompt: "Listening… tap to stop when you're done",
    doneSpeaking: "I'm done speaking",
    iHeard: "I heard you say",
    isRight: "Does that sound right?",
    yesRight: "Yes, that's right",
    tryAgain: "Try again",
    typeInstead: "Type my answer instead",
    preferType: "Prefer to type?",
    useVoice: "Use voice instead",
    saveContinue: "Save & continue",
    back: "Back",
    skip: "Skip for now",
    answeredOf: "of",
    answeredLabel: "answered",
    // Review
    reviewTitle: "Almost there — one last look",
    reviewSubtitle: "Everything you've shared is below. Tap Edit on any section to make a change before you submit.",
    sectionApplicant: "About you",
    sectionChild: "About",
    sectionEmergency: "Emergency contact",
    editSection: "Edit",
    fromDoc: "From document",
    saidAloud: "Your answer",
    needed: "Not yet answered",
    signTitle: "Review & sign",
    signBody: "By submitting, you confirm the information above is accurate. Your case worker will follow up within 2 business days.",
    signPlaceholder: "Type your full name to sign",
    submit: "Submit application",
    // Field labels
    fieldName: "Full legal name",
    fieldDob: "Date of birth",
    fieldSsn: "SSN",
    fieldAddress: "Home address",
    fieldPhone: "Phone",
    fieldEmail: "Email",
    fieldEmployer: "Employer",
    fieldIncome: "Household income",
    fieldHousing: "Housing",
    fieldHouseholdSize: "People in household",
    fieldChildName: "Full name",
    fieldChildDob: "Date of birth",
    fieldSchool: "School",
    fieldGrade: "Grade",
    fieldRelationship: "Your relationship",
    fieldMedical: "Health & special needs",
    fieldEmergencyName: "Name",
    // Confirm
    confirmTitle: "You're on your way.",
    confirmSubtitle: "Your application has been received. Here's what happens next.",
    confirmBody: "We sent a confirmation to",
    confirmNum: "Reference #",
    confirmDocs: "Documents",
    confirmVoice: "Voice answer",
    confirmTime: "Time to complete",
    confirmNext: "What happens next",
    confirmStep1: "Your case worker reviews your application",
    confirmStep1sub: "Usually within 2 business days",
    confirmStep2: "They'll reach out to schedule a call",
    confirmStep2sub: "By phone or email — whichever you prefer",
    confirmStep3: "Together, you'll plan the next steps",
    confirmStep3sub: "Your family's journey continues from here",
    startNew: "Start a new application",
  },
  es: {
    // Landing
    tagline: "Desarrollado por Binti",
    title: "Cada niño merece\nun hogar amoroso.",
    sub: "Estamos aquí para hacer que el papeleo sea la parte fácil. Sube tus documentos, confirma lo que encontramos y responde el resto con tus propias palabras — a tu ritmo.",
    start: "Comenzar mi solicitud",
    resume: "Continuar mi solicitud",
    learn: "Cómo funciona",
    pickLang: "Elige tu idioma",
    private: "Privado y seguro",
    voiceFirst: "Por voz",
    multilingual: "Inglés y Español",
    how1title: "Sube tres documentos",
    how1body: "Tu identificación, comprobante de ingresos e identificación escolar de tu hijo. Solo los leemos para rellenar el formulario — se eliminan de inmediato.",
    how2title: "Rellenamos lo que podemos",
    how2body: "Leemos tus documentos y pre-rellenamos el formulario. Revisa todo antes de continuar — nada se guarda sin tu confirmación.",
    how3title: "Responde a tu manera",
    how3body: "Algunas preguntas cortas, la mayoría de segundos. Una pregunta abierta te permite hablar libremente con tus propias palabras.",
    // Upload
    uploadTitle: "Empecemos con tus documentos",
    uploadSubtitle: "Solo los leemos una vez para rellenar el formulario, luego los eliminamos. ¿No tienes alguno? Está bien — puedes omitirlo.",
    uploadDont: "No tengo este documento",
    uploadSkipped: "Omitido",
    uploadUploaded: "Subido",
    uploadContinue: "Continuar",
    uploadPrivacy: "Tus documentos están cifrados durante la transmisión y se eliminan en cuanto rellenamos el formulario. Los expedientes escolares solo se usan para esta solicitud (FERPA). La información médica se maneja como información de salud protegida (HIPAA).",
    docIdLabel: "Tu identificación con foto",
    docIdHint: "Licencia de conducir o pasaporte. Una foto clara del teléfono está bien.",
    docIncomeLabel: "Comprobante de ingresos",
    docIncomeHint: "Talón de pago reciente o W-2. Ayuda a verificar tus ingresos y dirección.",
    docSchoolLabel: "Identificación escolar del niño",
    docSchoolHint: "Identificación escolar con foto o tarjeta de inscripción. Ayuda a confirmar la información de tu hijo.",
    // OCR
    ocrTitle: "Esto es lo que encontramos",
    ocrSubtitle: "Tómate un momento para revisarlo. Toca Editar en lo que no se vea bien — es fácil de corregir.",
    ocrNeedLook_one: "campo requiere revisión",
    ocrNeedLook_other: "campos requieren revisión",
    ocrInstruction: "Toca Editar en cualquier campo para corregirlo. Amarillo = verificar. Rojo = corregir antes de continuar.",
    ocrEdit: "Editar",
    ocrSave: "Guardar",
    ocrCancel: "Cancelar",
    ocrContinue: "Todo se ve bien — continuar",
    ocrConfident: "Confirmado",
    ocrDoubleCheck: "Verificar",
    ocrReview: "Por favor corregir",
    ocrSsnNote: "Solo se muestran los últimos 4 dígitos — tu número completo nunca se muestra ni se almacena.",
    // Interview
    interviewTitle: "Solo unas preguntas más",
    interviewSubtitle: "Estas nos ayudan a entender la situación de tu familia. Tómate tu tiempo — no hay respuestas incorrectas.",
    voiceQuestion: "Habla tu respuesta",
    readAloud: "Leer en voz alta",
    replay: "Repetir",
    listeningPrompt: "Escuchando… toca para parar cuando hayas terminado",
    doneSpeaking: "Ya terminé de hablar",
    iHeard: "Lo que escuché fue",
    isRight: "¿Suena correcto?",
    yesRight: "Sí, es correcto",
    tryAgain: "Intentar de nuevo",
    typeInstead: "Escribir mi respuesta",
    preferType: "¿Prefieres escribir?",
    useVoice: "Usar voz en su lugar",
    saveContinue: "Guardar y continuar",
    back: "Atrás",
    skip: "Omitir por ahora",
    answeredOf: "de",
    answeredLabel: "respondidas",
    // Review
    reviewTitle: "Casi listo — un último vistazo",
    reviewSubtitle: "Todo lo que compartiste está abajo. Toca Editar en cualquier sección para hacer un cambio antes de enviar.",
    sectionApplicant: "Sobre ti",
    sectionChild: "Sobre",
    sectionEmergency: "Contacto de emergencia",
    editSection: "Editar sección",
    fromDoc: "Del documento",
    saidAloud: "Dicho en voz alta",
    needed: "Necesario",
    signTitle: "Firmar y atestiguar",
    signBody: "Al enviar, confirmo que la información anterior es correcta a mi mejor saber y entender.",
    signPlaceholder: "Escribe tu nombre completo para firmar",
    submit: "Enviar solicitud",
    // Field labels
    fieldName: "Nombre legal completo",
    fieldDob: "Fecha de nacimiento",
    fieldSsn: "Núm. de Seguro Social",
    fieldAddress: "Dirección de casa",
    fieldPhone: "Teléfono",
    fieldEmail: "Correo electrónico",
    fieldEmployer: "Empleador",
    fieldIncome: "Ingresos del hogar",
    fieldHousing: "Vivienda",
    fieldHouseholdSize: "Personas en el hogar",
    fieldChildName: "Nombre completo",
    fieldChildDob: "Fecha de nacimiento",
    fieldSchool: "Escuela",
    fieldGrade: "Grado",
    fieldRelationship: "Tu relación",
    fieldMedical: "Salud y necesidades especiales",
    fieldEmergencyName: "Nombre",
    // Confirm
    confirmTitle: "Estás en camino.",
    confirmSubtitle: "Tu solicitud ha sido recibida. Esto es lo que sigue.",
    confirmBody: "Enviamos una confirmación a",
    confirmNum: "Referencia N.°",
    confirmDocs: "Documentos",
    confirmVoice: "Respuesta de voz",
    confirmTime: "Tiempo para completar",
    confirmNext: "Qué sucede ahora",
    confirmStep1: "Tu trabajador social revisa tu solicitud",
    confirmStep1sub: "Generalmente en un plazo de 2 días hábiles",
    confirmStep2: "Se pondrán en contacto contigo para programar una llamada",
    confirmStep2sub: "Por teléfono o correo electrónico — como prefieras",
    confirmStep3: "Juntos planificarán los próximos pasos",
    confirmStep3sub: "El camino de tu familia continúa desde aquí",
    startNew: "Iniciar una nueva solicitud",
  },
} as const;

// ── Session persistence ─────────────────────────────────────────────────────

const SESSION_KEY = "binti_adoption_session";

interface SessionData {
  step: Step;
  lang: Lang;
  answers: Record<string, string>;
  uploaded: Record<string, boolean>;
  skipped: string[];
}

function loadSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(data: SessionData) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch { /* ignore */ }
}

// ── App ─────────────────────────────────────────────────────────────────────

function App() {
  const saved = loadSession();
  const [step, setStep] = useState<Step>(saved?.step ?? "landing");
  const [lang, setLang] = useState<Lang>(saved?.lang ?? "en");
  const [answers, setAnswers] = useState<Record<string, string>>(saved?.answers ?? {});
  const [uploaded, setUploaded] = useState<Record<string, boolean>>(saved?.uploaded ?? {});
  const [skipped, setSkipped] = useState<string[]>(saved?.skipped ?? []);

  useEffect(() => {
    if (step === "landing") return;
    saveSession({ step, lang, answers, uploaded, skipped });
  }, [step, lang, answers, uploaded, skipped]);

  const goHome = () => setStep("landing");

  return (
    <div className="min-h-screen">
      <TopBar step={step} lang={lang} setLang={setLang} onHome={goHome} />
      <main className="mx-auto max-w-5xl px-5 pb-24 pt-6">
        {step === "landing" && (
          <Landing
            lang={lang} setLang={setLang}
            hasSession={!!saved && saved.step !== "landing"}
            onStart={() => { clearSession(); setAnswers({}); setUploaded({}); setSkipped([]); setStep("upload"); }}
            onResume={() => setStep(saved!.step)}
          />
        )}
        {step === "upload" && (
          <UploadStep
            lang={lang} uploaded={uploaded} skipped={skipped}
            setUploaded={setUploaded} setSkipped={setSkipped}
            onNext={() => setStep("review-ocr")} onBack={() => setStep("landing")}
          />
        )}
        {step === "review-ocr" && (
          <ReviewOCR lang={lang} onNext={() => setStep("interview")} onBack={() => setStep("upload")} />
        )}
        {step === "interview" && (
          <Interview
            lang={lang} answers={answers} setAnswers={setAnswers}
            onNext={() => setStep("review-all")} onBack={() => setStep("review-ocr")}
          />
        )}
        {step === "review-all" && (
          <ReviewAll lang={lang} onNext={() => { clearSession(); setStep("confirm"); }} onBack={() => setStep("interview")} />
        )}
        {step === "confirm" && <Confirm lang={lang} onRestart={() => { setStep("landing"); }} />}
      </main>
      <Footer lang={lang} />
    </div>
  );
}

// ── Progress stepper ────────────────────────────────────────────────────────

const STEPS: { id: Step; label_en: string; label_es: string }[] = [
  { id: "upload",     label_en: "Documents", label_es: "Documentos" },
  { id: "review-ocr", label_en: "Review",    label_es: "Revisión" },
  { id: "interview",  label_en: "Interview", label_es: "Entrevista" },
  { id: "review-all", label_en: "Confirm",   label_es: "Confirmar" },
  { id: "confirm",    label_en: "Done",      label_es: "Listo" },
];

function TopBar({ step, lang, setLang, onHome }: {
  step: Step; lang: Lang; setLang: (l: Lang) => void; onHome: () => void;
}) {
  const idx = STEPS.findIndex((s) => s.id === step);
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <button onClick={onHome} className="flex items-center gap-2.5 text-left">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary font-bold text-sm tracking-tight text-primary-foreground">
            B
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight text-foreground">binti</div>
            <div className="text-[11px] text-muted-foreground">
              {lang === "en" ? "Adoption Services" : "Servicios de Adopción"}
            </div>
          </div>
        </button>
        {step !== "landing" && step !== "confirm" && (
          <div className="hidden flex-1 px-8 md:block">
            <ol className="flex items-center gap-2">
              {STEPS.map((s, i) => {
                const done = i < idx;
                const active = i === idx;
                return (
                  <li key={s.id} className="flex flex-1 items-center gap-2">
                    <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-semibold transition
                      ${active ? "border-primary bg-primary text-primary-foreground" :
                        done ? "border-success bg-success text-success-foreground" :
                        "border-border bg-card text-muted-foreground"}`}>
                      {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={`text-sm ${active ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                      {lang === "en" ? s.label_en : s.label_es}
                    </span>
                    {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
                  </li>
                );
              })}
            </ol>
          </div>
        )}
        <div className="flex items-center gap-1 rounded-md border border-border bg-card p-1">
          {(["en", "es"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)}
              className={`rounded px-3 py-1 text-xs font-medium transition ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

// ── Landing ─────────────────────────────────────────────────────────────────

function Landing({ lang, setLang, hasSession, onStart, onResume }: {
  lang: Lang; setLang: (l: Lang) => void;
  hasSession: boolean; onStart: () => void; onResume: () => void;
}) {
  const c = t[lang];
  return (
    <section className="pt-8 md:pt-16">
      <div className="grid items-center gap-12 md:grid-cols-[1.15fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
            {c.tagline}
          </div>
          <h1 className="mt-4 whitespace-pre-line text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl">
            {c.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">{c.sub}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {hasSession ? (
              <>
                <button onClick={onResume}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90">
                  <ChevronRight className="h-4 w-4" /> {c.resume}
                </button>
                <button onClick={onStart}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-secondary">
                  {c.start}
                </button>
              </>
            ) : (
              <>
                <button onClick={onStart}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90">
                  <Mic className="h-4 w-4" /> {c.start}
                </button>
                <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-3 text-sm font-medium hover:bg-secondary">
                  {c.learn}
                </button>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> {c.private}</span>
            <span className="inline-flex items-center gap-2"><Mic className="h-4 w-4 text-primary" /> {c.voiceFirst}</span>
            <span className="inline-flex items-center gap-2"><Languages className="h-4 w-4 text-primary" /> {c.multilingual}</span>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-card p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.pickLang}</div>
            <div className="flex gap-2">
              {([
                { id: "en" as const, label: "English", sub: "Voice & text" },
                { id: "es" as const, label: "Español", sub: "Voz y texto" },
              ]).map((o) => (
                <button key={o.id} onClick={() => setLang(o.id)}
                  className={`flex-1 rounded-md border px-4 py-2.5 text-left transition
                    ${lang === o.id ? "border-primary bg-primary/8 text-primary" : "border-border hover:bg-secondary"}`}>
                  <div className="text-sm font-semibold">{o.label}</div>
                  <div className="text-xs text-muted-foreground">{o.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <HeroIllustration lang={lang} />
      </div>

      <div className="mt-20 grid gap-4 md:grid-cols-3">
        <HowCard n="1" icon={<Upload className="h-5 w-5" />} title={c.how1title} body={c.how1body} />
        <HowCard n="2" icon={<FileText className="h-5 w-5" />} title={c.how2title} body={c.how2body} />
        <HowCard n="3" icon={<Mic className="h-5 w-5" />} title={c.how3title} body={c.how3body} />
      </div>
    </section>
  );
}

function HowCard({ n, icon, title, body }: { n: string; icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">{icon}</div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step {n}</span>
      </div>
      <h3 className="mt-4 text-base font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function HeroIllustration({ lang }: { lang: Lang }) {
  const c = t[lang];
  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-lg bg-gradient-to-br from-primary/8 via-background to-primary/4 blur-2xl" />
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">
            {lang === "en" ? "Question 4 of 7" : "Pregunta 4 de 7"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 font-medium text-primary">
            <Volume2 className="h-3 w-3" /> {c.readAloud}
          </span>
        </div>
        <div className="mt-4 rounded-lg bg-secondary p-4">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {lang === "en" ? "We're asking" : "Estamos preguntando"}
          </div>
          <p className="mt-2 text-xl font-bold leading-snug text-foreground">
            {lang === "en"
              ? '"How many people live in your home right now?"'
              : '"¿Cuántas personas viven en tu hogar ahora mismo?"'}
          </p>
        </div>
        <div className="mt-6 flex flex-col items-center">
          <div className="mic-ring relative grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-md">
            <Mic className="h-8 w-8" />
          </div>
          <div className="mt-4 flex h-9 items-end gap-1">
            {[0.5, 0.8, 0.3, 0.9, 0.6, 1, 0.4, 0.7, 0.5].map((h, i) => (
              <span key={i} className="wave-bar block w-1 rounded-full bg-primary/70"
                style={{ height: `${h * 100}%`, animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {lang === "en" ? "Listening… speak whenever you're ready" : "Escuchando… habla cuando estés listo"}
          </p>
          <button className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline">
            <Type className="h-3.5 w-3.5" /> {c.typeInstead}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Upload ───────────────────────────────────────────────────────────────────

function UploadStep({ lang, uploaded, skipped, setUploaded, setSkipped, onNext, onBack }: {
  lang: Lang;
  uploaded: Record<string, boolean>;
  skipped: string[];
  setUploaded: (u: Record<string, boolean>) => void;
  setSkipped: (s: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const c = t[lang];
  const docs = [
    { id: "id",     label: c.docIdLabel,     hint: c.docIdHint,     icon: <User className="h-5 w-5" /> },
    { id: "income", label: c.docIncomeLabel,  hint: c.docIncomeHint, icon: <FileText className="h-5 w-5" /> },
    { id: "school", label: c.docSchoolLabel,  hint: c.docSchoolHint, icon: <Baby className="h-5 w-5" /> },
  ];

  const isReady = docs.every((d) => uploaded[d.id] || skipped.includes(d.id));

  const markUploaded = (id: string) => {
    setUploaded({ ...uploaded, [id]: true });
    setSkipped(skipped.filter((s) => s !== id));
  };

  const markSkipped = (id: string) => {
    setSkipped([...skipped.filter((s) => s !== id), id]);
    const next = { ...uploaded };
    delete next[id];
    setUploaded(next);
  };

  return (
    <StepShell title={c.uploadTitle} subtitle={c.uploadSubtitle}>
      <div className="grid gap-3">
        {docs.map((d) => {
          const isUploaded = !!uploaded[d.id];
          const isSkipped = skipped.includes(d.id);
          return (
            <div key={d.id} className={`flex items-center gap-4 rounded-lg border bg-card p-5 transition
              ${isSkipped ? "border-border opacity-60" : "border-border"}`}>
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary text-primary">{d.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{d.label}</div>
                <div className="text-sm text-muted-foreground">{d.hint}</div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                {isUploaded ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-sm font-medium text-success">
                    <CheckCircle2 className="h-4 w-4" /> {c.uploadUploaded}
                  </span>
                ) : isSkipped ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-muted-foreground">
                    <X className="h-4 w-4" /> {c.uploadSkipped}
                  </span>
                ) : (
                  <button onClick={() => markUploaded(d.id)}
                    className="inline-flex items-center gap-2 rounded-md border border-primary bg-primary/5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10">
                    <Upload className="h-4 w-4" /> {lang === "en" ? "Upload" : "Subir"}
                  </button>
                )}
                {!isUploaded && (
                  <button onClick={() => isSkipped ? markUploaded(d.id) : markSkipped(d.id)}
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline">
                    {isSkipped ? (lang === "en" ? "Upload instead" : "Subir en su lugar") : c.uploadDont}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-lg bg-secondary/60 p-4 text-sm">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="text-muted-foreground">{c.uploadPrivacy}</div>
      </div>

      <NavRow lang={lang} onBack={onBack} onNext={onNext} nextDisabled={!isReady} nextLabel={c.uploadContinue} />
    </StepShell>
  );
}

// ── Review OCR ───────────────────────────────────────────────────────────────

function ReviewOCR({ lang, onNext, onBack }: { lang: Lang; onNext: () => void; onBack: () => void }) {
  const c = t[lang];
  type Conf = "high" | "med" | "low";
  type Field = { key: string; label: string; value: string; conf: Conf; src: string };

  const initial: Field[] = [
    { key: "name",      label: c.fieldName,     value: "María Elena Hernández",             conf: "high", src: lang === "en" ? "Driver's license" : "Licencia de conducir" },
    { key: "dob",       label: c.fieldDob,      value: "March 14, 1989",                    conf: "high", src: lang === "en" ? "Driver's license" : "Licencia de conducir" },
    { key: "ssn",       label: c.fieldSsn,      value: "•••–••–4421",                       conf: "high", src: lang === "en" ? "Pay stub" : "Talón de pago" },
    { key: "address",   label: c.fieldAddress,  value: "248 Linden St, Apt 3B, Oakland CA 94607", conf: "med", src: lang === "en" ? "Driver's license" : "Licencia de conducir" },
    { key: "employer",  label: c.fieldEmployer, value: "Bayview Community Health",          conf: "high", src: lang === "en" ? "Pay stub" : "Talón de pago" },
    { key: "childName", label: c.fieldChildName,value: "Diego Hernández",                   conf: "high", src: lang === "en" ? "School ID" : "ID escolar" },
    { key: "childDob",  label: c.fieldChildDob, value: "Aug 2, 2019",                       conf: "high", src: lang === "en" ? "School ID" : "ID escolar" },
    { key: "school",    label: c.fieldSchool,   value: "Lincoln Elementary",                conf: "low",  src: lang === "en" ? "School ID" : "ID escolar" },
    { key: "grade",     label: c.fieldGrade,    value: "Kindergarten",                      conf: "med",  src: lang === "en" ? "School ID" : "ID escolar" },
  ];

  const [fields, setFields] = useState<Field[]>(initial);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const lowCount = fields.filter((f) => f.conf !== "high").length;

  const startEdit = (f: Field) => {
    setEditingKey(f.key);
    setEditValue(f.value);
  };

  const saveEdit = (key: string) => {
    setFields((fs) => fs.map((f) => f.key === key ? { ...f, value: editValue, conf: "high" } : f));
    setEditingKey(null);
  };

  return (
    <StepShell title={c.ocrTitle} subtitle={c.ocrSubtitle}>
      {lowCount > 0 && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-warning-foreground" />
          <div>
            <div className="font-semibold">
              {lowCount} {lowCount === 1 ? c.ocrNeedLook_one : c.ocrNeedLook_other}
            </div>
            <div className="text-sm text-muted-foreground">{c.ocrInstruction}</div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {fields.map((f, i) => (
          <div key={f.key} className={`gap-4 p-4 ${i > 0 ? "border-t border-border" : ""}`}>
            {editingKey === f.key ? (
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">{f.label} · {f.src}</div>
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveEdit(f.key); if (e.key === "Escape") setEditingKey(null); }}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button onClick={() => saveEdit(f.key)}
                  className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
                  {c.ocrSave}
                </button>
                <button onClick={() => setEditingKey(null)}
                  className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium">
                  {c.ocrCancel}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">{f.label} · {lang === "en" ? "from" : "de"} {f.src}</div>
                  <div className="mt-0.5 font-medium">{f.value}</div>
                  {f.key === "ssn" && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" /> {c.ocrSsnNote}
                    </div>
                  )}
                </div>
                <ConfChip conf={f.conf} lang={lang} />
                <button onClick={() => startEdit(f)} className="text-sm font-medium text-primary hover:underline"
                  aria-label={`${c.ocrEdit} ${f.label}`}>
                  {c.ocrEdit}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <NavRow lang={lang} onBack={onBack} onNext={onNext} nextLabel={c.ocrContinue} />
    </StepShell>
  );
}

function ConfChip({ conf, lang }: { conf: "high" | "med" | "low"; lang: Lang }) {
  const c = t[lang];
  if (conf === "high") return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success">
      <CheckCircle2 className="h-3.5 w-3.5" /> {c.ocrConfident}
    </span>
  );
  if (conf === "med") return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-warning/20 px-2.5 py-1 text-xs font-medium text-warning-foreground">
      <AlertTriangle className="h-3.5 w-3.5" /> {c.ocrDoubleCheck}
    </span>
  );
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-medium text-destructive">
      <AlertTriangle className="h-3.5 w-3.5" /> {c.ocrReview}
    </span>
  );
}

// ── Interview ────────────────────────────────────────────────────────────────

type TopicPhase = "idle" | "listening" | "extracted" | "followup";

interface TopicField {
  id: string;
  label_en: string;
  label_es: string;
  value: string;
  required: boolean;
  followup_en?: string;
  followup_es?: string;
}

interface Topic {
  id: string;
  q_en: string;
  q_es: string;
  section_en: string;
  section_es: string;
  guidance_en: string[];
  guidance_es: string[];
  voiceSample_en: string;
  voiceSample_es: string;
  fields: TopicField[];
}

const TOPICS: Topic[] = [
  {
    id: "contact",
    q_en: "What's the best way to reach you?",
    q_es: "¿Cuál es la mejor forma de contactarte?",
    section_en: "About you", section_es: "Sobre ti",
    guidance_en: ["Your phone number", "Your email address (if you have one)"],
    guidance_es: ["Tu número de teléfono", "Tu correo electrónico (si tienes uno)"],
    voiceSample_en: "My number is 510-555-0142 and my email is maria.hernandez@email.com",
    voiceSample_es: "Mi número es 510-555-0142 y mi correo es maria.hernandez@email.com",
    fields: [
      { id: "phone", label_en: "Phone",  label_es: "Teléfono",          value: "(510) 555-0142",            required: true },
      { id: "email", label_en: "Email",  label_es: "Correo electrónico", value: "maria.hernandez@email.com", required: false },
    ],
  },
  {
    id: "household",
    q_en: "Tell me about your household.",
    q_es: "Cuéntame sobre tu hogar.",
    section_en: "About you", section_es: "Sobre ti",
    guidance_en: [
      "How many people live with you, and how old are they?",
      "Do you rent, own, or stay with family?",
      "About what is your yearly household income?",
    ],
    guidance_es: [
      "¿Cuántas personas viven contigo y qué edades tienen?",
      "¿Alquilas, eres propietario/a o vives con familia?",
      "¿Cuánto es aproximadamente el ingreso anual de tu hogar?",
    ],
    voiceSample_en: "There are four of us — me, my husband, Diego, and my mother-in-law. We rent. I make about 42,000 a year.",
    voiceSample_es: "Somos cuatro — mi esposo, Diego, mi suegra y yo. Rentamos. Gano como 42,000 al año.",
    fields: [
      { id: "household_size", label_en: "People in household", label_es: "Personas en el hogar", value: "4",    required: true },
      { id: "housing",        label_en: "Housing type",        label_es: "Tipo de vivienda",     value: "Rent", required: true },
      { id: "income",         label_en: "Household income",    label_es: "Ingresos del hogar",   value: "",     required: true,
        followup_en: "What is your approximate yearly household income?",
        followup_es: "¿Cuál es el ingreso anual aproximado de tu hogar?" },
    ],
  },
  {
    id: "child",
    q_en: "Tell me about your relationship to Diego and his health.",
    q_es: "Cuéntame sobre tu relación con Diego y su salud.",
    section_en: "About Diego", section_es: "Sobre Diego",
    guidance_en: [
      "Your relationship to the child",
      "Any medical conditions or special needs",
      "Current medications or therapies",
    ],
    guidance_es: [
      "Tu relación con el niño",
      "Condiciones médicas o necesidades especiales",
      "Medicamentos actuales o terapias",
    ],
    voiceSample_en: "I'm his mother. He has mild asthma — uses an inhaler before exercise. No other conditions.",
    voiceSample_es: "Soy su mamá. Tiene asma leve — usa un inhalador antes de hacer ejercicio. Sin otras condiciones.",
    fields: [
      { id: "relationship", label_en: "Relationship to child",   label_es: "Relación con el niño",          value: "Mother",                                       required: true },
      { id: "medical",      label_en: "Health & special needs",  label_es: "Salud y necesidades especiales", value: "Mild asthma, uses an inhaler before exercise", required: false },
    ],
  },
];

function Interview({ lang, answers, setAnswers, onNext, onBack }: {
  lang: Lang;
  answers: Record<string, string>;
  setAnswers: (a: Record<string, string>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const c = t[lang];
  const [topicIdx, setTopicIdx] = useState(0);
  const [phase, setPhase] = useState<TopicPhase>("idle");
  const [useText, setUseText] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");
  const [followupIdx, setFollowupIdx] = useState(0);
  const [followupVal, setFollowupVal] = useState("");

  const topic = TOPICS[topicIdx];
  const total = TOPICS.length;
  const q = lang === "en" ? topic.q_en : topic.q_es;
  const guidance = lang === "en" ? topic.guidance_en : topic.guidance_es;
  const section = lang === "en" ? topic.section_en : topic.section_es;

  const getMissing = (vals: Record<string, string>) =>
    topic.fields.filter((f) => f.required && !vals[f.id]);

  const initExtraction = () => {
    const vals: Record<string, string> = {};
    for (const f of topic.fields) vals[f.id] = f.value;
    setFieldValues(vals);
    setPhase("extracted");
  };

  const handleConfirm = () => {
    const missing = getMissing(fieldValues);
    if (missing.length > 0) {
      setFollowupIdx(0);
      setFollowupVal("");
      setPhase("followup");
    } else {
      persist(fieldValues);
    }
  };

  const handleFollowupSave = () => {
    const missing = getMissing(fieldValues);
    const field = missing[followupIdx];
    const updated = { ...fieldValues, [field.id]: followupVal };
    setFieldValues(updated);
    if (getMissing(updated).length > 0) {
      setFollowupIdx(followupIdx + 1);
      setFollowupVal("");
    } else {
      persist(updated);
    }
  };

  const persist = (vals: Record<string, string>) => {
    const next = { ...answers };
    for (const [k, v] of Object.entries(vals)) { if (v) next[k] = v; }
    setAnswers(next);
    if (topicIdx < total - 1) {
      setTopicIdx(topicIdx + 1);
      setPhase("idle");
      setFieldValues({});
      setUseText(false);
      setTextInput("");
    } else {
      onNext();
    }
  };

  return (
    <StepShell title={c.interviewTitle} subtitle={c.interviewSubtitle}>
      {/* Progress */}
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-semibold text-foreground">{section}</span>
        <span className="text-muted-foreground">
          {topicIdx + 1} {c.answeredOf} {total}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${((topicIdx + (phase === "idle" ? 0.1 : 0.7)) / total) * 100}%` }} />
      </div>

      {/* ── Prompt + mic/text (idle + listening) ── */}
      {(phase === "idle" || phase === "listening") && (
        <div className="mt-5 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Volume2 className="h-3.5 w-3.5" />
            <button className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 hover:bg-muted">
              <Play className="h-3 w-3" /> {c.readAloud}
            </button>
          </div>
          <p className="mt-3 text-xl font-bold leading-snug text-foreground md:text-2xl">{q}</p>

          {/* Guidance hints */}
          <div className="mt-4 rounded-lg bg-secondary/60 p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {lang === "en" ? "Things to mention" : "Cosas a mencionar"}
            </div>
            <ul className="space-y-1.5">
              {guidance.map((hint, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                  <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {hint}
                </li>
              ))}
            </ul>
          </div>

          {/* Voice input */}
          {!useText && (
            <div className="mt-6 flex flex-col items-center" aria-live="polite" aria-atomic="true">
              {phase === "idle" ? (
                <>
                  <button onClick={() => setPhase("listening")}
                    aria-label={lang === "en" ? "Start speaking" : "Empezar a hablar"}
                    className="relative grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-md transition hover:opacity-90">
                    <Mic className="h-8 w-8" />
                  </button>
                  <p className="mt-3 text-sm font-medium text-foreground">
                    {lang === "en" ? "Tap to speak" : "Toca para hablar"}
                  </p>
                </>
              ) : (
                <>
                  <button onClick={initExtraction}
                    aria-label={lang === "en" ? "Stop recording" : "Detener grabación"}
                    className="mic-ring relative grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-md">
                    <Pause className="h-8 w-8" />
                  </button>
                  <div className="mt-4 flex h-8 items-end gap-1">
                    {[0.5, 0.8, 0.3, 0.9, 0.6, 1, 0.4, 0.7, 0.5, 0.8, 0.4].map((h, k) => (
                      <span key={k} className="wave-bar block w-1.5 rounded-full bg-primary/70"
                        style={{ height: `${h * 100}%`, animationDelay: `${k * 0.08}s` }} />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{c.listeningPrompt}</p>
                  <button onClick={initExtraction} className="mt-2 text-sm font-medium text-primary hover:underline">
                    {c.doneSpeaking}
                  </button>
                </>
              )}
              <button onClick={() => setUseText(true)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <Type className="h-3.5 w-3.5" /> {c.typeInstead}
              </button>
            </div>
          )}

          {/* Text fallback */}
          {useText && (
            <div className="mt-5">
              <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)}
                rows={3} autoFocus
                placeholder={lang === "en" ? "Type your answer here…" : "Escribe tu respuesta aquí…"}
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <div className="mt-2 flex items-center justify-between">
                <button onClick={() => { setUseText(false); setPhase("idle"); }}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <Mic className="h-3.5 w-3.5" /> {c.useVoice}
                </button>
                <button onClick={() => { if (textInput.trim()) initExtraction(); }} disabled={!textInput.trim()}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40">
                  {lang === "en" ? "Continue" : "Continuar"} <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Extracted fields ── */}
      {phase === "extracted" && (
        <div className="mt-5 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <CheckCircle2 className="h-4 w-4 text-success" />
            {lang === "en" ? "Here's what I understood" : "Esto es lo que entendí"}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {lang === "en" ? "Edit anything that doesn't look right." : "Edita lo que no se vea bien."}
          </p>

          <div className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border">
            {topic.fields.map((f) => {
              const val = fieldValues[f.id];
              const label = lang === "en" ? f.label_en : f.label_es;
              const isMissing = f.required && !val;
              return (
                <div key={f.id} className="flex items-center gap-3 px-4 py-3">
                  {editingId === f.id ? (
                    <>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">{label}</div>
                        <input autoFocus value={editVal} onChange={(e) => setEditVal(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") { setFieldValues({ ...fieldValues, [f.id]: editVal }); setEditingId(null); }
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <button onClick={() => { setFieldValues({ ...fieldValues, [f.id]: editVal }); setEditingId(null); }}
                        className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                        {c.ocrSave}
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-xs text-muted-foreground hover:text-foreground">
                        {c.ocrCancel}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground">{label}</div>
                        {val
                          ? <div className="mt-0.5 text-sm font-medium">{val}</div>
                          : <div className="mt-0.5 text-sm italic text-muted-foreground">
                              {lang === "en" ? "Not found" : "No encontrado"}
                              {f.required && <span className="ml-1 text-destructive">
                                · {lang === "en" ? "required" : "requerido"}
                              </span>}
                            </div>
                        }
                      </div>
                      {isMissing
                        ? <span className="shrink-0 text-xs font-medium text-destructive">
                            {lang === "en" ? "Missing" : "Falta"}
                          </span>
                        : <button onClick={() => { setEditingId(f.id); setEditVal(val); }}
                            className="shrink-0 text-xs font-medium text-primary hover:underline">
                            {c.ocrEdit}
                          </button>
                      }
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={handleConfirm}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
              <CheckCircle2 className="h-4 w-4" />
              {lang === "en" ? "That looks right" : "Eso está bien"}
            </button>
            <button onClick={() => { setPhase("listening"); setUseText(false); }}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium">
              {c.tryAgain}
            </button>
          </div>
        </div>
      )}

      {/* ── Follow-up for missing required fields ── */}
      {phase === "followup" && (() => {
        const missing = getMissing(fieldValues);
        const field = missing[followupIdx];
        if (!field) return null;
        const fq = lang === "en"
          ? (field.followup_en ?? `What is your ${field.label_en.toLowerCase()}?`)
          : (field.followup_es ?? `¿Cuál es tu ${field.label_es.toLowerCase()}?`);
        return (
          <div className="mt-5 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-warning-foreground">
              <AlertTriangle className="h-3.5 w-3.5" />
              {lang === "en" ? "One more thing" : "Solo una cosa más"}
              {missing.length > 1 && (
                <span className="font-normal text-muted-foreground">
                  ({followupIdx + 1} {lang === "en" ? "of" : "de"} {missing.length})
                </span>
              )}
            </div>
            <p className="mt-3 text-lg font-bold leading-snug text-foreground">{fq}</p>
            <input autoFocus type="text" value={followupVal} onChange={(e) => setFollowupVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && followupVal.trim()) handleFollowupSave(); }}
              placeholder={lang === "en" ? "Type your answer…" : "Escribe tu respuesta…"}
              className="mt-4 w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <div className="mt-3 flex items-center gap-3">
              <button onClick={handleFollowupSave} disabled={!followupVal.trim()}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-40">
                {c.saveContinue} <ChevronRight className="h-4 w-4" />
              </button>
              <button onClick={() => persist(fieldValues)}
                className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                {c.skip}
              </button>
            </div>
          </div>
        );
      })()}

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={topicIdx === 0 ? onBack : () => { setTopicIdx(topicIdx - 1); setPhase("idle"); setFieldValues({}); }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> {c.back}
        </button>
        {phase === "idle" && (
          <button onClick={() => persist({})}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            {c.skip} <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </StepShell>
  );
}

function StructuredInput({ type, placeholder, lang, onSave, prefix, inputId }: {
  type: "tel" | "email" | "number" | "text";
  placeholder?: string;
  lang: Lang;
  onSave: (v: string) => void;
  prefix?: string;
  inputId?: string;
}) {
  const c = t[lang];
  const [val, setVal] = useState("");
  const id = inputId ?? `structured-input-${type}`;
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {lang === "en" ? "Your answer" : "Tu respuesta"}
      </label>
      <div className="flex items-center gap-2">
        {prefix && (
          <span className="rounded-md border border-input bg-secondary px-3 py-2.5 text-sm font-medium text-muted-foreground"
            aria-hidden="true">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={placeholder}
          autoFocus
          className="flex-1 rounded-md border border-input bg-background px-4 py-2.5 text-base outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          onKeyDown={(e) => { if (e.key === "Enter" && val.trim()) onSave(val.trim()); }}
        />
      </div>
      <div className="mt-3 flex justify-end">
        <button onClick={() => { if (val.trim()) onSave(val.trim()); }} disabled={!val.trim()}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40">
          {c.saveContinue} <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SelectInput({ options, lang, onSave }: {
  options: { label_en: string; label_es: string; value: string }[];
  lang: Lang;
  onSave: (v: string) => void;
}) {
  const c = t[lang];
  const [selected, setSelected] = useState("");
  return (
    <div>
      <div className="grid gap-2" role="radiogroup">
        {options.map((o) => (
          <button key={o.value} onClick={() => setSelected(o.value)}
            role="radio" aria-checked={selected === o.value}
            className={`flex min-h-[44px] items-center gap-3 rounded-md border px-4 py-3 text-left text-sm font-medium transition
              ${selected === o.value ? "border-primary bg-primary/8 text-primary" : "border-border bg-background hover:bg-secondary"}`}>
            <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border transition
              ${selected === o.value ? "border-primary bg-primary" : "border-border"}`}
              aria-hidden="true">
              {selected === o.value && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            {lang === "en" ? o.label_en : o.label_es}
          </button>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button onClick={() => { if (selected) onSave(selected); }} disabled={!selected}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40">
          {c.saveContinue} <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ── Review All ───────────────────────────────────────────────────────────────

function ReviewAll({ lang, onNext, onBack }: { lang: Lang; onNext: () => void; onBack: () => void }) {
  const c = t[lang];
  const sections = [
    {
      title: c.sectionApplicant,
      icon: <User className="h-4 w-4" />,
      rows: [
        [c.fieldName,          "María Elena Hernández",                  "doc"],
        [c.fieldDob,           "March 14, 1989",                         "doc"],
        [c.fieldSsn,           "•••–••–4421",                            "doc"],
        [c.fieldAddress,       "248 Linden St, Apt 3B, Oakland CA 94607","doc"],
        [c.fieldPhone,         "(510) 555-0142",                         "voice"],
        [c.fieldEmail,         "maria.hernandez@email.com",              "voice"],
        [c.fieldEmployer,      "Bayview Community Health",               "doc"],
        [c.fieldIncome,        lang === "en" ? "About $42,000 / year" : "Aprox. $42,000 / año", "voice"],
        [c.fieldHousing,       lang === "en" ? "Rent" : "Alquilo",       "voice"],
        [c.fieldHouseholdSize, "4",                                      "voice"],
      ],
    },
    {
      title: `${c.sectionChild} Diego`,
      icon: <Baby className="h-4 w-4" />,
      rows: [
        [c.fieldChildName,  "Diego Hernández",                                    "doc"],
        [c.fieldChildDob,   "Aug 2, 2019",                                        "doc"],
        [c.fieldSchool,     "Lincoln Elementary",                                 "doc"],
        [c.fieldGrade,      "Kindergarten",                                       "doc"],
        [c.fieldRelationship, lang === "en" ? "Mother" : "Madre",                "voice"],
        [c.fieldMedical,    lang === "en" ? "Mild asthma, uses an inhaler" : "Asma leve, usa un inhalador", "voice"],
      ],
    },
    {
      title: c.sectionEmergency,
      icon: <Phone className="h-4 w-4" />,
      rows: [
        [c.fieldEmergencyName, lang === "en" ? "Add a contact" : "Agregar contacto", "missing"],
      ],
    },
  ] as const;

  return (
    <StepShell title={c.reviewTitle} subtitle={c.reviewSubtitle}>
      <div className="space-y-5">
        {sections.map((s) => (
          <div key={s.title} className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-5 py-3">
              <div className="inline-flex items-center gap-2 font-semibold">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary">{s.icon}</span>
                {s.title}
              </div>
              <button className="text-sm font-medium text-primary hover:underline">{c.editSection}</button>
            </div>
            <dl>
              {s.rows.map(([k, v, src], idx) => (
                <div key={k} className={`flex items-start justify-between gap-4 px-5 py-3.5 ${idx > 0 ? "border-t border-border" : ""}`}>
                  <dt className="w-1/3 text-sm text-muted-foreground">{k}</dt>
                  <dd className="flex-1 font-medium">{v}</dd>
                  <SrcBadge src={src as "doc" | "voice" | "missing"} lang={lang} />
                </div>
              ))}
            </dl>
          </div>
        ))}

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="inline-flex items-center gap-2 font-semibold">
            <FileCheck className="h-4 w-4 text-primary" /> {c.signTitle}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{c.signBody}</p>
          <input
            placeholder={c.signPlaceholder}
            className="mt-3 w-full rounded-md border border-input bg-background px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <NavRow lang={lang} onBack={onBack} onNext={onNext} nextLabel={c.submit} />
    </StepShell>
  );
}

function SrcBadge({ src, lang }: { src: "doc" | "voice" | "missing"; lang: Lang }) {
  const c = t[lang];
  if (src === "doc") return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      <FileText className="h-3 w-3" /> {c.fromDoc}
    </span>
  );
  if (src === "voice") return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
      <Mic className="h-3 w-3" /> {c.saidAloud}
    </span>
  );
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-medium text-destructive">
      <AlertTriangle className="h-3 w-3" /> {c.needed}
    </span>
  );
}

// ── Confirm ──────────────────────────────────────────────────────────────────

function Confirm({ lang, onRestart }: { lang: Lang; onRestart: () => void }) {
  const c = t[lang];
  const nextSteps = [
    { label: c.confirmStep1, sub: c.confirmStep1sub },
    { label: c.confirmStep2, sub: c.confirmStep2sub },
    { label: c.confirmStep3, sub: c.confirmStep3sub },
  ];
  return (
    <section className="pt-10">
      <div className="mx-auto max-w-2xl space-y-5">
        {/* Success card */}
        <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight">{c.confirmTitle}</h2>
          <p className="mt-2 text-muted-foreground">{c.confirmSubtitle}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm">
            <span className="text-muted-foreground">{c.confirmNum}</span>
            <span className="font-mono font-semibold">BNT-2026-04821</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {c.confirmBody}{" "}
            <span className="font-medium text-foreground">maria.hernandez@email.com</span>.
          </p>

          <div className="mt-6 grid gap-3 text-left sm:grid-cols-3">
            {[
              { label: c.confirmDocs,  value: lang === "en" ? "3 uploaded" : "3 subidos" },
              { label: c.confirmVoice, value: lang === "en" ? "1 recorded" : "1 grabada" },
              { label: c.confirmTime,  value: "11 min" },
            ].map((x) => (
              <div key={x.label} className="rounded-lg border border-border bg-background p-3">
                <div className="text-xs text-muted-foreground">{x.label}</div>
                <div className="font-semibold">{x.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* What happens next */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-bold text-foreground">{c.confirmNext}</h3>
          <ol className="mt-4 space-y-4">
            {nextSteps.map((s, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <div className="font-semibold text-foreground">{s.label}</div>
                  <div className="text-sm text-muted-foreground">{s.sub}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="text-center">
          <button onClick={onRestart} className="text-sm font-medium text-primary hover:underline">
            {c.startNew}
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Shared ────────────────────────────────────────────────────────────────────

function StepShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="pt-6">
      <h2 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function NavRow({ lang, onBack, onNext, nextLabel, nextDisabled }: {
  lang: Lang; onBack: () => void; onNext: () => void; nextLabel: string; nextDisabled?: boolean;
}) {
  const c = t[lang];
  return (
    <div className="mt-6 flex items-center justify-between">
      <button onClick={onBack}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary">
        <ChevronLeft className="h-4 w-4" /> {c.back}
      </button>
      <button onClick={onNext} disabled={nextDisabled}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-40">
        {nextLabel} <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-5 py-6 text-sm text-muted-foreground md:flex-row md:items-center">
        <div>© {new Date().getFullYear()} Binti · {lang === "en" ? "Adoption Services" : "Servicios de Adopción"}</div>
        <div className="flex gap-5">
          <a className="hover:text-foreground">{lang === "en" ? "Privacy" : "Privacidad"}</a>
          <a className="hover:text-foreground">{lang === "en" ? "Accessibility" : "Accesibilidad"}</a>
          <a className="hover:text-foreground">{lang === "en" ? "Get help" : "Obtener ayuda"}</a>
        </div>
      </div>
    </footer>
  );
}
