import * as React from 'react';
import {
  GraphElement,
  ComponentFactory,
  ModelKind,
  SpacerNode,
  DEFAULT_SPACER_NODE_TYPE,
  withSelection,
  withPanZoom,
  GraphComponent
} from '@patternfly/react-topology';
import DemoTaskNode from './DemoTaskNode';
import DemoTaskGroup from './DemoTaskGroup';
import DemoTaskEdge from './DemoTaskEdge';

const pipelineGroupsComponentFactory: ComponentFactory = (
  kind: ModelKind,
  type: string
): React.ComponentType<{ element: GraphElement }> | undefined => {
  if (kind === ModelKind.graph) {
    return withPanZoom()(withSelection()(GraphComponent));
  }
  switch (type) {
    case 'Execution':
    case 'EXECUTION_TASK_NODE':
      return withSelection()(DemoTaskGroup);
    case 'Task':
    case 'DEFAULT_TASK_NODE':
    case 'ICON_TASK_NODE':
      return withSelection()(DemoTaskNode);
    case DEFAULT_SPACER_NODE_TYPE:
      return SpacerNode;
    case 'edge':
      // draw arrow terminal when isDependency is set on data
      return withSelection()(DemoTaskEdge);
    default:
      return undefined;
  }
};

export default pipelineGroupsComponentFactory;
