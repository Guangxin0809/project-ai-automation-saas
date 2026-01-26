import { channel, topic } from "@inngest/realtime";

type StatusTopicType = {
  nodeId: string;
  status: "loading" | "success" | "error";
}

export const OPENAI_CHANEL_NAME = "openai-execution"
;
export const openAiChannel = channel(OPENAI_CHANEL_NAME)
  .addTopic(
    topic("status").type<StatusTopicType>(),
  );
