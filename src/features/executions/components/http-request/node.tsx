"use client"

import { memo, useState } from "react";
import { GlobeIcon } from "lucide-react";
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";

import { useNodeStatus } from "@/hooks/use-node-status";
import { HTTP_REQUEST_CHANEL_NAME } from "@/inngest/channels/http-request";

import { fetchHttpRequestRealtimeToken } from "./actions";
import { BaseExecutionNode } from "../base-execution-node";
import { HttpRequestFormValues, HttpRequestDialog } from "./dialog";

type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
}

type HttpRequestNodeType = Node<HttpRequestData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {

  const { setNodes } = useReactFlow();
  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: HTTP_REQUEST_CHANEL_NAME,
    topic: "status",
    refreshToken: fetchHttpRequestRealtimeToken,
  });

  const nodeData = props.data;
  const description = nodeData?.endpoint
    ? `${nodeData.method || 'GET'}: ${nodeData.endpoint}`
    : "Not configured";

  const handleSettings = () => setDialogOpen(true);

  const handleSubmit = (values: HttpRequestFormValues) => {
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
      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />

      <BaseExecutionNode
        {...props}
        id={props.id}
        icon={GlobeIcon}
        name="HTTP Request"
        status={nodeStatus}
        description={description}
        onSettings={handleSettings}
        onDoubleClick={() => {}}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
