import * as React from 'react';
import {
  GraphElement,
  ComponentFactory,
  ModelKind,
  SpacerNode,
  DEFAULT_SPACER_NODE_TYPE,
  withSelection,
  withPanZoom,
  GraphComponent,
  TaskEdge
} from '@patternfly/react-topology';
import DemoTaskNode from './DemoTaskNode';
import DemoTaskGroup from './DemoTaskGroup';

const pipelineGroupsComponentFactory: ComponentFactory = (
  kind: ModelKind,
  type: string
): React.ComponentType<{ element: GraphElement }> | undefined => {
  if (kind === ModelKind.graph) {
    return withPanZoom()(GraphComponent);
  }
  switch (type) {
    case 'Execution':
      return DemoTaskGroup;
    case 'Task':
      return withSelection()(DemoTaskNode);
    case DEFAULT_SPACER_NODE_TYPE:
      return SpacerNode;
    case 'edge':
      return TaskEdge;
    default:
      return undefined;
  }
};

export default pipelineGroupsComponentFactory;
