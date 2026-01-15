import { channel, topic } from "@inngest/realtime";

type StatusTopicType = {
  nodeId: string;
  status: "loading" | "success" | "error";
}

export const STRIPE_TRIGGER_CHANEL_NAME = "stripe-trigger-execution";

export const stripeTriggerChannel = channel(STRIPE_TRIGGER_CHANEL_NAME)
  .addTopic(
    topic("status").type<StatusTopicType>(),
  );
