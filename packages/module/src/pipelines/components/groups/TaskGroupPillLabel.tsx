import * as React from 'react';
import { observer } from 'mobx-react';
import styles from '../../../css/topology-components';
import TaskPill, { TaskPillProps } from '../nodes/TaskPill';
import { NodeLabelProps } from '../../../components';
import { RunStatus } from '../../types';
import useCombineRefs from '../../../utils/useCombineRefs';
import { useSize } from '../../../utils';
import { LabelPosition, ScaleDetailsLevel } from '../../../types';

export type TaskGroupPillLabelProps = {
  shadowCount?: number;
  runStatus?: RunStatus;
  labelOffset?: number;
} & NodeLabelProps &
  Omit<TaskPillProps, 'status' | 'pillRef'>;

const TaskGroupPillLabel: React.FC<TaskGroupPillLabelProps> = ({
  element,
  labelOffset = 17,
  badge,
  badgeColor,
  badgeTextColor,
  badgeBorderColor,
  badgeClassName,
  runStatus,
  truncateLength,
  boxRef,
  position,
  centerLabelOnEdge,
  onContextMenu,
  contextMenuOpen,
  actionIcon,
  onActionIconClick,
  ...rest
}) => {
  const [labelSize, labelRef] = useSize([]);
  const pillRef = useCombineRefs(boxRef, labelRef);
  const labelWidth = labelSize?.width || 0;
  const labelHeight = labelSize?.height || 0;

  const bounds = element.getBounds();

  const detailsLevel = element.getGraph().getDetailsLevel();
  const scale = element.getGraph().getScale();
  const medScale = element.getGraph().getDetailsLevelThresholds().medium;
  const labelScale = detailsLevel !== ScaleDetailsLevel.high ? Math.min(1 / scale, 1 / medScale) : 1;
  const labelPositionScale = detailsLevel !== ScaleDetailsLevel.high ? 1 / labelScale : 1;

  const { startX, startY } = React.useMemo(() => {
    let startX: number;
    let startY: number;
    const scaledWidth = labelWidth / labelPositionScale;
    const scaledHeight = labelHeight / labelPositionScale;

    if (position === LabelPosition.top) {
      startX = bounds.x + bounds.width / 2 - scaledWidth / 2;
      startY = bounds.y - (centerLabelOnEdge ? scaledHeight / 2 : labelOffset);
    } else if (position === LabelPosition.right) {
      startX = bounds.x + bounds.width + (centerLabelOnEdge ? -scaledWidth / 2 : labelOffset);
      startY = bounds.y + bounds.height / 2;
    } else if (position === LabelPosition.left) {
      startX = bounds.x - (centerLabelOnEdge ? scaledWidth / 2 : scaledWidth + labelOffset);
      startY = bounds.y + bounds.height / 2;
    } else {
      startX = bounds.x + bounds.width / 2 - scaledWidth / 2;
      startY = bounds.y + bounds.height + (centerLabelOnEdge ? -scaledHeight / 2 : labelOffset);
    }
    return { startX, startY };
  }, [
    labelPositionScale,
    position,
    bounds.width,
    bounds.x,
    bounds.y,
    bounds.height,
    centerLabelOnEdge,
    labelHeight,
    labelOffset,
    labelWidth
  ]);

  return (
    <TaskPill
      {...rest}
      element={element}
      width={labelWidth}
      pillRef={pillRef}
      actionIcon={actionIcon}
      onActionIconClick={onActionIconClick}
      className={styles.topologyNodeLabel}
      status={runStatus}
      x={startX * labelPositionScale}
      y={startY * labelPositionScale}
      paddingX={8}
      paddingY={5}
      scaleNode={false}
      truncateLength={truncateLength}
      badge={badge}
      badgeColor={badgeColor}
      badgeTextColor={badgeTextColor}
      badgeBorderColor={badgeBorderColor}
      badgeClassName={badgeClassName}
      onContextMenu={onContextMenu}
      contextMenuOpen={contextMenuOpen}
    />
  );
};

export default observer(TaskGroupPillLabel);
