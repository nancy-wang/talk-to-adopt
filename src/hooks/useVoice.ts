import { useState, useRef, useCallback } from "react";

// Web Speech API — not yet in TypeScript's standard DOM lib
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: { readonly transcript: string; readonly confidence: number };
}
interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((ev: Event) => void) | null;
  onend: ((ev: Event) => void) | null;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

export type VoiceStatus = "idle" | "listening" | "error";

interface UseVoiceReturn {
  transcript: string;
  interimTranscript: string;
  status: VoiceStatus;
  errorMsg: string;
  supported: boolean;
  start: (lang: string) => void;
  stop: () => void;
  reset: () => void;
}

export function useVoice(): UseVoiceReturn {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const getCtor = (): SpeechRecognitionCtor | null =>
    typeof window !== "undefined"
      ? (window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null)
      : null;

  const supported = !!getCtor();

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setStatus("idle");
    setInterimTranscript("");
  }, []);

  const start = useCallback(
    (lang: string) => {
      const Ctor = getCtor();
      if (!Ctor) {
        setErrorMsg(
          "Speech recognition is not supported in this browser. Please type your answer.",
        );
        setStatus("error");
        return;
      }

      stop();
      setTranscript("");
      setInterimTranscript("");
      setErrorMsg("");

      const recognition = new Ctor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang === "es" ? "es-US" : "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setStatus("listening");

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalPart = "";
        let interimPart = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalPart += result[0].transcript;
          } else {
            interimPart += result[0].transcript;
          }
        }
        if (finalPart) {
          setTranscript((prev) => (prev ? `${prev} ${finalPart}` : finalPart).trim());
        }
        setInterimTranscript(interimPart);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === "no-speech" || event.error === "aborted") return;
        setErrorMsg(
          event.error === "not-allowed"
            ? "Microphone access was denied. Please allow microphone access and try again."
            : `Speech recognition error: ${event.error}`,
        );
        setStatus("error");
      };

      recognition.onend = () => {
        setStatus("idle");
        setInterimTranscript("");
      };

      recognitionRef.current = recognition;
      recognition.start();
    },
    [stop],
  );

  const reset = useCallback(() => {
    stop();
    setTranscript("");
    setInterimTranscript("");
    setErrorMsg("");
    setStatus("idle");
  }, [stop]);

  return { transcript, interimTranscript, status, errorMsg, supported, start, stop, reset };
}

export function speak(text: string, lang: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === "es" ? "es-US" : "en-US";
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
