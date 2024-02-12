import * as dagre from 'dagre';
import { Edge, Graph, GRAPH_LAYOUT_END_EVENT, Layout, Node } from '../types';
import { BaseLayout, LAYOUT_DEFAULTS } from './BaseLayout';
import { LayoutOptions } from './LayoutOptions';
import { LayoutLink } from './LayoutLink';
import { LayoutNode } from './LayoutNode';
import { DagreNode } from './DagreNode';
import { DagreGroup } from './DagreGroup';
import { DagreLink } from './DagreLink';

export type DagreLayoutOptions = LayoutOptions & dagre.GraphLabel & { ignoreGroups?: boolean };

export class DagreLayout extends BaseLayout implements Layout {
  protected dagreOptions: DagreLayoutOptions;

  constructor(graph: Graph, options?: Partial<DagreLayoutOptions>) {
    super(graph, options);
    this.dagreOptions = {
      ...this.options,
      layoutOnDrag: false,
      marginx: 0,
      marginy: 0,
      nodesep: this.options.nodeDistance,
      edgesep: this.options.linkDistance,
      ranker: 'tight-tree',
      rankdir: 'TB',
      ...options
    };
  }

  protected createLayoutNode(node: Node, nodeDistance: number, index: number) {
    return new DagreNode(node, nodeDistance, index);
  }

  protected createLayoutLink(edge: Edge, source: LayoutNode, target: LayoutNode, isFalse: boolean): LayoutLink {
    return new DagreLink(edge, source, target, isFalse);
  }

  protected createLayoutGroup(node: Node, padding: number, index: number) {
    return new DagreGroup(node, padding, index);
  }

  protected updateEdgeBendpoints(edges: DagreLink[]): void {
    edges.forEach(edge => {
      const link = edge as DagreLink;
      link.updateBendpoints();
    });
  }

  protected getFauxEdges(): LayoutLink[] {
    return [];
  }

  protected startLayout(graph: Graph, initialRun: boolean, addingNodes: boolean): void {
    if (initialRun || addingNodes) {
      const dagreGraph = new dagre.graphlib.Graph({ compound: true });
      const options = { ...this.dagreOptions };
      Object.keys(LAYOUT_DEFAULTS).forEach(key => delete options[key]);
      dagreGraph.setGraph(options);

      if (!this.dagreOptions.ignoreGroups) {
        this.groups.forEach(group => {
          dagreGraph.setNode(group.id, group);
          dagreGraph.setParent(group.id, group.element.getParent().getId());
        });
      }

      this.nodes?.forEach(node => {
        const updateNode = (node as DagreNode).getUpdatableNode();
        dagreGraph.setNode(node.id, updateNode);
        if (!this.dagreOptions.ignoreGroups) {
          dagreGraph.setParent(node.id, node.element.getParent().getId());
        }
      });

      this.edges?.forEach(dagreEdge => {
        dagreGraph.setEdge(dagreEdge.source.id, dagreEdge.target.id, dagreEdge);
      });

      dagre.layout(dagreGraph);
      this.nodes.forEach(node => {
        (node as DagreNode).updateToNode(dagreGraph.node(node.id));
      });

      this.updateEdgeBendpoints(this.edges as DagreLink[]);
    }

    if (this.dagreOptions.layoutOnDrag) {
      this.forceSimulation.useForceSimulation(this.nodes, this.edges, this.getFixedNodeDistance);
    } else {
      this.graph.getController().fireEvent(GRAPH_LAYOUT_END_EVENT, { graph: this.graph });
    }
  }
}
