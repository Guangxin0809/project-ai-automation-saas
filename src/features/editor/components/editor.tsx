"use client";

import { useSetAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { NodeType } from "@/generated/prisma/enums";
import { nodeComponents } from "@/config/node-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import {
  ErrorView,
  LoadingView
} from "@/components/common/entity-components";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Panel,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection
} from "@xyflow/react";

import { editorAtom } from "../store/atoms";
import { AddNodeButton } from "./add-node-button";

import "@xyflow/react/dist/style.css";

export const Editor = ({ workflowId }: { workflowId: string }) => {

  const setEditor = useSetAtom(editorAtom);
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const hasManualTrigger = useMemo(
    () => nodes.some(
      node => node.type === NodeType.MANUAL_TRIGGER
    ),
    [nodes]
  );

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeComponents}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setEditor}
        fitView
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectNodesOnDrag
      >
        <Background />
        <Controls />
        <MiniMap />

        <Panel position="top-right">
          <AddNodeButton />
        </Panel>

        {hasManualTrigger && (
          <Panel position="bottom-center">
            <Button>
              Execute
            </Button>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}

export const EditorLoading = () => (
  <LoadingView message="Loading editor..." />
);

export const EditorError = () => (
  <ErrorView message="Error loading editor" />
);
