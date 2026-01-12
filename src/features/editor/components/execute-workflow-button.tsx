import { FlaskConicalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";

export const ExecuteWorkflowButton = ({ workflowId }: { workflowId: string }) => {

  const executeWorkflowMutation = useExecuteWorkflow();

  const handleExecuteWorkflow = () => {
    executeWorkflowMutation.mutate({ id: workflowId });
  }

  return (
    <Button
      size="lg"
      onClick={handleExecuteWorkflow}
      disabled={executeWorkflowMutation.isPending}
    >
      <FlaskConicalIcon size={16} />
      Execute workflow
    </Button>
  );
}
