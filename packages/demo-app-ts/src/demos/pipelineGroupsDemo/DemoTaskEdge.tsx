import * as React from 'react';
import { observer } from 'mobx-react';
import {
  DEFAULT_SPACER_NODE_TYPE,
  Edge,
  EdgeTerminalType,
  GraphElement,
  TaskEdge,
  WithSelectionProps
} from '@patternfly/react-topology';

interface DemoTaskEdgeProps extends WithSelectionProps {
  element: GraphElement;
}

const DemoTaskEdge: React.FunctionComponent<DemoTaskEdgeProps> = ({ element, ...props }) => (
  <TaskEdge
    element={element as Edge}
    endTerminalType={
      (element as Edge).getTarget().getType() !== DEFAULT_SPACER_NODE_TYPE
        ? EdgeTerminalType.directional
        : undefined
    }
    {...props}
  />
);

export default observer(DemoTaskEdge);
