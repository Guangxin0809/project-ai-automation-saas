import { channel, topic } from "@inngest/realtime";

type StatusTopicType = {
  nodeId: string;
  status: "loading" | "success" | "error";
}

export const ANTHROPIC_CHANEL_NAME = "anthropic-execution"
;
export const anthropicChannel = channel(ANTHROPIC_CHANEL_NAME)
  .addTopic(
    topic("status").type<StatusTopicType>(),
  );
