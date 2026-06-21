import { createServerFn } from "@tanstack/react-start";
import Anthropic from "@anthropic-ai/sdk";

export interface ExtractInput {
  transcript: string;
  topicId: string;
  lang: string;
}

export interface ExtractResult {
  fields: Record<string, string>;
  error?: string;
}

const TOPIC_SCHEMAS: Record<string, { fields: string; instructions: string }> = {
  contact: {
    fields: `{ "phone": string | null, "email": string | null }`,
    instructions: `Extract the speaker's phone number and email address.
- phone: digits only format is fine, normalize to (XXX) XXX-XXXX if possible
- email: exact email address as spoken, null if not mentioned`,
  },
  household: {
    fields: `{ "household_size": string | null, "housing": string | null, "income": string | null }`,
    instructions: `Extract household information.
- household_size: TOTAL number of people living in the home as a digit string (e.g. "4").
  Use the stated total — do NOT count from ages or individual people mentioned.
  "family of four" → "4". Ignore ages like "my sister is 19" — 19 is an age, not the household size.
- housing: one of "Rent", "Own", or "Staying with family or friends". "we own the place" → "Own".
- income: annual household income as a plain number string in dollars (e.g. "200000" for "200k", "42000" for "about 42,000 a year").
  Convert shorthand: Xk = X*1000, "X thousand" = X*1000. Return null only if income is never mentioned.`,
  },
  child: {
    fields: `{ "relationship": string | null, "medical": string | null }`,
    instructions: `Extract information about the child.
- relationship: the speaker's role relative to the child. The speaker may phrase it from either direction:
  "Diego is my foster son" → "Foster parent"
  "I'm his mother" → "Mother"
  "my son" → "Parent"
  "my foster daughter" → "Foster parent"
  "I'm his legal guardian" → "Legal guardian"
  Use the most specific label possible (Foster parent, Mother, Father, Aunt, Uncle, Grandmother, Legal guardian, etc.)
- medical: a concise summary of ALL medical conditions, diagnoses, medications, and therapies mentioned.
  Include medication names (e.g. "Zoloft", "inhaler for asthma"). Separate items with semicolons.
  Use "None" only if the speaker explicitly says no conditions. Do not return null if conditions are mentioned.`,
  },
};

export const extractFields = createServerFn({ method: "POST" })
  .validator((data: ExtractInput) => data)
  .handler(async ({ data }): Promise<ExtractResult> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
      return { fields: {}, error: "ANTHROPIC_API_KEY not configured" };
    }

    const schema = TOPIC_SCHEMAS[data.topicId];
    if (!schema) return { fields: {}, error: `Unknown topic: ${data.topicId}` };

    const client = new Anthropic({ apiKey });

    const systemPrompt = `You are a field extraction assistant for an adoption application form.
Extract structured data from a spoken transcript. Return ONLY valid JSON matching the schema — no markdown, no explanation.
If a field is not mentioned or unclear, return null for that field.
${schema.instructions}

Return JSON matching exactly: ${schema.fields}`;

    try {
      const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 256,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Language: ${data.lang === "es" ? "Spanish" : "English"}\nTranscript: "${data.transcript}"`,
          },
        ],
      });

      const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
      const parsed = JSON.parse(text) as Record<string, string | null>;

      // Convert nulls to empty strings for the UI
      const fields: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed)) {
        fields[k] = v ?? "";
      }

      return { fields };
    } catch (err) {
      console.error("Field extraction error:", err);
      return { fields: {}, error: String(err) };
    }
  });
