import { NodeType } from "@/generated/prisma/enums";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";

import { NodeExecutor } from "../types";
import { httpRequestExecutor } from "../components/http-request/executor";

export const ExecutorRegistry: Record<NodeType, NodeExecutor> = {
  // Initial executor never happen(initial node is just for default, it will be replaced once added a real node), here is just for type need
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTPP_REQUEST]: httpRequestExecutor,
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: manualTriggerExecutor,  // TODO: change
}

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = ExecutorRegistry[type];

  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
}