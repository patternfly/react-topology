import * as React from 'react';
import { observer } from 'mobx-react';
import { css } from '@patternfly/react-styles';
import styles from '../../../css/topology-components';
import { Edge, EdgeTerminalType, NodeStatus } from '../../../types';
import { ConnectDragSource } from '../../../behavior/dnd-types';
import ConnectorArrow from './ConnectorArrow';
import ConnectorCross from './ConnectorCross';
import ConnectorSquare from './ConnectorSquare';
import ConnectorCircle from './ConnectorCircle';
import ConnectorArrowAlt from './ConnectorArrowAlt';
import { StatusModifier } from '../../../utils';
import Point from '../../../geom/Point';

interface EdgeConnectorArrowProps {
  edge: Edge;
  className?: string;
  highlight?: boolean;
  isTarget?: boolean;
  status?: NodeStatus;
  terminalType?: EdgeTerminalType;
  size?: number;
  dragRef?: ConnectDragSource;
  startPoint?: Point;
  endPoint?: Point;
}

const DefaultConnectorTerminal: React.FunctionComponent<EdgeConnectorArrowProps> = ({
  className,
  edge,
  isTarget = true,
  terminalType,
  status,
  startPoint,
  endPoint,
  ...others
}) => {
  let Terminal;
  switch (terminalType) {
    case EdgeTerminalType.directional:
      Terminal = ConnectorArrow;
      break;
    case EdgeTerminalType.directionalAlt:
      Terminal = ConnectorArrowAlt;
      break;
    case EdgeTerminalType.cross:
      Terminal = ConnectorCross;
      break;
    case EdgeTerminalType.square:
      Terminal = ConnectorSquare;
      break;
    case EdgeTerminalType.circle:
      Terminal = ConnectorCircle;
      break;
    default:
      return null;
  }
  if (!Terminal) {
    return null;
  }
  const bendPoints = edge.getBendpoints();
  const defaultStartPoint = isTarget
    ? edge.getBendpoints[bendPoints.length - 1] || edge.getStartPoint()
    : bendPoints[0] || edge.getEndPoint();
  const defaultEndPoint = isTarget ? edge.getEndPoint() : edge.getStartPoint();
  const classes = css(styles.topologyEdge, className, StatusModifier[status]);

  return (
    <Terminal
      className={classes}
      startPoint={startPoint ?? defaultStartPoint}
      endPoint={endPoint ?? defaultEndPoint}
      isTarget={isTarget}
      {...others}
    />
  );
};

export default observer(DefaultConnectorTerminal);
