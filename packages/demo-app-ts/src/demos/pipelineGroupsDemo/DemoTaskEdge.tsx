import * as React from 'react';
import { observer } from 'mobx-react';
import { Edge, EdgeTerminalType, GraphElement, TaskEdge } from '@patternfly/react-topology';

interface DemoTaskEdgeProps {
  element: GraphElement;
}

const DemoTaskEdge: React.FunctionComponent<DemoTaskEdgeProps> = ({ element, ...props }) => {

  const isDependency = (element as Edge).getTarget().getData()?.isDependency;

  return (
    <TaskEdge
      element={element as Edge}
      endTerminalType={
        isDependency ? EdgeTerminalType.directional : EdgeTerminalType.none
      }
      {...props}
    />
  );
};

export default observer(DemoTaskEdge);
