import Groq from "groq-sdk";
import { StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          controller.enqueue(chunk.choices[0]?.delta?.content || "");
        }
        controller.close();
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof Groq.APIError) {
      // Groq API error handling
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      // General error handling
      console.error("An unexpected error occurred:", error);
      throw error;
    }
  }
}
