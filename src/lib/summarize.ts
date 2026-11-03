import OpenAI from "openai";
import { hostnameOf } from "./outlets";
import type { SearchResult } from "./search-provider";

export type Summarizer = (subject: string, label: string, results: SearchResult[]) => Promise<string>;

const DEFAULT_MODEL = "gpt-4.1-mini";

const SYSTEM_PROMPT = `You summarize web search results. You will get a subject (a celebrity, band, or TV show), a topic, and a list of search results from selected news outlets, each with the outlet, title, snippet, and link.

Rules:
- Use only the results given. Do not add outside knowledge.
- Write 2 to 4 plain sentences. No bullet points, no headings.
- Attribute every claim to its outlet, for example "According to Reuters, ...".
- Describe allegations as allegations. Never state that the subject did something unless a result says it was proven or admitted.
- If the results contain no substantive reporting that connects the subject to the topic, say exactly that in one sentence and nothing else.`;

export function buildUserPrompt(subject: string, label: string, results: SearchResult[]): string {
  const lines = results.map(
    (r, i) => `${i + 1}. Outlet: ${hostnameOf(r.link) ?? "unknown"}\n   Title: ${r.title}\n   Snippet: ${r.snippet}\n   Link: ${r.link}`
  );
  return `Subject: ${subject}\nTopic: ${label}\n\nResults:\n${lines.join("\n")}`;
}

export const openaiSummarize: Summarizer = async (subject, label, results) => {
  if (!process.env.OPENAI_API_KEY) throw new Error("Missing required environment variable OPENAI_API_KEY");
  if (results.length === 0) return "No results from the listed outlets.";

  const client = new OpenAI();
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? DEFAULT_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(subject, label, results) },
    ],
  });
  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("OpenAI returned an empty summary");
  return text;
};
