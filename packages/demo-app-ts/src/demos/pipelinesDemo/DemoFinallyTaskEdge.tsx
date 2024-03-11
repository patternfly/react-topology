import * as React from 'react';
import { observer } from 'mobx-react';
import { EdgeTerminalType, GraphElement, TaskEdge } from '@patternfly/react-topology';

interface DemoFinallyTaskEdgeProps {
  element: GraphElement;
}

const DemoFinallyTaskEdge: React.FunctionComponent<DemoFinallyTaskEdgeProps> = (props) => (
  <TaskEdge endTerminalType={EdgeTerminalType.none} {...props} />
);

export default observer(DemoFinallyTaskEdge);
