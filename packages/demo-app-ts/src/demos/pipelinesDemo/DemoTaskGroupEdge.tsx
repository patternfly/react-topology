import * as React from 'react';
import { observer } from 'mobx-react';
import { GraphElement, TaskEdge } from '@patternfly/react-topology';

export const GROUPED_PIPELINE_NODE_SEPARATION_HORIZONTAL = 200;

interface DemoTaskEdgeProps {
  element: GraphElement;
}

const DemoTaskGroupEdge: React.FunctionComponent<DemoTaskEdgeProps> = props => (
  <TaskEdge nodeSeparation={GROUPED_PIPELINE_NODE_SEPARATION_HORIZONTAL} {...props} />
);

export default observer(DemoTaskGroupEdge);
