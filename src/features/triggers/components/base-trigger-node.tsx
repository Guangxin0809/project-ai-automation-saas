"use client";

import { memo } from "react";
import Image from "next/image";
import { LucideIcon } from "lucide-react";
import { NodeProps, Position, useReactFlow } from "@xyflow/react";

import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/react-flow/workflow-node";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  description?: string;
  children?: React.ReactNode;
  status?: NodeStatus;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
  ({
    id,
    icon: Icon,
    name,
    description,
    children,
    status = "initial",
    onSettings,
    onDoubleClick,
  }: BaseTriggerNodeProps) => {

    const { setNodes, setEdges } = useReactFlow();

    const handleDelete = () => {
      setNodes(prevNodes => prevNodes.filter(
        node => node.id !== id,
      ));

      setEdges(prevEdges => prevEdges.filter(
        edge => (edge.source !== id) && (edge.target !== id),
      ));
    }

    return (
      <WorkflowNode
        name={name}
        description={description}
        onDelete={handleDelete}
        onSettings={onSettings}
      >
        <NodeStatusIndicator
          status={status}
          variant="border"
          className="rounded-l-2xl"
        >
          <BaseNode
            status={status}
            onDoubleClick={onDoubleClick}
            className="relative group rounded-l-2xl"
          >
            <BaseNodeContent>
              {typeof Icon === "string" ? (
                <Image
                  src={Icon}
                  alt={name}
                  width={16}
                  height={16}
                />
              ) : (
                <Icon className="size-4 text-muted-foreground" />
              )}

              {children}

              <BaseHandle
                id="source-1"
                type="source"
                position={Position.Right}
              />
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator>
      </WorkflowNode>
    );
  }
);

BaseTriggerNode.displayName = "BaseTriggerNode";