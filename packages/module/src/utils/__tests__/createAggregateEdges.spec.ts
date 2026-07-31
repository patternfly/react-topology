import { createAggregateEdges, AggregateEdgesOptions } from '../createAggregateEdges';
import { EdgeModel, NodeModel } from '../../types';

const node = (id: string, extras: Partial<NodeModel> = {}): NodeModel => ({
  id,
  type: 'node',
  ...extras
});

const group = (id: string, children: string[], extras: Partial<NodeModel> = {}): NodeModel => ({
  id,
  type: 'group',
  group: true,
  children,
  ...extras
});

const edge = (source: string, target: string, id?: string): EdgeModel => ({
  id: id || `${source}_${target}`,
  type: 'edge',
  source,
  target
});

const aggregate = (edges: EdgeModel[], nodes: NodeModel[], options?: AggregateEdgesOptions) =>
  createAggregateEdges('aggregate-edge', edges, nodes, options);

const visibleEdges = (result: EdgeModel[]) => result.filter((e) => e.visible !== false);
const aggregates = (result: EdgeModel[]) => result.filter((e) => e.type === 'aggregate-edge');
const byRole = (result: EdgeModel[], role: string) => aggregates(result).filter((e) => e.data?.role === role);

describe('createAggregateEdges', () => {
  describe('default / collapsedGroups', () => {
    const nodes = [
      node('n1'),
      node('n2'),
      node('n3'),
      node('n4'),
      group('g1', ['n1', 'n2'], { collapsed: true }),
      group('g2', ['n3', 'n4'], { collapsed: true })
    ];

    it('leaves unremapped edges unchanged', () => {
      const nodesOpen = [
        node('n1'),
        node('n2'),
        group('g1', ['n1'], { collapsed: false }),
        group('g2', ['n2'], { collapsed: false })
      ];
      const edges = [edge('n1', 'n2')];
      const result = aggregate(edges, nodesOpen);
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ id: 'n1_n2', visible: true });
      expect(aggregates(result)).toHaveLength(0);
    });

    it('does not create an aggregate for a single remapped edge (collapse anchors handle it)', () => {
      const edges = [edge('n1', 'n3')];
      const result = aggregate(edges, nodes);
      expect(aggregates(result)).toHaveLength(0);
      expect(visibleEdges(result)).toHaveLength(1);
      expect(result[0].visible).toBe(true);
    });

    it('aggregates parallel edges between the same collapsed groups', () => {
      const edges = [edge('n1', 'n3'), edge('n2', 'n4')];
      const result = aggregate(edges, nodes);
      const aggs = aggregates(result);
      expect(aggs).toHaveLength(1);
      expect(aggs[0]).toMatchObject({
        source: 'g1',
        target: 'g2',
        children: ['n1_n3', 'n2_n4']
      });
      expect(aggs[0].data.count).toBe(2);
      expect(visibleEdges(result).map((e) => e.id)).toEqual(['aggregate_g1_g2']);
    });

    it('hides edges internal to a collapsed group', () => {
      const edges = [edge('n1', 'n2')];
      const result = aggregate(edges, nodes);
      expect(result[0].visible).toBe(false);
      expect(aggregates(result)).toHaveLength(0);
    });

    it('marks aggregates bidirectional when directions differ', () => {
      const edges = [edge('n1', 'n3'), edge('n4', 'n2')];
      const result = aggregate(edges, nodes);
      const agg = aggregates(result)[0];
      expect(agg.data.bidirectional).toBe(true);
      expect(agg.data.forwardEdgeIds).toEqual(['n1_n3']);
      expect(agg.data.reverseEdgeIds).toEqual(['n4_n2']);
    });

    it('does not mark same-direction parallel edges as bidirectional', () => {
      const edges = [edge('n1', 'n3'), edge('n2', 'n4')];
      const result = aggregate(edges, nodes);
      const agg = aggregates(result)[0];
      expect(agg.data.bidirectional).toBe(false);
      expect(agg.data.forwardEdgeIds).toEqual(['n1_n3', 'n2_n4']);
      expect(agg.data.reverseEdgeIds).toEqual([]);
    });

    it('can disable collapsed aggregation', () => {
      const edges = [edge('n1', 'n3'), edge('n2', 'n4')];
      const result = aggregate(edges, nodes, { collapsedGroups: false });
      expect(aggregates(result)).toHaveLength(0);
      expect(visibleEdges(result)).toHaveLength(2);
    });
  });

  describe('groupEdges', () => {
    /**
     * Graph
     * ├── Group A
     * │   ├── n1, n2
     * │   └── SubA (n3)
     * ├── Group B (n4, n5)
     * ├── Group C
     * │   └── SubC (n6)
     * └── n7 (ungrouped)
     */
    const nodes = [
      node('n1'),
      node('n2'),
      node('n3'),
      node('n4'),
      node('n5'),
      node('n6'),
      node('n7'),
      group('SubA', ['n3']),
      group('A', ['n1', 'n2', 'SubA']),
      group('B', ['n4', 'n5']),
      group('SubC', ['n6']),
      group('C', ['SubC'])
    ];

    const opts: AggregateEdgesOptions = { collapsedGroups: false, groupEdges: true };

    it('splits a cross-group edge into exit, bridge, and entry segments', () => {
      const edges = [edge('n1', 'n4')];
      const result = aggregate(edges, nodes, opts);
      const visible = visibleEdges(result);

      expect(result.find((e) => e.id === 'n1_n4')?.visible).toBe(false);
      expect(byRole(result, 'exit')).toEqual([
        expect.objectContaining({ source: 'n1', target: 'A', data: expect.objectContaining({ role: 'exit' }) })
      ]);
      expect(byRole(result, 'bridge')).toEqual([
        expect.objectContaining({
          source: 'A',
          target: 'B',
          data: expect.objectContaining({ role: 'bridge', count: 1 })
        })
      ]);
      expect(byRole(result, 'entry')).toEqual([
        expect.objectContaining({ source: 'B', target: 'n4', data: expect.objectContaining({ role: 'entry' }) })
      ]);
      expect(visible).toHaveLength(3);
    });

    it('merges bridges and shared stubs across parallel leaf edges', () => {
      const edges = [edge('n1', 'n4'), edge('n2', 'n5'), edge('n1', 'n5')];
      const result = aggregate(edges, nodes, opts);

      expect(byRole(result, 'bridge')).toHaveLength(1);
      expect(byRole(result, 'bridge')[0].data.count).toBe(3);
      expect(byRole(result, 'bridge')[0].data.aggregatedEdgeIds).toEqual(['n1_n4', 'n2_n5', 'n1_n5']);
      // Same direction only — must not look bidirectional just because leaf sources differ.
      expect(byRole(result, 'bridge')[0].data.bidirectional).toBe(false);
      expect(byRole(result, 'bridge')[0].data.forwardEdgeIds).toEqual(['n1_n4', 'n2_n5', 'n1_n5']);
      expect(byRole(result, 'bridge')[0].data.reverseEdgeIds).toEqual([]);

      // Exits: n1→A (2 leafs), n2→A (1 leaf)
      const exits = byRole(result, 'exit');
      expect(exits).toHaveLength(2);
      expect(exits.find((e) => e.source === 'n1')?.data.count).toBe(2);
      expect(exits.find((e) => e.source === 'n2')?.data.count).toBe(1);

      // Entries: B→n4, B→n5
      const entries = byRole(result, 'entry');
      expect(entries).toHaveLength(2);
      expect(entries.find((e) => e.target === 'n4')?.data.count).toBe(1);
      expect(entries.find((e) => e.target === 'n5')?.data.count).toBe(2);
    });

    it('marks group bridges bidirectional only when leaf directions oppose', () => {
      const edges = [edge('n1', 'n4'), edge('n5', 'n2')];
      const result = aggregate(edges, nodes, opts);
      const bridge = byRole(result, 'bridge')[0];
      expect(bridge.data.bidirectional).toBe(true);
      expect(bridge.data.forwardEdgeIds).toEqual(['n1_n4']);
      expect(bridge.data.reverseEdgeIds).toEqual(['n5_n2']);
    });

    it('keeps exit/entry stubs separate per bridge peer', () => {
      // n1 → n4 (bridge A-B) and n1 → n6 (bridge A-SubC) must not share an exit stub.
      const edges = [edge('n1', 'n4'), edge('n1', 'n6')];
      const result = aggregate(edges, nodes, opts);
      const exitsFromN1 = byRole(result, 'exit').filter((e) => e.source === 'n1');
      expect(exitsFromN1).toHaveLength(2);
      expect(new Set(exitsFromN1.map((e) => e.data.bridgeKey)).size).toBe(2);
      expect(byRole(result, 'bridge')).toHaveLength(2);
    });

    it('leaves edges between sibling nodes in the same group unchanged', () => {
      const edges = [edge('n1', 'n2')];
      const result = aggregate(edges, nodes, opts);
      expect(aggregates(result)).toHaveLength(0);
      expect(result[0]).toMatchObject({ id: 'n1_n2', visible: true, source: 'n1', target: 'n2' });
    });

    it('aggregates ungrouped node to group contents (bridge + entry, no exit)', () => {
      const edges = [edge('n7', 'n4'), edge('n7', 'n5')];
      const result = aggregate(edges, nodes, opts);

      expect(byRole(result, 'exit')).toHaveLength(0);
      expect(byRole(result, 'bridge')).toEqual([
        expect.objectContaining({ source: 'n7', target: 'B', data: expect.objectContaining({ count: 2 }) })
      ]);
      expect(byRole(result, 'entry')).toHaveLength(2);
    });

    it('links nested subgroup member to sibling via SubA → A bridge', () => {
      // n3 in SubA under A; n1 direct child of A
      const edges = [edge('n3', 'n1')];
      const result = aggregate(edges, nodes, opts);

      expect(byRole(result, 'exit')[0]).toMatchObject({ source: 'n3', target: 'SubA' });
      expect(byRole(result, 'bridge')[0]).toMatchObject({ source: 'SubA', target: 'A' });
      expect(byRole(result, 'entry')[0]).toMatchObject({ source: 'A', target: 'n1' });
    });

    it('uses immediate parents for nested cross-group edges', () => {
      // n3 (SubA) → n4 (B): exit n3→SubA, bridge SubA→B, entry B→n4
      const edges = [edge('n3', 'n4')];
      const result = aggregate(edges, nodes, opts);

      expect(byRole(result, 'exit')[0]).toMatchObject({ source: 'n3', target: 'SubA' });
      expect(byRole(result, 'bridge')[0]).toMatchObject({ source: 'SubA', target: 'B' });
      expect(byRole(result, 'entry')[0]).toMatchObject({ source: 'B', target: 'n4' });
    });

    it('aggregates subgroup ↔ subgroup across different parents via immediate parents', () => {
      const edges = [edge('n3', 'n6')];
      const result = aggregate(edges, nodes, opts);

      expect(byRole(result, 'bridge')[0]).toMatchObject({ source: 'SubA', target: 'SubC' });
      expect(byRole(result, 'exit')[0]).toMatchObject({ source: 'n3', target: 'SubA' });
      expect(byRole(result, 'entry')[0]).toMatchObject({ source: 'SubC', target: 'n6' });
    });

    it('hides edges from a node to its ancestor group', () => {
      const edges = [edge('n3', 'A')];
      const result = aggregate(edges, nodes, opts);
      expect(result.find((e) => e.id === 'n3_A')?.visible).toBe(false);
      expect(aggregates(result)).toHaveLength(0);
    });

    it('keeps a direct edge from an ungrouped node to a top-level group', () => {
      // Both ends sit at graph level — already the desired node→group link.
      const edges = [edge('n7', 'B')];
      const result = aggregate(edges, nodes, opts);
      expect(aggregates(result)).toHaveLength(0);
      expect(result[0]).toMatchObject({ id: 'n7_B', visible: true, source: 'n7', target: 'B' });
    });

    it('treats a nested group id as a bridge terminus (no entry past the group)', () => {
      const edges = [edge('n7', 'SubC')];
      const result = aggregate(edges, nodes, opts);

      expect(byRole(result, 'exit')).toHaveLength(0);
      expect(byRole(result, 'entry')).toHaveLength(0);
      expect(byRole(result, 'bridge')).toEqual([
        expect.objectContaining({
          source: 'n7',
          target: 'SubC',
          data: expect.objectContaining({ role: 'bridge' })
        })
      ]);
    });

    it('does not remap edges between ungrouped nodes', () => {
      const nodesWithExtra = [...nodes, node('n8')];
      const edges = [edge('n7', 'n8')];
      const result = aggregate(edges, nodesWithExtra, opts);
      expect(aggregates(result)).toHaveLength(0);
      expect(result[0].visible).toBe(true);
    });

    it('stores bridgeId on stubs for O(1) bridge lookup', () => {
      const edges = [edge('n1', 'n4')];
      const result = aggregate(edges, nodes, opts);
      const exit = byRole(result, 'exit')[0];
      const bridge = byRole(result, 'bridge')[0];
      const entry = byRole(result, 'entry')[0];

      expect(exit.data.bridgeId).toBe(bridge.id);
      expect(entry.data.bridgeId).toBe(bridge.id);
      expect(bridge.data.bridgeId).toBeUndefined();
    });

    it('places a leaf label on the bridge so multi-part paths keep one label', () => {
      const edges = [{ ...edge('n1', 'n4'), label: 'traffic' }];
      const result = aggregate(edges, nodes, opts);

      const bridge = byRole(result, 'bridge')[0];
      expect(bridge.label).toBe('traffic');
      expect(bridge.data.labels).toEqual(['traffic']);
      expect(byRole(result, 'exit')[0].label).toBeUndefined();
      expect(byRole(result, 'entry')[0].label).toBeUndefined();
    });

    it('merges distinct leaf labels onto the shared bridge without dropping them for count', () => {
      const edges = [
        { ...edge('n1', 'n4'), label: 'traffic' },
        { ...edge('n2', 'n5'), label: 'sync' },
        edge('n1', 'n5')
      ];
      const result = aggregate(edges, nodes, opts);
      const bridge = byRole(result, 'bridge')[0];

      expect(bridge.data.count).toBe(3);
      expect(bridge.label).toBe('traffic, sync');
      expect(bridge.data.labels).toEqual(['traffic', 'sync']);
    });
  });

  describe('collapsedGroups + groupEdges together', () => {
    it('applies collapse then splits remaining cross-group path', () => {
      const nodes = [
        node('n1'),
        node('n2'),
        node('n3'),
        node('n4'),
        group('SubB', ['n3', 'n4'], { collapsed: true }),
        group('A', ['n1', 'n2']),
        group('B', ['SubB'])
      ];
      // After collapse, n3/n4 display as SubB (a group). Edge n1→SubB:
      // exit n1→A, bridge A→SubB (group terminus, no entry into B).
      const edges = [edge('n1', 'n3'), edge('n2', 'n4')];
      const result = aggregate(edges, nodes, { collapsedGroups: true, groupEdges: true });

      expect(byRole(result, 'bridge')).toHaveLength(1);
      expect(byRole(result, 'bridge')[0]).toMatchObject({
        source: 'A',
        target: 'SubB',
        data: expect.objectContaining({ count: 2 })
      });
      expect(byRole(result, 'exit')).toHaveLength(2);
      expect(byRole(result, 'entry')).toHaveLength(0);
    });

    it('bridges parallel edges between two collapsed top-level groups', () => {
      const nodes = [
        node('n1'),
        node('n2'),
        node('n3'),
        node('n4'),
        group('g1', ['n1', 'n2'], { collapsed: true }),
        group('g2', ['n3', 'n4'], { collapsed: true })
      ];
      const edges = [edge('n1', 'n3'), edge('n2', 'n4')];
      const result = aggregate(edges, nodes, { collapsedGroups: true, groupEdges: true });

      expect(byRole(result, 'exit')).toHaveLength(0);
      expect(byRole(result, 'entry')).toHaveLength(0);
      expect(byRole(result, 'bridge')).toEqual([
        expect.objectContaining({
          source: 'g1',
          target: 'g2',
          data: expect.objectContaining({ role: 'bridge', count: 2 })
        })
      ]);
      expect(visibleEdges(result).map((e) => e.id)).toEqual([expect.stringMatching(/^aggregate_bridge_/)]);
    });
  });

  describe('edge cases', () => {
    it('returns empty array for undefined edges', () => {
      expect(createAggregateEdges('aggregate-edge', undefined, [])).toEqual([]);
    });

    it('returns empty array when nodes are missing', () => {
      const edges = [edge('n1', 'n2')];
      expect(createAggregateEdges('aggregate-edge', edges, undefined)).toEqual([]);
      expect(createAggregateEdges('aggregate-edge', edges, [])).toEqual([]);
    });
  });
});
