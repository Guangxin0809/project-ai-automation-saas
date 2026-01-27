import { toast } from "sonner";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery
} from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { CredentialType } from "@/generated/prisma/enums";

import { useCredentialsParams } from "./use-credential-params";

export const useSuspenseCredentials = () => {
  const trpc = useTRPC();
  const [params] = useCredentialsParams();

  return useSuspenseQuery(
    trpc.credentials.getMany.queryOptions(params)
  );
}

export const useSuspenseCredential = (credentialId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.credentials.getOne.queryOptions({ id: credentialId })
  );
}

export const useCreateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" created`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
      },
      onError: (error: any) => {
        toast.error(`Failed to create credential: ${error.message}`);
      },
    }),
  );
}

export const useRemvoeCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" removed`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryFilter({ id: data.id }),
        );
      },
      onError: (error: any) => {
        toast.error(`Failed to remove credential: ${error.message}`);
      },
    }),
  );
}

export const useUpdateCredential = () => {

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" saved`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error: any) => {
        toast.error(`Failed to save credential: ${error.message}`);
      },
    }),
  );
}

export const useCredentialsByType = (type: CredentialType) => {

  const trpc = useTRPC();

  return useQuery(
    trpc.credentials.getByType.queryOptions({ type }),
  );
}