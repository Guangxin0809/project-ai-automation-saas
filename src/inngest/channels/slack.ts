import { channel, topic } from "@inngest/realtime";

type StatusTopicType = {
  nodeId: string;
  status: "loading" | "success" | "error";
}

export const SLACK_CHANEL_NAME = "slack-execution"
;
export const slackChannel = channel(SLACK_CHANEL_NAME)
  .addTopic(
    topic("status").type<StatusTopicType>(),
  );
