import { channel, topic } from "@inngest/realtime";

type StatusTopicType = {
  nodeId: string;
  status: "loading" | "success" | "error";
}

export const GEMINI_CHANEL_NAME = "gemini-execution"
;
export const geminiChannel = channel(GEMINI_CHANEL_NAME)
  .addTopic(
    topic("status").type<StatusTopicType>(),
  );
