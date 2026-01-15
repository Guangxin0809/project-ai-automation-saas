"use client";

import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react";

import { useNodeStatus } from "@/hooks/use-node-status";
import { STRIPE_TRIGGER_CHANEL_NAME } from "@/inngest/channels/stripe-trigger";

import { StripeTriggerDialog } from "./dialog";
import { BaseTriggerNode } from "../base-trigger-node";
import { fetchStripeTriggerRealtimeToken } from "./actions";

export const StripeTriggerNode = memo((props: NodeProps) => {

  const [dialogOpen, setDialogOpen] = useState(false);

  const nodeStatus = useNodeStatus({
    nodeId: props.id,
    channel: STRIPE_TRIGGER_CHANEL_NAME,
    topic: "status",
    refreshToken: fetchStripeTriggerRealtimeToken,
  });

  const handleOpenSettings = () => setDialogOpen(true);

  return (
    <>
      <StripeTriggerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <BaseTriggerNode
        {...props}
        icon="/stripe.svg"
        name="Stripe"
        description="When stripe event is captured"
        status={nodeStatus}
        onSettings={handleOpenSettings}
        onDoubleClick={handleOpenSettings}
      />
    </>
  );
});

StripeTriggerNode.displayName = "StripeTriggerNode";