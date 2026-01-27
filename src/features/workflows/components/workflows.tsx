"use client";

import { WorkflowIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

import { Workflow } from "@/generated/prisma/client";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView
} from "@/components/common/entity-components";

import { useWorkflowsParams } from "../hooks/use-workflow-params";
import {
  useCreateWorkflow,
  useRemvoeWorkflow,
  useSuspenseWorkflows
} from "../hooks/use-workflows";

export const WorkflowsList = () => {

  const workflows = useSuspenseWorkflows();

  return (
    <EntityList
      items={workflows.data.items}
      getKey={(workflow) => workflow.id}
      renderItem={(workflow) => <WorkflowsItem workflow={workflow} />}
      emptyView={<WorkflowsEmpty />}
    />
  );
}

export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => (
  <EntityContainer
    header={<WorkflowsHeader />}
    search={<WorkflowsSearch />}
    pagination={<WorkflowsPagination />}
  >
    {children}
  </EntityContainer>
);

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {

  const router = useRouter();
  const createWorkflowMutation = useCreateWorkflow();
  const { modal: upgradeModal, handleError } = useUpgradeModal();

  const handleCreateWorkflow = () => {
    createWorkflowMutation.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: handleError,
    });
  }

  return (
    <>
      {upgradeModal}
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={createWorkflowMutation.isPending}
        onNew={handleCreateWorkflow}
      />
    </>
  );
}

export const WorkflowsSearch = () => {

  const [params, setParams] = useWorkflowsParams();
  const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });

  return (
    <EntitySearch
      value={searchValue}
      placeholder="Search workflows"
      onChange={onSearchChange}
    />
  );
}

export const WorkflowsPagination = () => {

  const workflows = useSuspenseWorkflows();
  const [params, setParams] = useWorkflowsParams();

  return (
    <EntityPagination
      disabled={workflows.isFetching}
      totalPages={workflows.data.totalPages}
      page={workflows.data.page}
      onPageChange={page => setParams({ ...params, page })}
    />
  );
}

export const WorkflowsLoading = () => (
  <LoadingView message="Loading workflows..." />
);

export const WorkflowsError = () => (
  <ErrorView message="Error loading workflows" />
);

export const WorkflowsEmpty = () => {

  const router = useRouter();
  const createWorkflowMutation = useCreateWorkflow();
  const { modal: upgradeModal, handleError } = useUpgradeModal();

  const handleCreateWorkflow = () => {
    createWorkflowMutation.mutate(undefined, {
      onError: handleError,
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
    });
  }

  return (
    <>
      {upgradeModal}
      <EmptyView
        message="You haven't create any workflows yet. Get started by creating your first workflow."
        disabled={createWorkflowMutation.isPending}
        onNew={handleCreateWorkflow}
      />
    </>
  );
}

export const WorkflowsItem = ({ workflow }: { workflow: Workflow }) => {

  const removeWorkflowMutation = useRemvoeWorkflow();

  const handleRemoveWorkflow = () => {
    removeWorkflowMutation.mutate({ id: workflow.id });
  }

  return (
    <EntityItem
      href={`/workflows/${workflow.id}`}
      title={workflow.name}
      subtitle={
        <>
          Update {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="flex justify-center items-center">
          <WorkflowIcon className="size-5 text-muted-foreground" />
        </div>
      }
      isRemoving={removeWorkflowMutation.isPending}
      onRemove={handleRemoveWorkflow}
    />
  );
}