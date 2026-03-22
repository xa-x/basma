import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// POST /api/chat - Chat with AI about brand
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: `You are a helpful brand consultant for بصمة (Basma), an AI branding platform.
    You help users refine their brand identity, answer questions about design,
    and provide suggestions for logos, colors, and packaging.
    
    Guidelines:
    - Be concise and actionable
    - Mix Arabic and English naturally
    - Focus on the Saudi/Middle Eastern market
    - Provide specific examples when helpful
    - Ask clarifying questions when needed`,
    messages,
  });

  return result.toDataStreamResponse();
}
