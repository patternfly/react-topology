import * as lodash from 'lodash';
import { EdgeModel, NodeModel } from '../types';

export interface AggregateOptions {
  visibility?: boolean;
  group?: boolean;
};

const getNodeParent = (nodeId: string, nodes: NodeModel[]): NodeModel | undefined =>
  nodes.find(n => (n.children ? n.children.includes(nodeId) : null));

const getDisplayedNodeForNode = (nodeId: string | undefined, nodes: NodeModel[] | undefined): string => {
  if (!nodeId || !nodes) {
    return '';
  }

  let displayedNode = nodes && nodes.find(n => n.id === nodeId);
  let parent = displayedNode ? getNodeParent(displayedNode.id, nodes) : null;
  while (parent) {
    if (parent.collapsed) {
      displayedNode = parent;
    }
    parent = getNodeParent(parent.id, nodes);
  }
  return displayedNode ? displayedNode.id : '';
};

const manageEdgeMerge = (source: string, target: string, aggregateEdgeType: string, newEdges: EdgeModel[],
  edge: EdgeModel, aggregateEdges: EdgeModel[], forceAdd: boolean) => {

  // Make sure visible is defined so that changes override what could already be in the element
  edge.visible = 'visible' in edge ? edge.visible : true;

  if (source !== target) {
    const existing = aggregateEdges.find(
      e => (e.source === source || e.source === target) && (e.target === target || e.target === source) && e.type === aggregateEdgeType
    );

    if (existing) {
      // At least one other edge, add this edge and add the aggregate edge to the edges

      // Add this edge to the aggregate and set it not visible
      existing.aggregatedIds && existing.aggregatedIds.push(edge.id);
      edge.visible = false;

      // Hide edges that are depicted by this aggregate edge
      lodash.forEach(existing.aggregatedIds, existingChild => {
        const updateEdge = newEdges.find(newEdge => newEdge.id === existingChild);
        if (updateEdge) {
          updateEdge.visible = false;
        }
      });

      // Update the aggregate edges bidirectional flag
      existing.data.bidirectional = existing.data.bidirectional || existing.source !== edge.source;

      // Check if this edge has already been added
      if (
        !newEdges.find(
          e => (e.source === source || e.source === target) && (e.target === target || e.target === source) && e.type === aggregateEdgeType
        )
      ) {
        newEdges.push(existing);
      }
    } else {
      const newEdge: EdgeModel = {
        data: { bidirectional: false },
        aggregatedIds: [edge.id],
        source,
        target,
        id: `aggregate_${source}_${target}`,
        type: aggregateEdgeType
      };
      aggregateEdges.push(newEdge);
      if (forceAdd) {
        newEdges.push(newEdge);
        edge.visible = false;
      }
    }
  } else {
    // Hide edges that connect to a non-visible node to its ancestor
    edge.visible = false;
  }
};

const manageEdgeByCollapsible = (aggregateEdgeType: string, newEdges: EdgeModel[], edge: EdgeModel, aggregateEdges: EdgeModel[], nodes: NodeModel[]) => {
  const source = getDisplayedNodeForNode(edge.source, nodes);
  const target = getDisplayedNodeForNode(edge.target, nodes);

  if (source !== edge.source || target !== edge.target) {
    manageEdgeMerge(source, target, aggregateEdgeType, newEdges, edge, aggregateEdges, false)
  }
}

const getParentAtDepth = (node: string, depth: number, nodes: NodeModel[]) => {
  let curr: string | null = node;
  while (curr && depth > 0) {
    curr = getNodeParent(curr, nodes)?.id;
    depth--;
  }
  return curr;
};

const manageEdgeByPeerGroup = (aggregateEdgeType: string, newEdges: EdgeModel[], edge: EdgeModel, aggregateEdges: EdgeModel[], nodes: NodeModel[]) => {
  let topReached = false;
  let nestingDepth = 1;

  const srcParent = getNodeParent(edge.source, nodes)?.id || edge.source;
  const dstParent = getNodeParent(edge.target, nodes)?.id || edge.target;

  const ref: string = `${aggregateEdgeType}-${[srcParent, dstParent].sort((a, b) => a.localeCompare(b)).join('-')}`
  let prev: string = edge.source;
  let curr: string | null = null;

  function getEdgePeer(e: EdgeModel): string {
    return topReached ? e.target : e.source;
  }

  function moveNext() {
    if (curr) {
      prev = curr;
    }

    // check if prev & curr share the same parent
    if (!curr || getNodeParent(prev, nodes) !== getNodeParent(curr, nodes)) {
      const peer = getEdgePeer(edge);
      curr = getParentAtDepth(peer, nestingDepth, nodes);
    } else {
      curr = null;
    }
  }

  for (let i = 0; i < 2; i++) {
    moveNext();
    while (curr) {
      manageEdgeMerge(prev, curr, ref, newEdges, edge, aggregateEdges, prev === edge.source);
      nestingDepth++;
      moveNext();
    }

    nestingDepth = 1;
    if (!topReached) {
      // top common parent has been reached, moving now from tgt to src
      topReached = true;
    } else {
      // add last edge
      manageEdgeMerge(prev, edge.target, ref, newEdges, edge, aggregateEdges, true);
    }
  }
}

const createAggregateEdges = (
  aggregateEdgeType: string,
  edges: EdgeModel[] | undefined,
  nodes: NodeModel[] | undefined,
  options: AggregateOptions = { visibility: true, group: false }
): EdgeModel[] => {
  const aggregateEdges: EdgeModel[] = [];

  const result = lodash.reduce(
    edges,
    (newEdges: EdgeModel[], edge: EdgeModel) => {
      if (options.visibility) {
        manageEdgeByCollapsible(aggregateEdgeType, newEdges, edge, aggregateEdges, nodes);
      }
      if (options.group) {
        manageEdgeByPeerGroup(aggregateEdgeType, newEdges, edge, aggregateEdges, nodes);
      }
      newEdges.push(edge);
      return newEdges;
    },
    [] as EdgeModel[]
  );

  // eslint-disable-next-line no-console
  console.log("result", result);
  return result;
};

export { createAggregateEdges };
