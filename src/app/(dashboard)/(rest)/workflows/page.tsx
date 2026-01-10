import { Suspense } from "react";
import { SearchParams } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";

import { requireAuth } from "@/utils/auth";
import { HydrateClient } from "@/trpc/server";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";
import {
  WorkflowsContainer,
  WorkflowsError,
  WorkflowsList,
  WorkflowsLoading
} from "@/features/workflows/components/workflows";

type Props = {
  searchParams: Promise<SearchParams>
}

const WorkflowsPage = async ({ searchParams }: Props) => {

  await requireAuth();
  const params = await workflowsParamsLoader(searchParams);
  prefetchWorkflows(params);

  return (
    <WorkflowsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<WorkflowsError />}>
          <Suspense fallback={<WorkflowsLoading />}>
            <WorkflowsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </WorkflowsContainer>
  );
}

export default WorkflowsPage;

