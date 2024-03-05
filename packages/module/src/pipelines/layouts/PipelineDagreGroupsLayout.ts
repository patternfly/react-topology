import { Graph, Layout } from '../../types';
import { NODE_SEPARATION_HORIZONTAL, NODE_SEPARATION_VERTICAL } from '../const';
import { DagreLayoutOptions, LEFT_TO_RIGHT } from '../../layouts/DagreLayout';
import { DagreGroupsLayout } from '../../layouts/DagreGroupsLayout';

export class PipelineDagreGroupsLayout extends DagreGroupsLayout implements Layout {
  constructor(graph: Graph, options?: Partial<DagreLayoutOptions>) {
    super(graph, {
      linkDistance: 0,
      nodeDistance: 0,
      groupDistance: 0,
      collideDistance: 0,
      simulationSpeed: 0,
      chargeStrength: 0,
      allowDrag: false,
      layoutOnDrag: false,
      nodesep: NODE_SEPARATION_VERTICAL,
      ranksep: NODE_SEPARATION_HORIZONTAL,
      edgesep: 50,
      ranker: 'tight-tree',
      rankdir: LEFT_TO_RIGHT,
      marginx: 20,
      marginy: 20,
      ...options
    });
  }
  set nodesep(nodesep: number) {
    this.dagreOptions.nodesep = nodesep;
  }
  set ranksep(ranksep: number) {
    this.dagreOptions.ranksep = ranksep;
  }
}
