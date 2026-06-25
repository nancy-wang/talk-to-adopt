import { createServerFn } from "@tanstack/react-start";
import Anthropic from "@anthropic-ai/sdk";
import type { FormSchema } from "./form-schema";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResult {
  reply: string;
  updatedSchema: FormSchema | null;
  error?: string;
}

export const formBuilderChat = createServerFn({ method: "POST" })
  .validator(
    (data: {
      messages: ChatMessage[];
      currentSchema: FormSchema;
    }) => data,
  )
  .handler(async ({ data }): Promise<ChatResult> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
      return {
        reply:
          "AI is not configured. Set the ANTHROPIC_API_KEY environment variable to enable chat-based form editing.",
        updatedSchema: null,
        error: "ANTHROPIC_API_KEY not configured",
      };
    }

    const client = new Anthropic({ apiKey });

    const systemPrompt = `You are a form builder assistant helping case workers and program admins create government benefit application forms. You are currently working on a form for the NYC Housing Connect affordable housing lottery.

Your job:
1. Understand the user's request about modifying the application form.
2. Make the requested changes to the form schema.
3. Explain what you changed in a brief, friendly reply.

CURRENT FORM SCHEMA:
\`\`\`json
${JSON.stringify(data.currentSchema, null, 2)}
\`\`\`

RULES:
- Every field needs a unique id (lowercase_snake_case).
- Every section needs a unique id.
- Supported field types: text, number, email, tel, date, select, radio, checkbox, textarea, currency.
- For select/radio/checkbox fields, provide options as [{label, value}].
- Conditional fields use a "condition" object: {fieldId, op, value?} where op is one of: eq, neq, gt, lt, contains, filled.
- Keep the form applicant-friendly: clear labels, helpful descriptions, logical ordering.
- When adding questions, think about where they logically belong (which section) and whether they should be conditional.
- If the user describes an eligibility rule, translate it into appropriate form fields and conditional logic.
- Don't remove the standard fields (name, DOB, contact, address, household, income) unless explicitly asked.
- The status field should stay as-is unless the user asks to change it.

RESPONSE FORMAT:
You MUST respond with valid JSON in exactly this format (no markdown fences, no extra text):
{
  "reply": "Your conversational response explaining what you did",
  "schema": <the complete updated FormSchema object, or null if no changes were made>
}

If the user is just asking a question or chatting (not requesting a form change), set schema to null and just reply conversationally.`;

    try {
      const message = await client.messages.create({
        model: "claude-sonnet-4-5-20241022",
        max_tokens: 8192,
        system: systemPrompt,
        messages: data.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const text =
        message.content[0].type === "text" ? message.content[0].text.trim() : "";

      try {
        const parsed = JSON.parse(text) as {
          reply: string;
          schema: FormSchema | null;
        };
        return {
          reply: parsed.reply,
          updatedSchema: parsed.schema,
        };
      } catch {
        return {
          reply: text,
          updatedSchema: null,
        };
      }
    } catch (err) {
      console.error("Form builder chat error:", err);
      return {
        reply: "Something went wrong. Please try again.",
        updatedSchema: null,
        error: String(err),
      };
    }
  });
