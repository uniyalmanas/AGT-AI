/**
 * Unified AI caller — supports both Claude (Anthropic) and Gemini (Google)
 * via the NEXT_PUBLIC_AI_PROVIDER env switch.
 *
 *   NEXT_PUBLIC_AI_PROVIDER=claude   ANTHROPIC_API_KEY=sk-ant-...
 *   NEXT_PUBLIC_AI_PROVIDER=gemini   GEMINI_API_KEY=...
 *
 * Every GST route in this app sends a system prompt + a single user message and
 * expects a strict JSON object back. `completeJSON` handles provider routing,
 * strips any stray markdown fences, and returns clean text ready for JSON.parse.
 */
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type AIProvider = "claude" | "gemini";

// Default models per provider (override per-call if needed).
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export function activeProvider(): AIProvider {
  return process.env.NEXT_PUBLIC_AI_PROVIDER === "gemini" ? "gemini" : "claude";
}

export interface CompleteOptions {
  system: string;
  user: string;
  maxTokens?: number;
  /** Force a specific provider for this call; defaults to the env-configured one. */
  provider?: AIProvider;
}

function stripFences(text: string): string {
  return text.replace(/```json|```/g, "").trim();
}

async function completeClaude(opts: CompleteOptions): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const client = new Anthropic({ apiKey });
  const message = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: opts.maxTokens ?? 1500,
    system: opts.system,
    messages: [{ role: "user", content: opts.user }],
  });

  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  return stripFences(text);
}

async function completeGemini(opts: CompleteOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: opts.system,
    generationConfig: {
      maxOutputTokens: opts.maxTokens ?? 1500,
      // Ask Gemini for raw JSON so we don't have to unwrap prose/fences.
      responseMimeType: "application/json",
      // Gemini 2.5 models "think" by default, which silently eats the output
      // token budget and truncates the JSON. We want fast structured extraction,
      // not reasoning — so disable thinking. (Field not in this SDK's types yet.)
      thinkingConfig: { thinkingBudget: 0 },
    } as Record<string, unknown>,
  });

  const result = await model.generateContent(opts.user);
  return stripFences(result.response.text());
}

/**
 * Run a system+user prompt against the configured provider and return cleaned
 * text. Callers JSON.parse the result (keeping parse errors in the route).
 */
export async function completeJSON(opts: CompleteOptions): Promise<string> {
  const provider = opts.provider ?? activeProvider();
  return provider === "gemini" ? completeGemini(opts) : completeClaude(opts);
}
