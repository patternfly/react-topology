import { useContext } from 'react';
import { observer } from 'mobx-react';
import { Edge, EdgeTerminalType, GraphElement, TaskEdge } from '@patternfly/react-topology';
import { PipelineDemoContext } from './PipelineDemoContext';

export const GROUPED_PIPELINE_NODE_SEPARATION_HORIZONTAL = 200;

interface DemoTaskEdgeProps {
  element: GraphElement;
}

const DemoTaskGroupEdge: React.FunctionComponent<DemoTaskEdgeProps> = ({ element, ...props }) => {
  const pipelineOptions = useContext(PipelineDemoContext);

  return (
    <TaskEdge
      element={element as Edge}
      endTerminalType={pipelineOptions.showTerminalType ? EdgeTerminalType.directional : EdgeTerminalType.none}
      nodeSeparation={GROUPED_PIPELINE_NODE_SEPARATION_HORIZONTAL}
      {...props}
    />
  );
};
export default observer(DemoTaskGroupEdge);
