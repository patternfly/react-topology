import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '../../../css/topology-pipelines';
import topologyStyles from '../../../css/topology-components';
import { Popover, Tooltip } from '@patternfly/react-core';
import { observer } from '../../../mobx-exports';
import { Node, ScaleDetailsLevel } from '../../../types';
import { RunStatus } from '../../types';
import { truncateMiddle } from '../../../utils/truncate-middle';
import { createSvgIdUrl, useCombineRefs, useHover, useSize } from '../../../utils';
import { getRunStatusModifier, nonShadowModifiers } from '../../utils';
import StatusIcon from '../../utils/StatusIcon';
import LabelActionIcon from '../../../components/nodes/labels/LabelActionIcon';
import LabelContextMenu from '../../../components/nodes/labels/LabelContextMenu';
import NodeShadows, {
  NODE_SHADOW_FILTER_ID_DANGER,
  NODE_SHADOW_FILTER_ID_HOVER
} from '../../../components/nodes/NodeShadows';
import LabelBadge from '../../../components/nodes/labels/LabelBadge';
import LabelIcon from '../../../components/nodes/labels/LabelIcon';
import { DagreLayoutOptions, TOP_TO_BOTTOM } from '../../../layouts';
import { TaskNodeProps } from './TaskNode';

const STATUS_ICON_SIZE = 16;

export interface TaskPillProps extends Omit<TaskNodeProps, 'element'> {
  verticalLayout?: boolean;
  width?: number;
  x: number;
  y: number;
  taskRef?: React.Ref<SVGGElement>;
  pillRef: (node: SVGGraphicsElement) => void;
  element: Node;
}

const TaskPill: React.FC<TaskPillProps> = observer(
  ({
    element,
    taskRef,
    pillRef,
    className,
    width = 0,
    paddingX = 8,
    paddingY = 8,
    status,
    statusIconSize = STATUS_ICON_SIZE,
    showStatusState = true,
    scaleNode,
    hideDetailsAtMedium,
    hiddenDetailsShownStatuses = [RunStatus.Failed, RunStatus.FailedToStart, RunStatus.Cancelled],
    leadIcon,
    badge,
    badgeColor,
    badgeTextColor,
    badgeBorderColor,
    badgeClassName = styles.topologyPipelinesPillBadge,
    badgeTooltip,
    badgePopoverParams,
    customStatusIcon,
    nameLabelClass,
    taskIconClass,
    taskIcon,
    taskIconTooltip,
    taskIconPadding = 4,
    hover,
    truncateLength = 14,
    disableTooltip = false,
    selected,
    onSelect,
    onContextMenu,
    contextMenuOpen,
    hideContextMenuKebab,
    actionIcon,
    actionIconClassName,
    onActionIconClick,
    shadowCount = 0,
    shadowOffset = 8,
    children,
    x,
    y
  }) => {
    const [hovered] = useHover();
    const taskIconComponentRef = React.useRef();
    const isHover = hover !== undefined ? hover : hovered;
    const label = truncateMiddle(element.getLabel(), { length: truncateLength, omission: '...' });
    const [textSize, textRef] = useSize([label, className]);
    const nameLabelTriggerRef = React.useRef();
    const nameLabelRef = useCombineRefs(textRef, nameLabelTriggerRef);
    const [statusSize, statusRef] = useSize([status, showStatusState, statusIconSize]);
    const [leadSize, leadIconRef] = useSize([leadIcon]);
    const [badgeSize, badgeRef] = useSize([badge]);
    const badgeLabelTriggerRef = React.useRef();
    const [actionSize, actionRef] = useSize([actionIcon, paddingX]);
    const [contextSize, contextRef] = useSize([onContextMenu, paddingX]);
    const detailsLevel = element.getGraph().getDetailsLevel();
    const verticalLayout = (element.getGraph().getLayoutOptions?.() as DagreLayoutOptions)?.rankdir === TOP_TO_BOTTOM;

    const textWidth = textSize?.width ?? 0;
    const textHeight = textSize?.height ?? 0;

    const {
      height,
      statusStartX,
      textStartX,
      actionStartX,
      contextStartX,
      pillWidth,
      badgeStartX,
      iconWidth,
      iconStartX,
      leadIconStartX,
      offsetX
    } = React.useMemo(() => {
      if (!textSize) {
        return {
          height: 0,
          statusStartX: 0,
          textStartX: 0,
          actionStartX: 0,
          contextStartX: 0,
          pillWidth: 0,
          badgeStartX: 0,
          iconWidth: 0,
          iconStartX: 0,
          leadIconStartX: 0,
          offsetX: 0
        };
      }
      const height: number = textHeight + 2 * paddingY;
      const startX = paddingX + paddingX / 2;

      const iconWidth = taskIconClass || taskIcon ? height - taskIconPadding : 0;
      const iconStartX = -(iconWidth * 0.75);

      const statusStartX = startX - statusIconSize / 4; // Adjust for icon padding
      const statusSpace = status && showStatusState && statusSize ? statusSize.width + paddingX : 0;

      const leadIconStartX = startX + statusSpace;
      const leadIconSpace = leadIcon ? leadSize.width + paddingX : 0;

      const textStartX = leadIconStartX + leadIconSpace;
      const textSpace = textWidth + paddingX;

      const badgeStartX = textStartX + textSpace;
      const badgeSpace = badge && badgeSize ? badgeSize.width + paddingX : 0;

      const actionStartX = badgeStartX + badgeSpace;
      const actionSpace = actionIcon && actionSize ? actionSize.width + paddingX : 0;

      const contextStartX = actionStartX + actionSpace;
      const contextSpace = !hideContextMenuKebab && onContextMenu && contextSize ? contextSize.width + paddingX / 2 : 0;

      const pillWidth = contextStartX + contextSpace + paddingX / 2;

      const offsetX = verticalLayout ? (width - pillWidth) / 2 : 0;

      return {
        height,
        statusStartX,
        textStartX,
        actionStartX,
        contextStartX,
        badgeStartX,
        iconWidth,
        iconStartX,
        leadIconStartX,
        pillWidth,
        offsetX
      };
    }, [
      textSize,
      textHeight,
      textWidth,
      paddingY,
      paddingX,
      taskIconClass,
      taskIcon,
      taskIconPadding,
      statusIconSize,
      status,
      showStatusState,
      leadSize,
      leadIcon,
      statusSize,
      badgeSize,
      badge,
      actionIcon,
      actionSize,
      hideContextMenuKebab,
      onContextMenu,
      contextSize,
      verticalLayout,
      width
    ]);

    const scale = element.getGraph().getScale();

    const nameLabel = (
      <text
        x={offsetX}
        ref={nameLabelRef}
        className={css(nameLabelClass, styles.topologyPipelinesPillText)}
        dominantBaseline="middle"
      >
        {label}
      </text>
    );

    const runStatusModifier = getRunStatusModifier(status);
    const pillClasses = css(
      styles.topologyPipelinesPill,
      className,
      isHover && styles.modifiers.hover,
      runStatusModifier,
      selected && styles.modifiers.selected,
      onSelect && styles.modifiers.selectable
    );

    // Force an update of the given pillRef when dependencies change
    const pillUpdatedRef = React.useCallback(
      (node: SVGGraphicsElement): void => {
        pillRef(node);
      },
      // dependencies causing the pill rect to resize
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [pillClasses, width, height]
    );

    let filter: string;
    if (runStatusModifier === styles.modifiers.danger) {
      filter = createSvgIdUrl(NODE_SHADOW_FILTER_ID_DANGER);
    } else if (isHover && !nonShadowModifiers.includes(runStatusModifier)) {
      filter = createSvgIdUrl(NODE_SHADOW_FILTER_ID_HOVER);
    }

    const taskIconComponent = (taskIconClass || taskIcon) && (
      <LabelIcon
        x={offsetX + iconStartX + iconWidth}
        y={(height - iconWidth) / 2}
        width={iconWidth}
        height={iconWidth}
        iconClass={taskIconClass}
        icon={taskIcon}
        padding={taskIconPadding}
        innerRef={taskIconComponentRef}
      />
    );

    const badgeLabel = badge ? (
      <LabelBadge
        ref={badgeRef}
        innerRef={badgeLabelTriggerRef}
        x={offsetX + badgeStartX}
        y={(height - (badgeSize?.height ?? 0)) / 2}
        badge={badge}
        badgeClassName={badgeClassName}
        badgeColor={badgeColor}
        badgeTextColor={badgeTextColor}
        badgeBorderColor={badgeBorderColor}
      />
    ) : null;

    let badgeComponent: React.ReactNode;
    if (badgeLabel && badgeTooltip) {
      badgeComponent = (
        <Tooltip triggerRef={badgeLabelTriggerRef} content={badgeTooltip}>
          {badgeLabel}
        </Tooltip>
      );
    } else if (badgeLabel && badgePopoverParams) {
      badgeComponent = (
        <g onClick={(e) => e.stopPropagation()}>
          <Popover triggerRef={badgeLabelTriggerRef} {...badgePopoverParams}>
            {badgeLabel}
          </Popover>
        </g>
      );
    } else {
      badgeComponent = badgeLabel;
    }

    if (showStatusState && !scaleNode && hideDetailsAtMedium && detailsLevel !== ScaleDetailsLevel.high) {
      const statusBackgroundRadius = statusIconSize / 2 + 4;
      const upScale = 1 / scale;
      const { height: boundsHeight } = element.getBounds();

      const translateX = verticalLayout ? width / 2 - statusBackgroundRadius * upScale : 0;
      const translateY = verticalLayout ? 0 : (boundsHeight - statusBackgroundRadius * 2 * upScale) / 2;
      return (
        <g transform={`translate(${translateX}, ${translateY}) scale(${upScale})`} ref={taskRef}>
          <circle
            className={css(
              styles.topologyPipelinesStatusIconBackground,
              styles.topologyPipelinesPillStatus,
              runStatusModifier,
              selected && 'pf-m-selected'
            )}
            cx={statusBackgroundRadius}
            cy={statusBackgroundRadius}
            r={statusBackgroundRadius}
          />
          {status && (!hiddenDetailsShownStatuses || hiddenDetailsShownStatuses.includes(status)) ? (
            <g transform={`translate(4, 4)`}>
              <g
                className={css(
                  styles.topologyPipelinesStatusIcon,
                  runStatusModifier,
                  selected && 'pf-m-selected',
                  (status === RunStatus.Running || status === RunStatus.InProgress) && styles.modifiers.spin
                )}
              >
                {customStatusIcon ?? <StatusIcon status={status} />}
              </g>
            </g>
          ) : null}
        </g>
      );
    }

    const shadows = [];
    for (let i = shadowCount; i > 0; i--) {
      shadows.push(
        <rect
          key={`shadow-offset-${i}`}
          x={offsetX + shadowOffset * i}
          y={0}
          width={pillWidth}
          height={height}
          rx={height / 2}
          className={css(topologyStyles.topologyNodeBackground, 'pf-m-disabled')}
          filter={filter}
        />
      );
    }
    return (
      <g
        className={pillClasses}
        transform={`translate(${x},${y})`}
        onClick={onSelect}
        onContextMenu={onContextMenu}
        ref={taskRef}
      >
        <NodeShadows />
        {shadows}
        <rect
          x={offsetX}
          y={0}
          width={pillWidth}
          ref={pillUpdatedRef}
          height={height}
          rx={height / 2}
          className={css(styles.topologyPipelinesPillBackground)}
          filter={filter}
        />
        <g transform={`translate(${textStartX}, ${paddingY + textHeight / 2 + 1})`}>
          {element.getLabel() !== label && !disableTooltip ? (
            <Tooltip triggerRef={nameLabelTriggerRef} content={element.getLabel()}>
              <g>{nameLabel}</g>
            </Tooltip>
          ) : (
            nameLabel
          )}
        </g>
        {status && showStatusState && (
          <g
            transform={`translate(${offsetX + statusStartX + paddingX / 2}, ${(height - statusIconSize) / 2})`}
            ref={statusRef}
          >
            <g
              className={css(
                styles.topologyPipelinesPillStatus,
                runStatusModifier,
                selected && 'pf-m-selected',
                (status === RunStatus.Running || status === RunStatus.InProgress) && styles.modifiers.spin
              )}
            >
              {customStatusIcon ?? <StatusIcon status={status} />}
            </g>
          </g>
        )}
        {leadIcon && (
          <g
            transform={`translate(${offsetX + leadIconStartX}, ${(height - leadSize?.height ?? 0) / 2})`}
            ref={leadIconRef}
          >
            {leadIcon}
          </g>
        )}
        {taskIconComponent &&
          (taskIconTooltip ? (
            <Tooltip triggerRef={taskIconComponentRef} content={taskIconTooltip}>
              {taskIconComponent}
            </Tooltip>
          ) : (
            taskIconComponent
          ))}
        {badgeComponent}
        {actionIcon && (
          <>
            <line
              className={css(topologyStyles.topologyNodeSeparator)}
              x1={offsetX + actionStartX}
              y1={0}
              x2={offsetX + actionStartX}
              y2={height}
              shapeRendering="crispEdges"
            />
            <LabelActionIcon
              ref={actionRef}
              x={offsetX + actionStartX}
              y={0}
              height={height}
              paddingX={paddingX}
              paddingY={0}
              icon={actionIcon}
              className={actionIconClassName}
              onClick={onActionIconClick}
            />
          </>
        )}
        {textSize && onContextMenu && !hideContextMenuKebab && (
          <>
            <line
              className={css(topologyStyles.topologyNodeSeparator)}
              x1={offsetX + contextStartX}
              y1={0}
              x2={offsetX + contextStartX}
              y2={height}
              shapeRendering="crispEdges"
            />
            <LabelContextMenu
              ref={contextRef}
              x={offsetX + contextStartX}
              y={0}
              height={height}
              paddingX={paddingX}
              paddingY={0}
              onContextMenu={onContextMenu}
              contextMenuOpen={contextMenuOpen}
            />
          </>
        )}
        {children}
      </g>
    );
  }
);

export default TaskPill;
