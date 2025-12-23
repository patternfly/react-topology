import {
  EdgeAnimationSpeed,
  EdgeModel,
  EdgeStyle,
  EdgeTerminalType,
  LabelPosition,
  Model,
  NodeModel,
  NodeShape,
  NodeStatus
} from '@patternfly/react-topology';
import { LayoutType } from '../../layouts/defaultLayoutFactory';

export const DEFAULT_NODE_SIZE = 75;

export const NODE_STATUSES = [
  NodeStatus.danger,
  NodeStatus.success,
  NodeStatus.warning,
  NodeStatus.info,
  NodeStatus.default
];
export const NODE_SHAPES = [
  NodeShape.ellipse,
  NodeShape.rect,
  NodeShape.rhombus,
  NodeShape.trapezoid,
  NodeShape.hexagon,
  NodeShape.octagon,
  NodeShape.stadium
];

export const EDGE_STYLES = [
  EdgeStyle.dashed,
  EdgeStyle.dashedMd,
  EdgeStyle.dotted,
  EdgeStyle.dashedLg,
  EdgeStyle.dashedXl,
  EdgeStyle.solid
];

export const EDGE_ANIMATION_SPEEDS = [
  EdgeAnimationSpeed.medium,
  EdgeAnimationSpeed.mediumFast,
  EdgeAnimationSpeed.mediumSlow,
  EdgeAnimationSpeed.fast,
  EdgeAnimationSpeed.none,
  EdgeAnimationSpeed.slow
];

export const EDGE_TERMINAL_TYPES = [
  EdgeTerminalType.directionalAlt,
  EdgeTerminalType.circle,
  EdgeTerminalType.square,
  EdgeTerminalType.cross,
  EdgeTerminalType.directional,
  EdgeTerminalType.none
];

const getRandomNode = (numNodes: number, notNode = -1): number => {
  let node = Math.floor(Math.random() * numNodes);
  if (node === notNode) {
    node = getRandomNode(numNodes, notNode);
  }
  return node;
};

export enum DataTypes {
  Default,
  Alternate
}

export interface GeneratedNodeData {
  index?: number;
  dataType?: DataTypes;
  subTitle?: string;
  objectType?: string;
  shape?: NodeShape;
  status?: NodeStatus;
}

export interface GeneratorNodeOptions {
  showStatus?: boolean;
  showShapes?: boolean;
  showDecorators?: boolean;
  labels?: boolean;
  secondaryLabels?: boolean;
  labelPosition: LabelPosition;
  badges?: boolean;
  icons?: boolean;
  contextMenus?: boolean;
  hideKebabMenu?: boolean;
  hulledOutline?: boolean;
}

export interface GeneratorEdgeOptions {
  showStyles?: boolean;
  showStatus?: boolean;
  showAnimations?: boolean;
  showTags?: boolean;
  terminalTypes?: boolean;
}

const createNode = (index: number): NodeModel => ({
  id: `node-${index}`,
  label: `Node ${index} Title`,
  type: 'node',
  width: DEFAULT_NODE_SIZE,
  height: DEFAULT_NODE_SIZE,
  data: {
    dataType: 'Default',
    index,
    subTitle: `Node subtitle`,
    objectType: 'CS',
    shape: NODE_SHAPES[Math.round(Math.random() * (NODE_SHAPES.length - 1))],
    status: NODE_STATUSES[index % NODE_STATUSES.length]
  }
});

export const generateDataModel = (
  numNodes: number,
  numGroups: number,
  numEdges: number,
  groupDepth: number = 0,
  layout: string = ''
): Model => {
  const groups: NodeModel[] = [];
  const nodes: NodeModel[] = [];
  const edges: EdgeModel[] = [];

  const createGroup = (
    childNodes: NodeModel[],
    baseId: string = 'Group',
    index: number,
    level: number = 0
  ): NodeModel => {
    const id = `${baseId}-${index}`;
    const group: NodeModel = {
      id,
      children: [],
      type: 'group',
      group: true,
      label: id,
      style: { padding: 45 },
      data: {
        objectType: 'GN'
      }
    };
    if (level === groupDepth) {
      group.children = childNodes.map((n) => n.id);
    } else {
      const nodesPerChildGroup = Math.floor(childNodes.length / 2);
      if (nodesPerChildGroup < 1) {
        const g1 = createGroup(childNodes, id, 1, level + 1);
        group.children = [g1.id];
      } else {
        const g1 = createGroup(childNodes.slice(0, nodesPerChildGroup), id, 1, level + 1);
        const g2 = createGroup(childNodes.slice(nodesPerChildGroup), id, 2, level + 1);
        group.children = [g1.id, g2.id];
      }
    }

    groups.push(group);
    return group;
  };

  for (let i = 0; i < numNodes; i++) {
    nodes.push(createNode(i));
  }

  // For Dagre layouts we need special edge creation to make it sensible
  if (layout === LayoutType.Dagre || layout === LayoutType.DagreHorizontal) {
    // Compute numLevels such that every parent has at least 2 children
    // For a binary tree: total nodes for L levels = 2^L - 1, so L = floor(log2(n + 1))
    const maxLevels = layout === LayoutType.Dagre ? 5 : 12;
    const numLevels = Math.min(maxLevels, Math.max(1, Math.floor(Math.log2(numNodes + 1))));

    // Distribute nodes across levels ensuring all levels are populated
    // First, calculate nodes per level to ensure we reach all levels
    const levels: number[][] = [];
    let nodeIndex = 0;

    // Start with 1 node at top, then grow each level but cap growth to ensure all levels get nodes
    // const baseNodesPerLevel = Math.max(1, Math.floor(numNodes / numLevels));
    let remainingNodes = numNodes;

    for (let level = 0; level < numLevels; level++) {
      const remainingLevels = numLevels - level;
      // Ensure we leave at least 2 nodes for each remaining level (except first level)
      const minNodesForRemainingLevels = (remainingLevels - 1) * 2;
      const maxForThisLevel = Math.max(1, remainingNodes - minNodesForRemainingLevels);
      // First level gets 1 node, subsequent levels get at least 2 nodes
      const minNodes = level === 0 ? 1 : 2;
      const targetNodes =
        level === 0
          ? 1
          : Math.min(Math.max(minNodes, Math.floor(remainingNodes / remainingLevels) + 1), maxForThisLevel);
      const nodesAtLevel = Math.max(minNodes, Math.min(targetNodes, remainingNodes));

      levels.push([]);
      for (let j = 0; j < nodesAtLevel && nodeIndex < numNodes; j++) {
        levels[level].push(nodeIndex++);
        remainingNodes--;
      }
    }

    const lowestLevel = levels.length - 1;

    // Handle any remaining dangling nodes by adding them to the lowest level
    if (nodeIndex < numNodes) {
      while (nodeIndex < numNodes) {
        levels[lowestLevel].push(nodeIndex++);
      }
    }

    // Create edges connecting each parent to its children
    // Ensure every parent that has children has at least 2 children
    // Track children by parent for grouping siblings
    const childrenByParent: Map<number, number[]> = new Map();
    const nodesWithChildren: Set<number> = new Set();

    let i = 0;
    for (let level = 0; level < lowestLevel; level++) {
      const parents = levels[level];
      const children = levels[level + 1];

      if (children.length < 2) {
        // Not enough children to give any parent at least 2
        break;
      }

      // Limit parents to those who can have at least 2 children each
      const maxParentsWithChildren = Math.floor(children.length / 2);
      const parentsWithChildren = parents.slice(0, maxParentsWithChildren);

      if (parentsWithChildren.length === 0) {
        break;
      }

      // Distribute children evenly, ensuring at least 2 per parent
      const childrenPerParent = Math.max(2, Math.ceil(children.length / parentsWithChildren.length));
      let childIdx = 0;

      for (const sourceNum of parentsWithChildren) {
        if (!childrenByParent.has(sourceNum)) {
          childrenByParent.set(sourceNum, []);
        }

        for (let c = 0; c < childrenPerParent && childIdx < children.length; c++) {
          const targetNum = children[childIdx++];
          childrenByParent.get(sourceNum)?.push(targetNum);
          if (!nodesWithChildren.has(sourceNum)) {
            nodesWithChildren.add(sourceNum);
          }

          const edge = {
            id: `edge-${nodes[sourceNum].id}-${nodes[targetNum].id}`,
            type: 'edge',
            source: nodes[sourceNum].id,
            target: nodes[targetNum].id,
            data: {
              index: i++,
              tag: '250kbs'
            }
          };
          edges.push(edge);
        }
      }
    }

    // Create groups for leaf nodes
    let groupIndex = 1;
    childrenByParent.forEach((childIndices) => {
      // Filter to only include leaf nodes (nodes with no children)
      const leafChildren = childIndices.filter((idx) => !nodesWithChildren.has(idx));
      if (leafChildren.length >= 1) {
        const siblingNodes = leafChildren.map((idx) => nodes[idx]);
        createGroup(siblingNodes, 'Group', groupIndex++);
      }
    });
  } else {
    const nodesPerGroup = Math.floor((numNodes - 2) / numGroups);
    for (let i = 0; i < numGroups; i++) {
      createGroup(nodes.slice(i * nodesPerGroup, (i + 1) * nodesPerGroup), 'Group', i + 1);
    }

    for (let i = 0; i < numEdges; i++) {
      const sourceNum = getRandomNode(numNodes);
      const targetNum = getRandomNode(numNodes, sourceNum);
      const edge = {
        id: `edge-${nodes[sourceNum].id}-${nodes[targetNum].id}`,
        type: 'edge',
        source: nodes[sourceNum].id,
        target: nodes[targetNum].id,
        data: {
          index: i,
          tag: '250kbs'
        }
      };
      edges.push(edge);
    }
  }

  nodes.push(...groups);

  return { nodes, edges };
};
