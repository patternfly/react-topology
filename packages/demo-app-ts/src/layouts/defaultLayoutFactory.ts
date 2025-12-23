import {
  Graph,
  Layout,
  LayoutFactory,
  ForceLayout,
  ColaLayout,
  ConcentricLayout,
  DagreLayout,
  GridLayout,
  BreadthFirstLayout,
  ColaGroupsLayout,
  LEFT_TO_RIGHT
} from '@patternfly/react-topology';

export enum LayoutType {
  BreadthFirst = 'BreadthFirst',
  ColaGroups = 'ColaGroupsLayout',
  Cola = 'ColaLayout',
  ColaNoForce = 'ColaNoForceLayout',
  Concentric = 'ConcentricLayout',
  Dagre = 'DagreLayout',
  DagreHorizontal = 'DagreHorizontalLayout',
  Force = 'ForceLayout',
  Grid = 'GridLayout'
}

const defaultLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {
  switch (type) {
    case LayoutType.BreadthFirst:
      return new BreadthFirstLayout(graph);
    case LayoutType.Cola:
      return new ColaLayout(graph);
    case LayoutType.ColaNoForce:
      return new ColaLayout(graph, { layoutOnDrag: false });
    case LayoutType.Concentric:
      return new ConcentricLayout(graph);
    case LayoutType.Dagre:
      return new DagreLayout(graph);
    case LayoutType.DagreHorizontal:
      return new DagreLayout(graph, { rankdir: LEFT_TO_RIGHT });
    case LayoutType.Force:
      return new ForceLayout(graph);
    case LayoutType.Grid:
      return new GridLayout(graph);
    case LayoutType.ColaGroups:
      return new ColaGroupsLayout(graph, { layoutOnDrag: false });
    default:
      return new ColaLayout(graph, { layoutOnDrag: false });
  }
};

export default defaultLayoutFactory;
