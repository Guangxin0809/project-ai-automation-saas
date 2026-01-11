import { channel, topic } from "@inngest/realtime";

type StatusTopicType = {
  nodeId: string;
  status: "loading" | "success" | "error";
}

export const HTTP_REQUEST_CHANEL_NAME = "http-request-execution"
;
export const httpRequestChannel = channel(HTTP_REQUEST_CHANEL_NAME)
  .addTopic(
    topic("status").type<StatusTopicType>(),
  );
