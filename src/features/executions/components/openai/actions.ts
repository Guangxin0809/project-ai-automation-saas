"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { openAiChannel } from "@/inngest/channels/openai";

export type OpenAiToken = Realtime.Token<
  typeof openAiChannel,
  ["status"]
>;

export const fetchOpenAiRealtimeToken = async (): Promise<OpenAiToken> => {
  const token = await getSubscriptionToken(inngest, {
    channel: openAiChannel(),
    topics: ["status"]
  });

  return token;
}
