import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { requireAuth } from "@/utils/auth";
import { HydrateClient } from "@/trpc/server";
import { prefetchExecution } from "@/features/executions/server/prefetch";
import { ExecutionView } from "@/features/executions/components/execution";
import {
  ExecutionsError,
  ExecutionsLoading
} from "@/features/executions/components/executions";

type Props = {
  params: Promise<{
    executionId: string
  }>
}

const ExecutionPage = async ({ params }: Props) => {

  await requireAuth();

  const { executionId } = await params;
  prefetchExecution(executionId);

  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="flex flex-col gap-y-8 w-full max-w-3xl h-full mx-auto">
        <HydrateClient>
          <ErrorBoundary fallback={<ExecutionsError />}>
            <Suspense fallback={<ExecutionsLoading />}>
              <ExecutionView executionId={executionId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
}

export default ExecutionPage;