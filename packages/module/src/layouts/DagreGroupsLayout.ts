import * as dagre from 'dagre';
import { Edge, Graph, GRAPH_LAYOUT_END_EVENT, Layout, Node } from '../types';
import { BaseLayout, LAYOUT_DEFAULTS } from './BaseLayout';
import { LayoutLink } from './LayoutLink';
import { LayoutNode } from './LayoutNode';
import { DagreNode } from './DagreNode';
import { DagreLink } from './DagreLink';
import { DagreLayoutOptions, LEFT_TO_RIGHT } from './DagreLayout';
import { LayoutGroup } from './LayoutGroup';
import { Point } from '../geom';
import { getClosestVisibleParent, getGroupChildrenDimensions } from '../utils';

export class DagreGroupsLayout extends BaseLayout implements Layout {
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
      rankdir: LEFT_TO_RIGHT,
      ranker: 'tight-tree',
      ...options
    };
  }

  protected createLayoutNode(node: Node, nodeDistance: number, index: number) {
    return new DagreNode(node, nodeDistance, index);
  }

  protected createLayoutLink(edge: Edge, source: LayoutNode, target: LayoutNode, isFalse: boolean = false): LayoutLink {
    return new DagreLink(edge, source, target, isFalse);
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

  protected getAllLeaves(group: LayoutGroup): LayoutNode[] {
    const leaves = [...group.leaves];
    group.groups?.forEach(subGroup => leaves.push(...this.getAllLeaves(subGroup)));
    return leaves;
  }
  protected getAllSubGroups(group: LayoutGroup): LayoutGroup[] {
    const groups = [...group.groups];
    group.groups?.forEach(subGroup => groups.push(...this.getAllSubGroups(subGroup)));
    return groups;
  }

  protected isNodeInGroups(node: LayoutNode, groups: LayoutGroup[]): boolean {
    return !!groups.find(group => group.leaves.includes(node) || this.isNodeInGroups(node, group.groups));
  }

  protected getEdgeLayoutNode(nodes: LayoutNode[], groups: LayoutGroup[], node: Node | null): LayoutNode | undefined {
    if (!node) {
      return undefined;
    }

    let layoutNode = nodes.find(n =>  n.id === node.getId());
    if (!layoutNode) {
      const groupNode = groups.find(n =>  n.id === node.getId());
      if (groupNode) {
        const dagreNode = new DagreNode(groupNode.element, groupNode.padding);
        if (dagreNode) {
          return dagreNode;
        }
      }
    }

    if (!layoutNode && node.getNodes().length) {
      const id = node.getChildren()[0].getId();
      layoutNode = nodes.find(n => n.id === id);
    }
    if (!layoutNode) {
      layoutNode = this.getEdgeLayoutNode(nodes, groups, getClosestVisibleParent(node));
    }

    return layoutNode;
  }

  protected getLinks(edges: Edge[]): LayoutLink[] {
    const links: LayoutLink[] = [];
    edges.forEach(e => {
      const source = this.getEdgeLayoutNode(this.nodes, this.groups, e.getSource());
      const target = this.getEdgeLayoutNode(this.nodes, this.groups, e.getTarget());
      if (source && target) {
        this.initializeEdgeBendpoints(e);
        links.push(this.createLayoutLink(e, source, target));
      }
    });

    return links;
  }

  protected startLayout(graph: Graph, initialRun: boolean, addingNodes: boolean): void {
    if (initialRun || addingNodes) {
      const doLayout = (parentGroup?: LayoutGroup) => {
        const dagreGraph = new dagre.graphlib.Graph({compound: true});
        const options = {...this.dagreOptions};

        Object.keys(LAYOUT_DEFAULTS).forEach(key => delete options[key]);
        dagreGraph.setGraph(options);

        // Determine the groups, nodes, and edges that belong in this layout
        const layerGroups = this.groups.filter((group) => group.parent?.id === parentGroup?.id || (!parentGroup && group.parent?.id === graph.getId()));
        const layerNodes = this.nodes.filter((n) => n.element.getParent()?.getId() === parentGroup?.id || !parentGroup && n.element.getParent()?.getId() === graph.getId());
        const layerEdges = this.edges.filter((edge) =>
          (layerGroups.find((n) => n.id === edge.sourceNode.id) || layerNodes.find((n) => n.id === edge.sourceNode.id)) &&
          (layerGroups.find((n) => n.id === edge.targetNode.id) || layerNodes.find((n) => n.id === edge.targetNode.id))
        );

        // Layout any child groups first
        layerGroups.forEach((group) => {
          doLayout(group);

          // Add the child group node (now with the correct dimensions) to the graph
          const dagreNode = new DagreNode(group.element, group.padding);
          const updateNode = dagreNode.getUpdatableNode();
          dagreGraph.setNode(group.id, updateNode);
        });

        layerNodes?.forEach(node => {
          const updateNode = (node as DagreNode).getUpdatableNode();
          dagreGraph.setNode(node.id, updateNode);
        });

        layerEdges?.forEach(dagreEdge => {
          dagreGraph.setEdge(dagreEdge.source.id, dagreEdge.target.id, dagreEdge);
        });

        dagre.layout(dagreGraph);

        // Update the node element positions
        layerNodes.forEach(node => {
          (node as DagreNode).updateToNode(dagreGraph.node(node.id));
        });

        // Update the group element positions (setting the group's positions updates its children)
        layerGroups.forEach(node => {
          const dagreNode = dagreGraph.node(node.id);
          node.element.setPosition(new Point(dagreNode.x, dagreNode.y));
        });

        this.updateEdgeBendpoints(this.edges as DagreLink[]);

        // now that we've laid out the children, set the dimensions on the group (not on the graph)
        if (parentGroup) {
          parentGroup.element.setDimensions(getGroupChildrenDimensions(parentGroup.element));
        }
      }

      doLayout();
    }

    if (this.dagreOptions.layoutOnDrag) {
      this.forceSimulation.useForceSimulation(this.nodes, this.edges, this.getFixedNodeDistance);
    } else {
      this.graph.getController().fireEvent(GRAPH_LAYOUT_END_EVENT, {graph: this.graph});
    }
  }
}
