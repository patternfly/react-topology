import * as React from 'react';
import { observer } from 'mobx-react';
import { Edge, EdgeTerminalType, GraphElement, TaskEdge } from '@patternfly/react-topology';
import { PipelineDemoContext } from './PipelineDemoContext';

interface DemoTaskEdgeProps {
  element: GraphElement;
}

const DemoTaskEdge: React.FunctionComponent<DemoTaskEdgeProps> = ({ element, ...props }) => {
  const pipelineOptions = React.useContext(PipelineDemoContext);

  return (
    <TaskEdge
      element={element as Edge}
      endTerminalType={
        pipelineOptions.showTerminalType ? EdgeTerminalType.directional : EdgeTerminalType.none
      }
      {...props}
    />
  );
};

export default observer(DemoTaskEdge);
