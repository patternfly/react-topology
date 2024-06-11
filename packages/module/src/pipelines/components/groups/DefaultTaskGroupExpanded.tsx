import * as React from 'react';
import { observer } from 'mobx-react';
import { css } from '@patternfly/react-styles';
import styles from '../../../css/topology-components';
import CollapseIcon from '@patternfly/react-icons/dist/esm/icons/compress-alt-icon';
import NodeLabel from '../../../components/nodes/labels/NodeLabel';
import { Layer } from '../../../components/layers';
import { GROUPS_LAYER, TOP_LAYER } from '../../../const';
import { maxPadding, useCombineRefs, useHover, useSize } from '../../../utils';
import { AnchorEnd, isGraph, LabelPosition, Node, NodeStyle, ScaleDetailsLevel } from '../../../types';
import { useAnchor, useDragNode } from '../../../behavior';
import { DagreLayoutOptions, TOP_TO_BOTTOM } from '../../../layouts';
import TaskGroupSourceAnchor from '../anchors/TaskGroupSourceAnchor';
import TaskGroupTargetAnchor from '../anchors/TaskGroupTargetAnchor';
import { DefaultTaskGroupProps } from './DefaultTaskGroup';

const DefaultTaskGroupExpanded: React.FunctionComponent<Omit<DefaultTaskGroupProps, 'element'> & { element: Node }> =
  observer(
    ({
      className,
      element,
      collapsible,
      selected,
      onSelect,
      hover,
      label,
      secondaryLabel,
      showLabel = true,
      showLabelOnHover,
      hideDetailsAtMedium,
      truncateLength,
      canDrop,
      dropTarget,
      onContextMenu,
      contextMenuOpen,
      dragging,
      dragNodeRef,
      badge,
      badgeColor,
      badgeTextColor,
      badgeBorderColor,
      badgeClassName,
      badgeLocation,
      labelOffset = 17,
      centerLabelOnEdge,
      labelIconClass,
      labelIcon,
      labelIconPadding,
      onCollapseChange,
      labelPosition
    }) => {
      const [hovered, hoverRef] = useHover(200, 500);
      const [labelHover, labelHoverRef] = useHover(0);
      const dragLabelRef = useDragNode()[1];
      const [labelSize, labelRef] = useSize([centerLabelOnEdge]);
      const refs = useCombineRefs<SVGPathElement>(hoverRef, dragNodeRef);
      const isHover = hover !== undefined ? hover : hovered || labelHover;
      const verticalLayout = (element.getGraph().getLayoutOptions?.() as DagreLayoutOptions)?.rankdir === TOP_TO_BOTTOM;
      const groupLabelPosition = labelPosition ?? element.getLabelPosition() ?? LabelPosition.bottom;
      let parent = element.getParent();
      const detailsLevel = element.getGraph().getDetailsLevel();
      let altGroup = false;
      while (!isGraph(parent)) {
        altGroup = !altGroup;
        parent = parent.getParent();
      }
      const labelShown =
        showLabel &&
        (!hideDetailsAtMedium || detailsLevel === ScaleDetailsLevel.high || (isHover && showLabelOnHover)) &&
        (label || element.getLabel());

      const anchorOffset = verticalLayout ? labelSize?.height / 2 : labelSize?.width / 2;
      useAnchor(
        React.useCallback(
          (node: Node) =>
            new TaskGroupSourceAnchor(
              node,
              verticalLayout,
              labelShown &&
              ((centerLabelOnEdge && labelPosition === LabelPosition.bottom && verticalLayout) ||
                (labelPosition === LabelPosition.right && !verticalLayout)) &&
              labelSize
                ? anchorOffset
                : 0
            ),
          [labelShown, anchorOffset, centerLabelOnEdge, labelPosition, labelSize, verticalLayout]
        ),
        AnchorEnd.source
      );
      useAnchor(
        React.useCallback(
          (node: Node) =>
            new TaskGroupTargetAnchor(
              node,
              verticalLayout,
              labelShown &&
              ((centerLabelOnEdge && labelPosition === LabelPosition.top && verticalLayout) ||
                (labelPosition === LabelPosition.left && !verticalLayout)) &&
              labelSize
                ? anchorOffset
                : 0
            ),
          [labelShown, anchorOffset, centerLabelOnEdge, labelPosition, labelSize, verticalLayout]
        ),
        AnchorEnd.target
      );

      const children = element.getNodes().filter((c) => c.isVisible());

      // cast to number and coerce
      const padding = maxPadding(element.getStyle<NodeStyle>().padding ?? 17);

      const { minX, minY, maxX, maxY } = children.reduce(
        (acc, child) => {
          const bounds = child.getBounds();
          return {
            minX: Math.min(acc.minX, bounds.x - padding),
            minY: Math.min(acc.minY, bounds.y - padding),
            maxX: Math.max(acc.maxX, bounds.x + bounds.width + padding),
            maxY: Math.max(acc.maxY, bounds.y + bounds.height + padding)
          };
        },
        { minX: Infinity, minY: Infinity, maxX: 0, maxY: 0 }
      );

      const [labelX, labelY] = React.useMemo(() => {
        if (!showLabel || !(label || element.getLabel())) {
          return [0, 0];
        }
        switch (groupLabelPosition) {
          case LabelPosition.top:
            return [minX + (maxX - minX) / 2, -minY + (centerLabelOnEdge ? 0 : labelOffset)];
          case LabelPosition.right:
            return [maxX + (centerLabelOnEdge ? 0 : labelOffset), minY + (maxY - minY) / 2];
          case LabelPosition.left:
            return [centerLabelOnEdge ? minX : labelOffset, minY + (maxY - minY) / 2];
          case LabelPosition.bottom:
          default:
            return [minX + (maxX - minX) / 2, maxY + (centerLabelOnEdge ? 0 : labelOffset)];
        }
      }, [showLabel, label, element, groupLabelPosition, minX, maxX, minY, centerLabelOnEdge, labelOffset, maxY]);

      if (children.length === 0) {
        return null;
      }

      const groupClassName = css(
        styles.topologyGroup,
        className,
        altGroup && 'pf-m-alt-group',
        canDrop && 'pf-m-highlight',
        dragging && 'pf-m-dragging',
        selected && 'pf-m-selected'
      );
      const innerGroupClassName = css(
        styles.topologyGroup,
        className,
        altGroup && 'pf-m-alt-group',
        canDrop && 'pf-m-highlight',
        dragging && 'pf-m-dragging',
        selected && 'pf-m-selected',
        isHover && 'pf-m-hover',
        canDrop && dropTarget && 'pf-m-drop-target'
      );

      const scale = element.getGraph().getScale();
      const medScale = element.getGraph().getDetailsLevelThresholds().medium;
      const labelScale = detailsLevel !== ScaleDetailsLevel.high ? Math.min(1 / scale, 1 / medScale) : 1;
      const labelPositionScale = detailsLevel !== ScaleDetailsLevel.high ? 1 / labelScale : 1;

      const groupLabel = labelShown ? (
        <g ref={labelHoverRef} transform={isHover ? `scale(${labelScale})` : undefined}>
          <NodeLabel
            boxRef={labelRef}
            className={styles.topologyGroupLabel}
            x={labelX * labelPositionScale}
            y={labelY * labelPositionScale}
            position={labelPosition}
            centerLabelOnEdge={centerLabelOnEdge}
            paddingX={8}
            paddingY={5}
            dragRef={dragNodeRef ? dragLabelRef : undefined}
            status={element.getNodeStatus()}
            secondaryLabel={secondaryLabel}
            truncateLength={truncateLength}
            badge={badge}
            badgeColor={badgeColor}
            badgeTextColor={badgeTextColor}
            badgeBorderColor={badgeBorderColor}
            badgeClassName={badgeClassName}
            badgeLocation={badgeLocation}
            labelIconClass={labelIconClass}
            labelIcon={labelIcon}
            labelIconPadding={labelIconPadding}
            onContextMenu={onContextMenu}
            contextMenuOpen={contextMenuOpen}
            hover={isHover}
            actionIcon={collapsible ? <CollapseIcon /> : undefined}
            onActionIconClick={() => onCollapseChange(element, true)}
          >
            {label || element.getLabel()}
          </NodeLabel>
        </g>
      ) : null;

      return (
        <g onContextMenu={onContextMenu} onClick={onSelect} className={groupClassName}>
          <Layer id={GROUPS_LAYER}>
            <g ref={refs} onContextMenu={onContextMenu} onClick={onSelect} className={innerGroupClassName}>
              <rect
                x={minX}
                y={minY}
                width={maxX - minX}
                height={maxY - minY}
                className={styles.topologyGroupBackground}
              />
            </g>
            {groupLabel && isHover ? <Layer id={TOP_LAYER}>{groupLabel}</Layer> : groupLabel}
          </Layer>
        </g>
      );
    }
  );

export default DefaultTaskGroupExpanded;
