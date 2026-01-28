"use client"

import { memo, useState } from "react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";

import { useNodeStatus } from "@/hooks/use-node-status";
import { DISCORD_CHANEL_NAME } from "@/inngest/channels/discord";

import { fetchDiscordRealtimeToken } from "./actions";
import { BaseExecutionNode } from "../base-execution-node";
import { DiscordDialog, DiscordFormValues,  } from "./dialog";

type DiscordNodeData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
  username?: string;
}

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {

  const { setNodes } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: DISCORD_CHANEL_NAME,
    topic: "status",
    refreshToken: fetchDiscordRealtimeToken,
  });

  const nodeData = props.data;
  const description = nodeData?.content
    ? `Send: ${nodeData.content.slice(0, 50)}...`
    : "Not configured";

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: DiscordFormValues) => {
    setNodes(nodes => nodes.map(node => {
      if (node.id === props.id) {
        return {
          ...node,
          data: {
            ...node.data,
            ...values
          },
        }
      }

      return node;
    }))
  }

  return (
    <>
      <DiscordDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />

      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/discord.svg"
        name="Discord"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

DiscordNode.displayName = "DiscordNode";
