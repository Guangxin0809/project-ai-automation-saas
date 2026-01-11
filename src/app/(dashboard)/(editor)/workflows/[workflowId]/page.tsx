import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { requireAuth } from "@/utils/auth";
import { HydrateClient } from "@/trpc/server";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { EditorHeader } from "@/features/editor/components/editor-header";
import {
  Editor,
  EditorError,
  EditorLoading
} from "@/features/editor/components/editor";

type Props = {
  params: Promise<{ workflowId: string }>
}

const WorkflowPage = async ({ params }: Props) => {

  await requireAuth();
  const { workflowId } = await params;
  prefetchWorkflow(workflowId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <EditorHeader workflowId={workflowId} />
          <main className="flex-1">
            <Editor workflowId={workflowId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}

export default WorkflowPage;