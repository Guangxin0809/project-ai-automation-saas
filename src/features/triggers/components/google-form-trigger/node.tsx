"use client";

import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";

import { useNodeStatus } from "@/hooks/use-node-status";
import { GOOGLE_FORM_TRIGGER_CHANEL_NAME } from "@/inngest/channels/google-form-trigger";

import { GoogleFormTriggerDialog } from "./dialog";
import { BaseTriggerNode } from "../base-trigger-node";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {

  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: GOOGLE_FORM_TRIGGER_CHANEL_NAME,
    topic: "status",
    refreshToken: fetchGoogleFormTriggerRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <GoogleFormTriggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <BaseTriggerNode
        {...props}
        icon="/googleform.svg"
        name="Google Form"
        description="When form is submitted"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={() => {}}
      />
    </>
  );
});

GoogleFormTriggerNode.displayName = "GoogleFormTriggerNode";