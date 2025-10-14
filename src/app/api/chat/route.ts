import { NextResponse } from "next/server";

const DEFAULT_MODEL = "llama-3.1-8b-instant";

type ChatCompletionMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type RequestPayload = {
  characterId: string;
  systemPrompt: string;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GROQ_API_KEY" },
      { status: 500 },
    );
  }

  const body = (await request.json()) as RequestPayload;

  if (!body?.messages?.length || !body.systemPrompt) {
    return NextResponse.json(
      { error: "Invalid chat payload" },
      { status: 400 },
    );
  }

  const messages: ChatCompletionMessage[] = [
    { role: "system", content: body.systemPrompt },
    ...body.messages,
  ];

  const groqResponse = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? DEFAULT_MODEL,
        messages,
        stream: true,
        temperature: 0.65,
        max_tokens: 768,
      }),
    },
  );

  if (!groqResponse.ok || !groqResponse.body) {
    const errorText = await groqResponse.text();
    console.error("Groq error:", errorText);
    return NextResponse.json(
      { error: "Failed to reach Groq" },
      { status: 502 },
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = groqResponse.body.getReader();

  const stream = new ReadableStream({
    start(controller) {
      let buffer = "";

      const processBuffer = () => {
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === "data: [DONE]") {
            continue;
          }

          if (trimmed.startsWith("data: ")) {
            try {
              const payload = JSON.parse(trimmed.slice(6));
              const content =
                payload?.choices?.[0]?.delta?.content ??
                payload?.choices?.[0]?.message?.content ??
                "";
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            } catch (error) {
              console.error("Failed to parse Groq chunk", error);
            }
          }
        }
      };

      async function pump() {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              processBuffer();
              controller.close();
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            processBuffer();
          }
        } catch (error) {
          controller.error(error);
        }
      }

      pump();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
