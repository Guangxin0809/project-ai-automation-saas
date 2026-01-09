"use client";

import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";

import { LogoutButton } from "./logout-button";


const HomePage = () => {

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const crateWorkflowMutation = useMutation(trpc.crateWorkflow.mutationOptions({
    onSuccess: () => {
      toast.success("Job queued");
    },
    onSettled: () => {
      queryClient.invalidateQueries(
        trpc.getWorkflows.queryOptions(),
      );
    },
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

      <LogoutButton />
    </div>
  );
}

export default HomePage;
