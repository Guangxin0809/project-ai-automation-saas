"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type WorkflowNodeProps = {
  children: React.ReactNode;
  name?: string;
  description?: string;
  showToolbar?: boolean;
  onDelete?: () => void;
  onSettings?: () => void;
}

export const WorkflowNode = ({
  children,
  name,
  description,
  showToolbar = true,
  onSettings,
  onDelete,
}: WorkflowNodeProps) => (
  <>
    {showToolbar && (
      <NodeToolbar>
        <Button
          size="sm"
          variant="ghost"
          onClick={onSettings}
        >
          <SettingsIcon size={16} />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
        >
          <TrashIcon size={16} />
        </Button>
      </NodeToolbar>
    )}

    {children}

    {name && (
      <NodeToolbar
        isVisible
        position={Position.Bottom}
        className="max-w-[200px] text-center"
      >
        <p className="font-medium">{name}</p>

        {description && (
          <p className="truncate text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </NodeToolbar>
    )}
  </>
);