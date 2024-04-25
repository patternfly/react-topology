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
  EdgeTerminalType.none,
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
    status: NODE_STATUSES[index % NODE_STATUSES.length],
  }
});

export const generateDataModel = (
  numNodes: number,
  numGroups: number,
  numEdges: number,
  groupDepth: number = 0,
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
        objectType: 'GN',
      }
    };
    if (level === groupDepth) {
      group.children = childNodes.map(n => n.id);
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
        tag: '250kbs',
      },
    };
    edges.push(edge);
  }

  nodes.push(...groups);

  return { nodes, edges };
};
