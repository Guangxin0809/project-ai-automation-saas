import { channel, topic } from "@inngest/realtime";

type StatusTopicType = {
  nodeId: string;
  status: "loading" | "success" | "error";
}

export const GOOGLE_FORM_TRIGGER_CHANEL_NAME = "google-form-execution";

export const googleFormTriggerChannel = channel(GOOGLE_FORM_TRIGGER_CHANEL_NAME)
  .addTopic(
    topic("status").type<StatusTopicType>(),
  );
