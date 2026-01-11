import { channel, topic } from "@inngest/realtime";

type StatusTopicType = {
  nodeId: string;
  status: "loading" | "success" | "error";
}

export const MANUAL_TRIGGER_CHANEL_NAME = "http-request-execution";

export const manualTriggerChannel = channel(MANUAL_TRIGGER_CHANEL_NAME)
  .addTopic(
    topic("status").type<StatusTopicType>(),
  );
