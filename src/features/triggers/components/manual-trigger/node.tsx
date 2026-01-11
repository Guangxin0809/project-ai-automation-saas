"use client";

import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";

import { useNodeStatus } from "@/hooks/use-node-status";
import { MANUAL_TRIGGER_CHANEL_NAME } from "@/inngest/channels/manual-trigger";

import { ManualTriggerDialog } from "./dialog";
import { BaseTriggerNode } from "../base-trigger-node";
import { fetchManualTriggerRealtimeToken } from "./actions";

export const ManualTriggerNode = memo((props: NodeProps) => {

  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: MANUAL_TRIGGER_CHANEL_NAME,
    topic: "status",
    refreshToken: fetchManualTriggerRealtimeToken,
  });

  const handleSettingsOpen = () => setDialogOpen(true);

  return (
    <>
      <ManualTriggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
        status={nodeStatus}
        onSettings={handleSettingsOpen}
        onDoubleClick={() => {}}
      />
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";