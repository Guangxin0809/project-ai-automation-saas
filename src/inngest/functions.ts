import { generateText } from 'ai';

import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "5s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const executeAi = inngest.createFunction(
  { id: "execute-ai" },
  { event: "test/execute.ai" },
  async ({ event, step }) => {
    await step.sleep("pretend", 5_000);

    const { steps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: "google/gemini-2.5-flash",
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 2?",
      },
    );

    return steps;
  },
);