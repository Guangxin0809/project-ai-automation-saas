"use client";

import { formatDistanceToNow } from "date-fns";

import { Execution } from "@/generated/prisma/client";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView
} from "@/components/common/entity-components";

import { formatStatus, getStatusIcon } from "../utils";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-execution-params";

export const ExecutionsList = () => {

  const executions = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionsItem execution={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  );
}

export const ExecutionsHeader = () => (
  <EntityHeader
    title="Executions"
    description="View your workflow execution history"
  />
);

export const ExecutionsPagination = () => {

  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();

  return (
    <EntityPagination
      disabled={executions.isFetching}
      totalPages={executions.data.totalPages}
      page={executions.data.page}
      onPageChange={page => setParams({ ...params, page })}
    />
  );
}

export const ExecutionsContainer = ({ children }: { children: React.ReactNode }) => (
  <EntityContainer
    header={<ExecutionsHeader />}
    pagination={<ExecutionsPagination />}
  >
    {children}
  </EntityContainer>
);

export const ExecutionsLoading = () => (
  <LoadingView message="Loading executions..." />
);

export const ExecutionsError = () => (
  <ErrorView message="Error loading executions" />
);

export const ExecutionsEmpty = () => (
  <EmptyView
    message="You haven't create any executions yet. Get started by running your first workflow."
  />
);

type ExecutionsItemProps = {
  execution: Execution & {
    workflow: {
      id: string;
      name: string;
    }
  }
}

export const ExecutionsItem = ({ execution }: ExecutionsItemProps) => {

  const duration = execution.completedAt
    ? Math.round(
      (new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1_000
    )
    : null;

  const subtitle = (
    <>
      {execution.workflow.name} &bull; Started{" "}
      {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
      {(duration !== null) && (<> &bull; Took {duration}s</>)}
    </>
  );

  const image = (
    <div className="flex justify-center items-center">
      {getStatusIcon(execution.status)}
    </div>
  );

  return (
    <EntityItem
      href={`/executions/${execution.id}`}
      title={formatStatus(execution.status)}
      subtitle={subtitle}
      image={image}
    />
  );
}