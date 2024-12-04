import * as React from 'react';
import { action } from 'mobx';
import { TooltipProps } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import styles from '../../../css/topology-pipelines';
import { PopoverProps, Tooltip } from '@patternfly/react-core';
import { observer } from '../../../mobx-exports';
import { AnchorEnd, GraphElement, isNode, Node, ScaleDetailsLevel } from '../../../types';
import { RunStatus } from '../../types';
import { OnSelect, useAnchor } from '../../../behavior';
import { getNodeScaleTranslation, useHover, useSize } from '../../../utils';
import { TaskNodeSourceAnchor, TaskNodeTargetAnchor } from '../anchors';
import { useScaleNode } from '../../../hooks';
import { DagreLayoutOptions, TOP_TO_BOTTOM } from '../../../layouts';
import TaskPill from './TaskPill';

const STATUS_ICON_SIZE = 16;
const SCALE_UP_TIME = 200;

export interface TaskNodeProps {
  /** Additional content added to the node */
  children?: React.ReactNode;
  /** Additional classes added to the node */
  className?: string;
  /** The graph node element to represent */
  element: GraphElement;
  /** Padding to use before and after contents */
  paddingX?: number;
  /** Padding to use above and below contents */
  paddingY?: number;
  /** Additional classes added to the label */
  nameLabelClass?: string;
  /** RunStatus to depict */
  status?: RunStatus;
  /** Size of the status icon */
  statusIconSize?: number;
  /** Flag indicating the status indicator */
  showStatusState?: boolean;
  /** Custom icon to use as the status icon */
  customStatusIcon?: React.ReactNode;
  /** Flag indicating the node should be scaled, best on hover of the node at lowest scale level */
  scaleNode?: boolean;
  /** Flag to hide details at medium scale */
  hideDetailsAtMedium?: boolean;
  /** Statuses to show at when details are hidden */
  hiddenDetailsShownStatuses?: RunStatus[];
  /** Additional icon to be shown before the task label*/
  leadIcon?: React.ReactNode;
  /** Text for the label's badge */
  badge?: string;
  /** Color to use for the label's badge background */
  badgeColor?: string;
  /** Color to use for the label's badge text */
  badgeTextColor?: string;
  /** Color to use for the label's badge border */
  badgeBorderColor?: string;
  /** Additional classes to use for the label's badge */
  badgeClassName?: string;
  /** Set to use a tooltip on the badge, takes precedence over the badgePopoverParams */
  badgeTooltip?: React.ReactNode;
  /** Set to use a popover on the badge, ignored if the badgeTooltip parameter is set */
  badgePopoverParams?: PopoverProps;
  /** Icon to show for the task */
  taskIconClass?: string;
  /** Element to show for the task icon */
  taskIcon?: React.ReactNode;
  /** Set to use a tooltip on the task icon */
  taskIconTooltip?: React.ReactNode;
  /** Padding to use around the task icon */
  taskIconPadding?: number;
  /** Flag if the user is hovering on the node */
  hover?: boolean;
  /** The maximum length of the label before truncation */
  truncateLength?: number;
  /** Flag if the tooltip is disabled */
  disableTooltip?: boolean;
  /** Tooltip to show on node hover */
  toolTip?: React.ReactNode;
  /** Tooltip properties to pass along to the node's tooltip */
  toolTipProps?: Omit<TooltipProps, 'content'>;
  /** Size of the when expression indicator */
  whenSize?: number;
  /** Distance from the when expression indicator to the node */
  whenOffset?: number;
  /** Icon to use for the action menu */
  actionIcon?: React.ReactElement;
  /** Additional classes to use for the action icon */
  actionIconClassName?: string;
  /** Callback when the action icon is clicked */
  onActionIconClick?: (e: React.MouseEvent) => void;
  /** Flag if the element is selected. Part of WithSelectionProps */
  selected?: boolean;
  /** Function to call when the element should become selected (or deselected). Part of WithSelectionProps */
  onSelect?: OnSelect;
  /** Function to call to show a context menu for the node  */
  onContextMenu?: (e: React.MouseEvent) => void;
  /** Flag indicating that the context menu for the node is currently open  */
  contextMenuOpen?: boolean;
  /** Hide context menu kebab for the node  */
  hideContextMenuKebab?: boolean;
  /** Number of shadowed pills to show  */
  shadowCount?: number;
  /** Offset for each shadow  */
  shadowOffset?: number;
}

type TaskNodeInnerProps = Omit<TaskNodeProps, 'element'> & { element: Node };

const TaskNodeInner: React.FC<TaskNodeInnerProps> = observer(
  ({
    element,
    className,
    statusIconSize = STATUS_ICON_SIZE,
    scaleNode,
    toolTip,
    toolTipProps,
    disableTooltip = false,
    whenSize = 0,
    whenOffset = 0,
    ...rest
  }) => {
    const [hovered, hoverRef] = useHover();
    // const isHover = hover !== undefined ? hover : hovered;
    const taskRef = React.useRef();
    const [pillSize, pillRef] = useSize();
    const pillWidth = pillSize?.width || 0;
    const { width } = element.getBounds();

    const detailsLevel = element.getGraph().getDetailsLevel();
    const verticalLayout = (element.getGraph().getLayoutOptions?.() as DagreLayoutOptions)?.rankdir === TOP_TO_BOTTOM;

    useAnchor(
      React.useCallback(
        (node: Node) => new TaskNodeSourceAnchor(node, detailsLevel, statusIconSize + 4, verticalLayout),
        // Include scaleNode to cause an update when it changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [detailsLevel, statusIconSize, scaleNode, verticalLayout]
      ),
      AnchorEnd.source
    );
    useAnchor(
      React.useCallback(
        (node: Node) =>
          new TaskNodeTargetAnchor(node, whenSize + whenOffset, detailsLevel, statusIconSize + 4, verticalLayout),
        // Include scaleNode to cause an update when it changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [whenSize, whenOffset, detailsLevel, statusIconSize, scaleNode, verticalLayout]
      ),
      AnchorEnd.target
    );

    React.useEffect(() => {
      const sourceEdges = element.getSourceEdges();
      action(() => {
        const indent = detailsLevel === ScaleDetailsLevel.high && !verticalLayout ? width - pillWidth : 0;
        sourceEdges.forEach((edge) => {
          const data = edge.getData();
          if ((data?.indent ?? 0) !== indent) {
            edge.setData({ ...(data || {}), indent });
          }
        });
      })();

      return action(() => {
        sourceEdges.forEach((edge) => {
          const data = edge.getData();
          if (data?.indent) {
            edge.setData({ ...(data || {}), indent: 0 });
          }
        });
      });
    }, [detailsLevel, element, pillWidth, verticalLayout, width]);

    const scale = element.getGraph().getScale();
    const nodeScale = useScaleNode(scaleNode, scale, SCALE_UP_TIME);
    const { translateX, translateY } = getNodeScaleTranslation(element, nodeScale, scaleNode);

    const taskPill = (
      <TaskPill
        x={verticalLayout ? 0 : whenOffset}
        y={0}
        className={css('pf-topology__pipelines__task-node', className)}
        scaleNode={scaleNode}
        hover={hovered}
        statusIconSize={statusIconSize}
        pillRef={pillRef}
        width={width}
        taskRef={taskRef}
        element={element}
        {...rest}
      />
    );
    return (
      <g
        className={css('pf-topology__pipelines__task-node', className)}
        transform={`${scaleNode ? `translate(${translateX}, ${translateY})` : ''} scale(${nodeScale})`}
        ref={hoverRef}
      >
        {!toolTip || disableTooltip ? (
          taskPill
        ) : (
          <Tooltip
            triggerRef={taskRef}
            position="bottom"
            enableFlip={false}
            {...(toolTipProps ?? {})}
            content={toolTip}
          >
            {taskPill}
          </Tooltip>
        )}
      </g>
    );
  }
);

const TaskNode: React.FC<TaskNodeProps> = ({
  element,
  paddingX = 8,
  paddingY = 8,
  statusIconSize = STATUS_ICON_SIZE,
  showStatusState = true,
  hiddenDetailsShownStatuses = [RunStatus.Failed, RunStatus.FailedToStart, RunStatus.Cancelled],
  badgeClassName = styles.topologyPipelinesPillBadge,
  taskIconPadding = 4,
  truncateLength = 14,
  disableTooltip = false,
  whenSize = 0,
  whenOffset = 0,
  ...rest
}) => {
  if (!isNode(element)) {
    throw new Error('TaskNode must be used only on Node elements');
  }
  return (
    <TaskNodeInner
      element={element as Node}
      paddingX={paddingX}
      paddingY={paddingY}
      statusIconSize={statusIconSize}
      showStatusState={showStatusState}
      hiddenDetailsShownStatuses={hiddenDetailsShownStatuses}
      badgeClassName={badgeClassName}
      taskIconPadding={taskIconPadding}
      truncateLength={truncateLength}
      disableTooltip={disableTooltip}
      whenSize={whenSize}
      whenOffset={whenOffset}
      {...rest}
    />
  );
};

export default TaskNode;
