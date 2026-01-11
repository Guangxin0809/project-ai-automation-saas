import { toast } from "sonner";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { useWorkflowsParams } from "./use-workflow-params";

export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();

  return useSuspenseQuery(
    trpc.workflows.getMany.queryOptions(params)
  );
}

export const useSuspenseWorkflow = (workflowId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.workflows.getOne.queryOptions({ id: workflowId })
  );
}

export const useCreateWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.crate.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" created`);
        queryClient.invalidateQueries(
          trpc.workflows.getMany.queryOptions({}),
        );
      },
      onError: (error: any) => {
        toast.error(`Failed to create workflow: ${error.message}`);
      },
    }),
  );
}

export const useRemvoeWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" removed`);
        queryClient.invalidateQueries(
          trpc.workflows.getMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryFilter({ id: data.id }),
        );
      },
      onError: (error: any) => {
        toast.error(`Failed to remove workflow: ${error.message}`);
      },
    }),
  );
}

export const useUpdateWorkflowName = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" updated`);
        queryClient.invalidateQueries(
          trpc.workflows.getMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryFilter({ id: data.id }),
        );
      },
      onError: (error: any) => {
        toast.error(`Failed to update workflow: ${error.message}`);
      },
    }),
  );
}

export const useUpdateWorkflow = () => {

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" saved`);
        queryClient.invalidateQueries(
          trpc.workflows.getMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error: any) => {
        toast.error(`Failed to save workflow: ${error.message}`);
      },
    }),
  );
}