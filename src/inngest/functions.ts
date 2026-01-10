import { generateText } from 'ai';
import * as Sentry from "@sentry/nextjs";

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

    Sentry.logger.info("User triggered test log", { log_source: "sentry_test" });
    console.warn("This is warn i want to track");
    console.error("This is error i want to track");

    const { steps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: "google/gemini-2.5-flash",
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        }
      },
    );

    return steps;
  },
);