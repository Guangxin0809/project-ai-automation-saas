import { useEffect, useState } from "react";
import type { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";

import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

type UseNodeStatusProps = {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

export const useNodeStatus = ({
  nodeId,
  channel,
  topic,
  refreshToken,
}: UseNodeStatusProps) => {

  const [nodeStatus, setNodeStatus] = useState<NodeStatus>("initial");

  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  useEffect(
    () => {
      if (!data.length) return;

      // Find the latest message for this node
      const latestMessage = data
        .filter(
          msg => msg.kind === "data" &&
            msg.channel === channel &&
            msg.data.nodeId === nodeId
        )
        .sort((a, b) => {
          if (a.kind === "data" && b.kind === "data") {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }

          return 0;
        })[0];

      if (latestMessage?.kind === "data") {
        setNodeStatus(latestMessage.data.status as NodeStatus);
      }
    },
    [data, nodeId, channel, topic]
  );

  return nodeStatus;
}