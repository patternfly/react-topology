import * as React from 'react';
import { observer } from 'mobx-react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-topology/src/css/topology-pipelines';
import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-alt-icon';
import { WithDragNodeProps, WithSelectionProps, WithDndDropProps, WithContextMenuProps, useDragNode } from "../../../behavior";
import { CollapsibleGroupProps, Stadium, Layer, PipelinesNodeLabel } from "../../../components";
import { GROUPS_LAYER } from "../../../const";
import { LabelPosition, BadgeLocation, Node } from "../../../types";
import { useHover, useCombineRefs } from "../../../utils";

type PipelinesDefaultGroupCollapsedProps = {
  children?: React.ReactNode;
  className?: string;
  element: Node;
  droppable?: boolean;
  canDrop?: boolean;
  dropTarget?: boolean;
  dragging?: boolean;
  hover?: boolean;
  label?: string; // Defaults to element.getLabel()
  secondaryLabel?: string;
  showLabel?: boolean; // Defaults to true
  labelPosition?: LabelPosition; // Defaults to bottom
  truncateLength?: number; // Defaults to 13
  labelIconClass?: string; // Icon to show in label
  labelIcon?: string;
  labelIconPadding?: number;
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  badgeBorderColor?: string;
  badgeClassName?: string;
  badgeLocation?: BadgeLocation;
} & CollapsibleGroupProps & WithDragNodeProps & WithSelectionProps & WithDndDropProps & WithContextMenuProps;

const PipelinesDefaultGroupCollapsed: React.FunctionComponent<PipelinesDefaultGroupCollapsedProps> = ({
  className,
  element,
  collapsible,
  selected,
  onSelect,
  children,
  hover,
  label,
  showLabel = true,
  truncateLength,
  collapsedWidth,
  collapsedHeight,
  onCollapseChange,
  collapsedShadowOffset = 8,
  dragNodeRef,
  canDrop,
  dropTarget,
  onContextMenu,
  dragging,
  labelPosition,
  badge,
  badgeColor,
  badgeTextColor,
  badgeBorderColor,
  badgeClassName,
  badgeLocation,
  labelIconClass,
  labelIcon,
  labelIconPadding
}) => {
  const [hovered, hoverRef] = useHover();
  const [labelHover, labelHoverRef] = useHover();
  const dragLabelRef = useDragNode()[1];
  const refs = useCombineRefs<SVGPathElement>(hoverRef, dragNodeRef);
  const isHover = hover !== undefined ? hover : hovered;

  const groupClassName = css(
    styles.topologyPipelinesGroup,
    className,
    canDrop && 'pf-m-highlight',
    canDrop && dropTarget && 'pf-m-drop-target',
    dragging && 'pf-m-dragging',
    selected && 'pf-m-selected'
  );

  return (
    <g ref={labelHoverRef} onContextMenu={onContextMenu} onClick={onSelect} className={groupClassName}>
      <Layer id={GROUPS_LAYER}>
        <g ref={refs} onClick={onSelect}>
            <>
              <g transform={`translate(${collapsedShadowOffset * 2}, 0)`}>
                <Stadium
                  className={css(styles.topologyPipelinesNodeBackground, 'pf-m-disabled')}
                  element={element}
                  width={1}
                  height={1}
                />
              </g>
            </>
        </g>
      </Layer>
      {showLabel && (
        <PipelinesNodeLabel
          className={styles.topologyPipelinesGroupLabel}
          x={collapsedWidth / 2}
          y={labelPosition === LabelPosition.top ? 0 : collapsedHeight + 6}
          paddingX={8}
          paddingY={5}
          dragRef={dragNodeRef ? dragLabelRef : undefined}
          status={element.getNodeStatus()}
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
          hover={isHover || labelHover}
          actionIcon={collapsible ? <ExpandIcon /> : undefined}
          onActionIconClick={() => onCollapseChange(element, false)}
        >
          {label || element.getLabel()}
        </PipelinesNodeLabel>
      )}
      {children}
    </g>
  );
};

export default observer(PipelinesDefaultGroupCollapsed);
