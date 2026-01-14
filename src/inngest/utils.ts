import toposort from "toposort";

import { Connection, Node } from "@/generated/prisma/client";
import { inngest } from "./client";

export const topologicalSort = (
  nodes: Node[],
  connections: Connection[]
): Node[] => {

  // If no connections, return nodes as-is (they're all independent)
  if (connections.length === 0) {
    return nodes;
  }

  // Create edges array for toposort
  const edges: [string, string][] = connections.map(connection => [
    connection.sourceNodeId,
    connection.targetNodeId,
  ]);

  // Add nodes with no connections as self-edges to ensure they're included
  const connectedNodeIds = new Set<string>();
  for (const connection of connections) {
    connectedNodeIds.add(connection.sourceNodeId);
    connectedNodeIds.add(connection.targetNodeId);
  }
  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  // Perform tpological sort
  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);
    sortedNodeIds = [...new Set(sortedNodeIds)] // Remove duplicates (from self-edges)
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Cyclic")
    ) {
      throw new Error("Workflow contains a cycle");
    }

    throw error;
  }

  // Map sorted IDs back to node objects
  const nodeMap = new Map(
    nodes.map(node => [node.id, node])
  );

  return sortedNodeIds
    .map(nodeId => nodeMap.get(nodeId)!)
    .filter(Boolean);
}

export const sendWorkflowExecution = async(data:{
  workflowId: string;
  [key: string]: any;
}) => {
  return inngest.send({
    name: "workflows/execute.workflow",
    data,
  });
}