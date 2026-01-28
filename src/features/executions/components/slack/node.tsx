"use client"

import { memo, useState } from "react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";

import { useNodeStatus } from "@/hooks/use-node-status";
import { SLACK_CHANEL_NAME } from "@/inngest/channels/slack";

import { fetchSlackRealtimeToken } from "./actions";
import { SlackDialog, SlackFormValues,  } from "./dialog";
import { BaseExecutionNode } from "../base-execution-node";

type SlackNodeData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
}

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {

  const { setNodes } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: SLACK_CHANEL_NAME,
    topic: "status",
    refreshToken: fetchSlackRealtimeToken,
  });

  const nodeData = props.data;
  const description = nodeData?.content
    ? `Send: ${nodeData.content.slice(0, 50)}...`
    : "Not configured";

  const handleOpenSettings = () => setDialogOpen(true);

  const handleSubmit = (values: SlackFormValues) => {
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
      <SlackDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />

      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/slack.svg"
        name="Slack"
        status={nodeStatus}
        description={description}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

SlackNode.displayName = "SlackNode";
