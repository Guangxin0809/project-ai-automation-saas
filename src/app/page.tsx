"use client";

import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";

import { LogoutButton } from "./logout-button";


const HomePage = () => {

  const trpc = useTRPC();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const crateWorkflowMutation = useMutation(trpc.crateWorkflow.mutationOptions({
    onSuccess: () => {
      toast.success("Job queued");
    }
  }));

  const testAiMutation = useMutation(trpc.testAi.mutationOptions({
    onSuccess: () => {
      toast.success("Job queued");
    }
  }));

  return (
    <div className="flex flex-col justify-center items-center gap-y-6 min-w-screen min-h-screen">
      protected server component
      <p>{JSON.stringify(data, null, 2)}</p>

      <Button
        disabled={crateWorkflowMutation.isPending}
        onClick={() => crateWorkflowMutation.mutate()}
      >
        Create workflow
      </Button>

      <Button
        disabled={testAiMutation.isPending}
        onClick={() => testAiMutation.mutate()}
      >
        Test AI
      </Button>

      <LogoutButton />
    </div>
  );
}

export default HomePage;
