import { channel, topic } from "@inngest/realtime";

type StatusTopicType = {
  nodeId: string;
  status: "loading" | "success" | "error";
}

export const DISCORD_CHANEL_NAME = "discord-execution"
;
export const discordChannel = channel(DISCORD_CHANEL_NAME)
  .addTopic(
    topic("status").type<StatusTopicType>(),
  );
