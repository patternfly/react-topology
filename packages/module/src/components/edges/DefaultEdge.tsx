import * as React from 'react';
import { observer } from 'mobx-react';
import {
  Edge,
  EdgeStyle,
  EdgeTerminalType,
  GraphElement,
  isEdge,
  isNode,
  NodeStatus,
  ScaleDetailsLevel
} from '../../types';
import { ConnectDragSource, OnSelect } from '../../behavior';
import { getClosestVisibleParent, useHover } from '../../utils';
import { Layer } from '../layers';
import { css } from '@patternfly/react-styles';
import styles from '../../css/topology-components';
import { getEdgeAnimationDuration, getEdgeStyleClassModifier, StatusModifier } from '../../utils/style-utils';
import DefaultConnectorTerminal from './terminals/DefaultConnectorTerminal';
import { TOP_LAYER } from '../../const';
import DefaultConnectorTag from './DefaultConnectorTag';
import { Point } from '../../geom';
import { getConnectorStartPoint } from './terminals/terminalUtils';

interface DefaultEdgeProps {
  /** Additional content added to the edge */
  children?: React.ReactNode;
  /** Additional classes added to the edge */
  className?: string;
  /** The graph edge element to represent */
  element: GraphElement;
  /** Flag indicating if the user is dragging the edge */
  dragging?: boolean;
  /** The style of the edge. Defaults to the style set on the Edge's model */
  edgeStyle?: EdgeStyle;
  /** The duration in seconds for the edge animation. Defaults to the animationSpeed set on the Edge's model */
  animationDuration?: number;
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
  /** Tag to show for the terminal */
  tag?: string;
  /** Additional classes added to the tag */
  tagClass?: string;
  /** The status to indicate on the tag */
  tagStatus?: NodeStatus;
  /** Function to call for showing a remove indicator on the edge. Part of WithRemoveConnectorProps  */
  onShowRemoveConnector?: () => void;
  /** Function to call for removing the remove indicator on the edge. Part of WithRemoveConnectorProps  */
  onHideRemoveConnector?: () => void;
  /** Ref to use to start the drag of the start of the edge. Part of WithSourceDragProps */
  sourceDragRef?: ConnectDragSource;
  /** Ref to use to start the drag of the end of the edge. Part of WithTargetDragProps */
  targetDragRef?: ConnectDragSource;
  /** Flag indicating if the element is selected. Part of WithSelectionProps */
  selected?: boolean;
  /** Function to call when the element should become selected (or deselected). Part of WithSelectionProps */
  onSelect?: OnSelect;
  /** Function to call to show a context menu for the edge  */
  onContextMenu?: (e: React.MouseEvent) => void;
  /** Flag indicating that the context menu for the edge is currently open  */
  contextMenuOpen?: boolean;
}

type DefaultEdgeInnerProps = Omit<DefaultEdgeProps, 'element'> & { element: Edge };

const DefaultEdgeInner: React.FunctionComponent<DefaultEdgeInnerProps> = observer(({
  element,
  dragging,
  sourceDragRef,
  targetDragRef,
  edgeStyle,
  animationDuration,
  onShowRemoveConnector,
  onHideRemoveConnector,
  startTerminalType = EdgeTerminalType.none,
  startTerminalClass,
  startTerminalStatus,
  startTerminalSize = 14,
  endTerminalType = EdgeTerminalType.directional,
  endTerminalClass,
  endTerminalStatus,
  endTerminalSize = 14,
  tag,
  tagClass,
  tagStatus,
  children,
  className,
  selected,
  onSelect,
  onContextMenu
}) => {
  const [hover, hoverRef] = useHover();
  const startPoint = element.getStartPoint();
  const endPoint = element.getEndPoint();

  // eslint-disable-next-line patternfly-react/no-layout-effect
  React.useLayoutEffect(() => {
    if (hover && !dragging) {
      onShowRemoveConnector && onShowRemoveConnector();
    } else {
      onHideRemoveConnector && onHideRemoveConnector();
    }
  }, [hover, dragging, onShowRemoveConnector, onHideRemoveConnector]);

  // If the edge connects to nodes in a collapsed group don't draw
  const sourceParent = getClosestVisibleParent(element.getSource());
  const targetParent = getClosestVisibleParent(element.getTarget());
  if (isNode(sourceParent) && sourceParent.isCollapsed() && sourceParent === targetParent) {
    return null;
  }

  const detailsLevel = element.getGraph().getDetailsLevel();

  const groupClassName = css(
    styles.topologyEdge,
    className,
    dragging && 'pf-m-dragging',
    hover && !dragging && 'pf-m-hover',
    selected && !dragging && 'pf-m-selected',
    StatusModifier[endTerminalStatus]
  );

  const edgeAnimationDuration = animationDuration ?? getEdgeAnimationDuration(element.getEdgeAnimationSpeed());
  const linkClassName = css(styles.topologyEdgeLink, getEdgeStyleClassModifier(edgeStyle || element.getEdgeStyle()));

  const bendpoints = element.getBendpoints();

  const d = `M${startPoint.x} ${startPoint.y} ${bendpoints.map((b: Point) => `L${b.x} ${b.y} `).join('')}L${endPoint.x
    } ${endPoint.y}`;

  const bgStartPoint =
    !startTerminalType || startTerminalType === EdgeTerminalType.none
      ? [startPoint.x, startPoint.y]
      : getConnectorStartPoint(bendpoints?.[0] || endPoint, startPoint, startTerminalSize);
  const bgEndPoint =
    !endTerminalType || endTerminalType === EdgeTerminalType.none
      ? [endPoint.x, endPoint.y]
      : getConnectorStartPoint(bendpoints?.[bendpoints.length - 1] || startPoint, endPoint, endTerminalSize);
  const backgroundPath = `M${bgStartPoint[0]} ${bgStartPoint[1]} ${bendpoints
    .map((b: Point) => `L${b.x} ${b.y} `)
    .join('')}L${bgEndPoint[0]} ${bgEndPoint[1]}`;

  const showTag = tag && (detailsLevel === ScaleDetailsLevel.high || hover);
  const scale = element.getGraph().getScale();
  const tagScale = hover && !(detailsLevel === ScaleDetailsLevel.high) ? Math.max(1, 1 / scale) : 1;
  const tagPositionScale = hover && !(detailsLevel === ScaleDetailsLevel.high) ? Math.min(1, scale) : 1;

  return (
    <Layer id={dragging || hover ? TOP_LAYER : undefined}>
      <g
        ref={hoverRef}
        data-test-id="edge-handler"
        className={groupClassName}
        onClick={onSelect}
        onContextMenu={onContextMenu}
      >
        <path
          className={css(styles.topologyEdgeBackground)}
          d={backgroundPath}
          onMouseEnter={onShowRemoveConnector}
          onMouseLeave={onHideRemoveConnector}
        />
        <path className={linkClassName} d={d} style={{ animationDuration: `${edgeAnimationDuration}s` }} />
        {showTag && (
          <g transform={`scale(${hover ? tagScale : 1})`}>
            <DefaultConnectorTag
              className={tagClass}
              startPoint={element.getStartPoint().scale(tagPositionScale)}
              endPoint={element.getEndPoint().scale(tagPositionScale)}
              tag={tag}
              status={tagStatus}
            />
          </g>
        )}
        <DefaultConnectorTerminal
          className={startTerminalClass}
          isTarget={false}
          edge={element}
          size={startTerminalSize}
          dragRef={sourceDragRef}
          terminalType={startTerminalType}
          status={startTerminalStatus}
          highlight={dragging || hover}
        />
        <DefaultConnectorTerminal
          className={endTerminalClass}
          isTarget
          dragRef={targetDragRef}
          edge={element}
          size={endTerminalSize}
          terminalType={endTerminalType}
          status={endTerminalStatus}
          highlight={dragging || hover}
        />
        {children}
      </g>
    </Layer>
  );
});

const DefaultEdge: React.FunctionComponent<DefaultEdgeProps> = ({
  element,
  startTerminalType = EdgeTerminalType.none,
  startTerminalSize = 14,
  endTerminalType = EdgeTerminalType.directional,
  endTerminalSize = 14,
  ...rest
}: DefaultEdgeProps) => {
  if (!isEdge(element)) {
    throw new Error('DefaultEdge must be used only on Edge elements');
  }
  return (
    <DefaultEdgeInner
      element={element}
      startTerminalType={startTerminalType}
      startTerminalSize={startTerminalSize}
      endTerminalType={endTerminalType}
      endTerminalSize={endTerminalSize}
      {...rest}
    />
  );
};

export default DefaultEdge;
