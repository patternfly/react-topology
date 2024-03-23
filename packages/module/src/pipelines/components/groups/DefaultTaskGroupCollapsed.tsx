import * as React from 'react';
import { observer } from 'mobx-react';
import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-alt-icon';
import { WithDragNodeProps, WithSelectionProps, WithDndDropProps, WithContextMenuProps } from '../../../behavior';
import { CollapsibleGroupProps } from "../../../components";
import { LabelPosition, BadgeLocation, Node } from '../../../types';
import { TaskNode } from '../nodes';

type DefaultTaskGroupCollapsedProps = {
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

const DefaultTaskGroupCollapsed: React.FunctionComponent<DefaultTaskGroupCollapsedProps> = ({
  element,
  collapsible,
  onCollapseChange,
  ...rest
}) => {

  return (
    <TaskNode
      element={element} {...rest}
      actionIcon={collapsible ? <ExpandIcon /> : undefined}
      onActionIconClick={() => onCollapseChange(element, false)}
      shadowCount={2}
    />
  );
};

export default observer(DefaultTaskGroupCollapsed);
