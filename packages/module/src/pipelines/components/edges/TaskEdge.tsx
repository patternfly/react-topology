import * as React from 'react';
import { observer } from 'mobx-react';
import { css } from '@patternfly/react-styles';
import styles from '../../../css/topology-components';
import { Edge, EdgeTerminalType, GraphElement, NodeStatus, isEdge } from '../../../types';
import { integralShapePath } from '../../utils';
import { DagreLayoutOptions, TOP_TO_BOTTOM } from '../../../layouts';
import { DefaultConnectorTerminal } from '../../../components';
import { OnSelect } from '../../../behavior';
import Layer from '../../../components/layers/Layer';
import { TOP_LAYER } from '../../../const';

interface TaskEdgeProps {
  /** The graph edge element to represent */
  element: GraphElement;
  /** Additional classes added to the edge */
  className?: string;
  /** Offset for integral shape path */
  nodeSeparation?: number;
  /** The terminal type to use for the edge start */
  startTerminalType?: EdgeTerminalType;
  /** Additional classes added to the start terminal */
  startTerminalClass?: string;
  /** The status to indicate on the start terminal */
  startTerminalStatus?: NodeStatus;
  /** The size of the start terminal */
  startTerminalSize?: number;
  /** The terminal type to use for the edge end */
  endTerminalType?: EdgeTerminalType;
  /** Additional classes added to the end terminal */
  endTerminalClass?: string;
  /** The status to indicate on the end terminal */
  endTerminalStatus?: NodeStatus;
  /** The size of the end terminal */
  endTerminalSize?: number;
  /** Flag if the element is selected. Part of WithSelectionProps */
  selected?: boolean;
  /** Function to call when the element should become selected (or deselected). Part of WithSelectionProps */
  onSelect?: OnSelect;
}

type TaskEdgeInnerProps = Omit<TaskEdgeProps, 'element'> & { element: Edge };

const TaskEdgeInner: React.FunctionComponent<TaskEdgeInnerProps> = observer(
  ({
    element,
    startTerminalType = EdgeTerminalType.none,
    startTerminalClass,
    startTerminalStatus,
    startTerminalSize = 14,
    endTerminalType = EdgeTerminalType.none,
    endTerminalClass,
    endTerminalStatus,
    endTerminalSize = 14,
    className,
    nodeSeparation,
    selected,
    onSelect,
  }) => {
    const startPoint = element.getStartPoint();
    const endPoint = element.getEndPoint();
    const groupClassName = css(
      styles.topologyEdge,
      className,
      selected && 'pf-m-selected',
      onSelect && 'pf-m-selectable',
    );
    const startIndent: number = element.getData()?.indent || 0;
    const verticalLayout = (element.getGraph().getLayoutOptions?.() as DagreLayoutOptions)?.rankdir === TOP_TO_BOTTOM;

    const edgePath = integralShapePath(startPoint, endPoint, startIndent, nodeSeparation, verticalLayout);
    const edgeBackground = (
      <path
        onClick={onSelect}
        className={css(styles.topologyEdgeBackground, onSelect && 'pf-m-selectable')}
        d={edgePath}
      />
    );

    return (
      <g data-test-id="task-handler" className={groupClassName}>
        {selected ? edgeBackground : <Layer id={TOP_LAYER}>{edgeBackground}</Layer>}
        <path
          d={edgePath}
          transform="translate(0.5,0.5)"
          shapeRendering="geometricPrecision"
          fillOpacity={0}
        />
        <DefaultConnectorTerminal
          className={startTerminalClass}
          isTarget={false}
          edge={element}
          size={startTerminalSize}
          terminalType={startTerminalType}
          status={startTerminalStatus}
        />
        <DefaultConnectorTerminal
          className={endTerminalClass}
          isTarget
          edge={element}
          size={endTerminalSize}
          terminalType={endTerminalType}
          status={endTerminalStatus}
          startPoint={verticalLayout ? endPoint.clone().translate(0, -1) : endPoint.clone().translate(-1, 0)}
        />
      </g>
    );
  }
);

const TaskEdge: React.FunctionComponent<TaskEdgeProps> = ({ element, ...rest }: TaskEdgeProps) => {
  if (!isEdge(element)) {
    throw new Error('TaskEdge must be used only on Edge elements');
  }
  return <TaskEdgeInner element={element as Edge} {...rest} />;
};

export default TaskEdge;
