"use client";

import Link from "next/link";
import { useAtomValue } from "jotai";
import { SaveIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  useSuspenseWorkflow,
  useUpdateWorkflow,
  useUpdateWorkflowName
} from "@/features/workflows/hooks/use-workflows";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

import { editorAtom } from "../store/atoms";

export const EditorHeader = ({ workflowId }: { workflowId: string }) => (
  <header className="flex items-center gap-x-2 shrink-0 h-14 px-4 border-b bg-background">
    <SidebarTrigger />
    <div className="flex flex-row justify-between items-center gap-x-4 w-full">
      <EditorBreadcrumbs workflowId={workflowId} />
      <EditorSaveButton workflowId={workflowId} />
    </div>
  </header>
);

export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href="/workflows" prefetch>
            Workflows
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbSeparator />
      <EditorNameInput workflowId={workflowId} />
    </BreadcrumbList>
  </Breadcrumb>
);

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {

  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const updateWorkflowNameMutation = useUpdateWorkflowName();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(workflow.name);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (workflow.name) {
      setName(workflow.name)
    }
  }, [workflow.name]);

  useEffect(() => {
    if (isEditing && nameInputRef?.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditing]);

  const handleUpdateName = async () => {
    if (name === workflow.name) {
      setIsEditing(false);
      return;
    }

    try {
      await updateWorkflowNameMutation.mutateAsync({
        id: workflowId,
        name,
      });
    } catch (error) {
      console.error("Faield to update workflow name: ", error);
      setName(workflow.name);
    } finally {
      setIsEditing(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdateName();
    } else if (e.key === "Escape") {
      setName(workflow.name);
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <Input
        ref={nameInputRef}
        value={name}
        disabled={updateWorkflowNameMutation.isPending}
        onChange={e => setName(e.target.value)}
        onBlur={handleUpdateName}
        onKeyDown={handleKeyDown}
        className="w-auto min-w-[100px] h-7 px-2"
      />
    );
  }

  return (
    <BreadcrumbItem
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:text-foreground transition-colors"
    >
      {workflow.name}
    </BreadcrumbItem>
  );
}

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {

  const editor = useAtomValue(editorAtom);
  const saveWorkflowMutation = useUpdateWorkflow();

  const handleSaveWorkflow = () => {
    if (!editor) return;

    const nodes = editor.getNodes();
    const edges = editor.getEdges();

    saveWorkflowMutation.mutate({
      id: workflowId,
      nodes,
      edges,
    });
  }

  return (
    <div className="ml-auto">
      <Button
        size="sm"
        disabled={saveWorkflowMutation.isPending}
        onClick={handleSaveWorkflow}
      >
        <SaveIcon size={16} />
        Save
      </Button>
    </div>
  );
}