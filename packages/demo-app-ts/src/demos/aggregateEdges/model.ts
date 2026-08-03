import { EdgeModel, NodeModel, NodeShape, createAggregateEdges, Model } from '@patternfly/react-topology';

const COLLAPSED_SIZE = 60;

export interface DemoOptions {
  groupEdges: boolean;
  /**
   * Live collapsed group ids from the controller. Used only to feed
   * createAggregateEdges — never written onto NodeModels returned for fromModel
   * (Node.isCollapsed() remains the source of truth).
   */
  collapsedIds?: Set<string>;
}

const leaf = (id: string, label: string): NodeModel => ({
  id,
  type: 'node',
  label,
  width: 40,
  height: 40,
  shape: NodeShape.ellipse
});

const groupNode = (id: string, label: string, children: string[]): NodeModel => ({
  id,
  type: 'group',
  label,
  group: true,
  children,
  style: { padding: 20 },
  data: {
    collapsedWidth: COLLAPSED_SIZE,
    collapsedHeight: COLLAPSED_SIZE
  }
});

/** Demo byte-rate formatter (NetObserv-style: scale then append unit). */
const formatBps = (bps: number): string => {
  if (bps >= 1_000_000) {
    return `${(bps / 1_000_000).toFixed(1)} MBps`;
  }
  if (bps >= 1_000) {
    return `${(bps / 1_000).toFixed(1)} kBps`;
  }
  return `${Math.round(bps)} Bps`;
};

/**
 * After structural aggregation, sum leaf metrics onto the label-bearing bridge
 * and format a single tag — mirrors how NetObserv should merge byte rates.
 */
const applyMetricTags = (edges: EdgeModel[]): EdgeModel[] => {
  const byId = new Map(edges.map((e) => [e.id, e]));

  edges.forEach((edge) => {
    const role = edge.data?.role as string | undefined;
    const leafIds: string[] = edge.data?.aggregatedEdgeIds || [];
    if (!leafIds.length) {
      // Non-aggregate leaf: format its own bps if present.
      if (typeof edge.data?.bps === 'number' && edge.data.bps > 0) {
        edge.data = { ...edge.data, tag: formatBps(edge.data.bps) };
      }
      return;
    }

    // Put the summed metric on the bridge only (one tag along a multi-part path).
    if (role && role !== 'bridge') {
      return;
    }

    const bps = leafIds.reduce((sum, id) => sum + (byId.get(id)?.data?.bps || 0), 0);
    if (bps > 0) {
      edge.data = { ...edge.data, bps, tag: formatBps(bps) };
    }
  });

  return edges;
};

const link = (source: string, target: string, options: { label?: string; bps?: number } = {}): EdgeModel => ({
  id: `${source}_${target}`,
  type: 'edge',
  source,
  target,
  ...(options.label ? { label: options.label } : {}),
  ...(options.bps != null ? { data: { bps: options.bps } } : {})
});

export const getModel = ({ groupEdges, collapsedIds }: DemoOptions): Model => {
  const group1Nodes = [leaf('11', '1-1'), leaf('12', '1-2'), leaf('13', '1-3')];
  const group2Nodes = [leaf('21', '2-1'), leaf('22', '2-2'), leaf('23', '2-3'), leaf('24', '2-4'), leaf('25', '2-5')];
  const subGroup1Nodes = [leaf('14', '1-4'), leaf('15', '1-5')];
  const subGroup3Nodes = [leaf('31', '3-1'), leaf('32', '3-2'), leaf('33', '3-3')];

  const subGroup1 = groupNode(
    'Subgroup 1',
    'Subgroup 1',
    subGroup1Nodes.map((n) => n.id)
  );
  const subGroup3 = groupNode(
    'Subgroup 3',
    'Subgroup 3',
    subGroup3Nodes.map((n) => n.id)
  );
  const group1 = groupNode('Group 1', 'Group 1', [...group1Nodes.map((n) => n.id), subGroup1.id]);
  const group2 = groupNode(
    'Group 2',
    'Group 2',
    group2Nodes.map((n) => n.id)
  );
  const group3 = groupNode('Group 3', 'Group 3', [subGroup3.id]);

  const ungrouped = [leaf('1', 'One'), leaf('2', 'Two')];

  const nodes: NodeModel[] = [
    ...ungrouped,
    ...group1Nodes,
    ...subGroup1Nodes,
    ...group2Nodes,
    ...subGroup3Nodes,
    group1,
    group2,
    subGroup1,
    subGroup3,
    group3
  ];

  // Stamp collapse for createAggregateEdges only — stripped before return.
  if (collapsedIds?.size) {
    nodes.forEach((n) => {
      if (collapsedIds.has(n.id)) {
        n.collapsed = true;
      }
    });
  }

  const edges: EdgeModel[] = [
    // Intra-group edges (should stay visible when aggregating between groups)
    link('11', '12', { label: 'local', bps: 120 }),
    link('12', '13', { bps: 80 }),
    link('14', '15', { bps: 40 }),
    link('21', '22', { bps: 60 }),
    link('22', '23', { bps: 90 }),
    link('24', '25', { bps: 50 }),
    link('31', '32', { bps: 70 }),
    link('32', '33', { bps: 30 }),
    // Group 1 → Group 2  (bridge should sum these rates)
    link('11', '21', { label: 'traffic', bps: 400 }),
    link('12', '21', { bps: 500 }),
    link('13', '21', { bps: 300 }),
    // Ungrouped → Subgroup 3 members
    link('1', '31', { label: 'ingress', bps: 250 }),
    link('1', '32', { bps: 150 }),
    link('2', '31', { bps: 200 }),
    // Node → group id (ungrouped node targets the group itself)
    link('2', 'Group 2', { label: 'attach', bps: 180 }),
    link('1', 'Subgroup 3', { bps: 100 }),
    // Group 2 ↔ Subgroup 3 (bidirectional mix)
    link('21', '31', { label: 'mesh', bps: 350 }),
    link('32', '21', { bps: 220 }),
    link('21', '32', { bps: 180 }),
    link('22', '31', { bps: 140 }),
    link('22', '32', { bps: 160 }),
    // Subgroup ↔ subgroup under different parents
    link('14', '31', { label: 'peer', bps: 90 }),
    link('15', '32', { bps: 110 }),
    link('33', '14', { bps: 75 }),
    // Cross nest: Group 2 member → Group 1
    link('23', '11', { label: 'sync', bps: 450 })
  ];

  let resultEdges = createAggregateEdges('aggregate-edge', edges, nodes, {
    groupEdges,
    collapsedGroups: true
  });

  // Drop collapsed so fromModel merge does not re-call setCollapsed.
  nodes.forEach((n) => {
    delete n.collapsed;
  });

  resultEdges = applyMetricTags(resultEdges);

  return {
    graph: {
      id: 'g1',
      type: 'graph',
      layout: 'Cola'
    },
    nodes,
    edges: resultEdges
  };
};
