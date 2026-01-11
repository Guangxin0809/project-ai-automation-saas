"use client";

import { memo, useState } from "react";
import { PlusIcon } from "lucide-react";
import { NodeProps } from "@xyflow/react";

import { NodeSelector } from "./node-selector";
import { WorkflowNode } from "./workflow-node";
import { PlaceholderNode } from "./placeholder-node";

export const InitialNode = memo((props: NodeProps) => {

  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <WorkflowNode showToolbar={false}>
        <PlaceholderNode
          {...props}
          onClick={() => setSelectorOpen(true)}
        >
          <div className="flex justofy-center items-center cursor-pointer">
            <PlusIcon size={16} />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
});

InitialNode.displayName = "InitialNode";