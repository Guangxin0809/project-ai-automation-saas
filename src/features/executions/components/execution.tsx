"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { formatStatus, getStatusIcon } from "../utils";
import { useSuspenseExecution } from "../hooks/use-executions";

export const ExecutionView = ({ executionId }: { executionId: string }) => {

  const { data: execution } = useSuspenseExecution(executionId);
  const [showStackTrace, setShowStackTrace] = useState(false);

  const duration = execution.completedAt
    ? Math.round(
      (new Date(execution.completedAt).getTime() - new Date(execution.startedAt).getTime()) / 1_000
    )
    : null;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center gap-x-3">
          {getStatusIcon(execution.status)}

          <div>
            <CardTitle>
              {formatStatus(execution.status)}
            </CardTitle>
            <CardDescription>
              Execution for {execution.workflow.name}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-sm text-muted-foreground">
              Workflow
            </p>
            <Link
              prefetch
              href={`/workflows/${execution.workflowId}`}
              className="text-sm text-primary hover:underline"
            >
              {execution.workflow.name}
            </Link>
          </div>

          <div>
            <p className="font-medium text-sm text-muted-foreground">
              Status
            </p>
            <p className="text-sm">
              {formatStatus(execution.status)}
            </p>
          </div>

          <div>
            <p className="font-medium text-sm text-muted-foreground">
              Started
            </p>
            <p className="text-sm">
              {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
            </p>
          </div>

          {execution.completedAt && (
            <div>
              <p className="font-medium text-sm text-muted-foreground">
                Completed
              </p>
              <p className="text-sm">
                {formatDistanceToNow(execution.completedAt, { addSuffix: true })}
              </p>
            </div>
          )}

          {(duration !== null) && (
            <div>
              <p className="font-medium text-sm text-muted-foreground">
                Duration
              </p>
              <p className="text-sm">
                {duration}s
              </p>
            </div>
          )}

          <div>
            <p className="font-medium text-sm text-muted-foreground">
              Event ID
            </p>
            <p className="text-sm">
              {execution.inngestEventId}
            </p>
          </div>
        </div>

        <div>
          {execution.error && (
            <div className="space-y-3 mt-6 p-4 rounded-md bg-red-50">
              <div>
                <p className="mb-2 font-medium text-sm text-red-900">
                  Error
                </p>
                <p className="font-mono text-xs text-red-800">
                  {execution.error}
                </p>
              </div>

              {execution.errorStack && (
                <Collapsible
                  open={showStackTrace}
                  onOpenChange={setShowStackTrace}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-900 hover:bg-red-100"
                    >
                      {
                        showStackTrace
                          ? "Hide stack trace"
                          : "Show stack trace"
                      }
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <pre className="mt-2 p-2 rounded bg-red-100 font-mono text-xs text-red-800 overflow-auto">
                      {execution.errorStack}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          )}
        </div>

        {execution.output && (
          <div className="mt-6 p-2 rounded-md bg-muted">
            <p className="mb-2 font-medium text-sm">Output</p>
            <pre className="font-mono text-xs overflow-auto">
              {JSON.stringify(execution.output, null, 4)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}