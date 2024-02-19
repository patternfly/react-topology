import * as React from 'react';
import { observer } from 'mobx-react';
import { css } from '@patternfly/react-styles';
import styles from '../../../css/topology-components';
import { Edge, GraphElement, isEdge } from '../../../types';
import { integralShapePath } from '../../utils';
import { DagreLayoutOptions, TOP_TO_BOTTOM } from '../../../layouts';

interface TaskEdgeProps {
  /** The graph edge element to represent */
  element: GraphElement;
  /** Additional classes added to the edge */
  className?: string;
  /** Offset for integral shape path */
  nodeSeparation?: number;
}

type TaskEdgeInnerProps = Omit<TaskEdgeProps, 'element'> & { element: Edge };

const TaskEdgeInner: React.FunctionComponent<TaskEdgeInnerProps> = observer(({
  element,
  className,
  nodeSeparation }) => {
  const startPoint = element.getStartPoint();
  const endPoint = element.getEndPoint();
  const groupClassName = css(styles.topologyEdge, className);
  const startIndent: number = element.getData()?.indent || 0;
  const verticalLayout = (element.getGraph().getLayoutOptions?.() as DagreLayoutOptions)?.rankdir === TOP_TO_BOTTOM;

  return (
    <g data-test-id="task-handler" className={groupClassName} fillOpacity={0}>
      <path
        d={integralShapePath(startPoint, endPoint, startIndent, nodeSeparation, verticalLayout)}
        transform="translate(0.5,0.5)"
        shapeRendering="geometricPrecision"
      />
    </g>
  );
});

const TaskEdge: React.FunctionComponent<TaskEdgeProps> = ({ element, ...rest }: TaskEdgeProps) => {
  if (!isEdge(element)) {
    throw new Error('TaskEdge must be used only on Edge elements');
  }
  return <TaskEdgeInner element={element as Edge} {...rest} />;
};

export default TaskEdge;
