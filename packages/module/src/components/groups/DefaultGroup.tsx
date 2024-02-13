import * as React from 'react';
import { observer } from 'mobx-react';
import DefaultGroupExpanded from './DefaultGroupExpanded';
import { OnSelect, WithDndDragProps, ConnectDragSource, ConnectDropTarget } from '../../behavior';
import { BadgeLocation, GraphElement, isNode, LabelPosition, Node } from '../../types';
import { ShapeProps } from '../nodes';
import { Dimensions } from '../../geom';
import DefaultGroupCollapsed from './DefaultGroupCollapsed';

interface DefaultGroupProps {
  /** Additional content added to the node */
  children?: React.ReactNode;
  /** Additional classes added to the group */
  className?: string;
  /** The graph group node element to represent */
  element: GraphElement;
  /** Flag if the node accepts drop operations */
  droppable?: boolean;
  /** Flag if the current drag operation can be dropped on the node */
  canDrop?: boolean;
  /** Flag if the node is the current drop target */
  dropTarget?: boolean;
  /** Flag if the user is dragging the node */
  dragging?: boolean;
  /** Flag if drag operation is a regroup operation */
  dragRegroupable?: boolean;
  /** Flag if the user is hovering on the node */
  hover?: boolean;
  /** Label for the node. Defaults to element.getLabel() */
  label?: string; // Defaults to element.getLabel()
  /** Secondary label for the node */
  secondaryLabel?: string;
  /** Flag to show the label */
  showLabel?: boolean; // Defaults to true
  /** Position of the label, top or bottom. Defaults to element.getLabelPosition() or bottom */
  labelPosition?: LabelPosition;
  /** The maximum length of the label before truncation */
  truncateLength?: number;
  /** The Icon class to show in the label, ignored when labelIcon is specified */
  labelIconClass?: string;
  /** The label icon component to show in the label, takes precedence over labelIconClass */
  labelIcon?: string;
  /** Padding for the label's icon */
  labelIconPadding?: number;
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
  /** Location of the badge relative to the label's text, inner or below */
  badgeLocation?: BadgeLocation;
  /** Flag if the group is collapsible */
  collapsible?: boolean;
  /** Width of the collapsed group */
  collapsedWidth?: number;
  /** Height of the collapsed group */
  collapsedHeight?: number;
  /** Callback when the group is collapsed */
  onCollapseChange?: (group: Node, collapsed: boolean) => void;
  /** Shape of the collapsed group */
  getCollapsedShape?: (node: Node) => React.FunctionComponent<ShapeProps>;
  /** Shadow offset for the collapsed group */
  collapsedShadowOffset?: number;
  /** Flag if the element selected. Part of WithSelectionProps */
  selected?: boolean;
  /** Function to call when the element should become selected (or deselected). Part of WithSelectionProps */
  onSelect?: OnSelect;
  /** A ref to add to the node for dragging. Part of WithDragNodeProps */
  dragNodeRef?: WithDndDragProps['dndDragRef'];
  /** A ref to add to the node for drag and drop. Part of WithDndDragProps */
  dndDragRef?: ConnectDragSource;
  /** A ref to add to the node for dropping. Part of WithDndDropProps */
  dndDropRef?: ConnectDropTarget;
  /** Function to call to show a context menu for the node  */
  onContextMenu?: (e: React.MouseEvent) => void;
  /** Flag indicating that the context menu for the node is currently open  */
  contextMenuOpen?: boolean;
  /** Flag indicating whether to use hull layout or rect layout for expanded groups. Defaults to hull (true) */
  hulledOutline?: boolean;
}

type DefaultGroupInnerProps = Omit<DefaultGroupProps, 'element'> & { element: Node };

const DefaultGroupInner: React.FunctionComponent<DefaultGroupInnerProps> = observer(({
  className,
  element,
  onCollapseChange,
  ...rest
}) => {
  const handleCollapse = (group: Node, collapsed: boolean): void => {
    if (collapsed && rest.collapsedWidth !== undefined && rest.collapsedHeight !== undefined) {
      group.setDimensions(new Dimensions(rest.collapsedWidth, rest.collapsedHeight));
    }
    group.setCollapsed(collapsed);
    onCollapseChange && onCollapseChange(group, collapsed);
  };

  if (element.isCollapsed()) {
    return (
      <DefaultGroupCollapsed className={className} element={element} onCollapseChange={handleCollapse} {...rest} />
    );
  }
  return <DefaultGroupExpanded className={className} element={element} onCollapseChange={handleCollapse} {...rest} />;
});

const DefaultGroup: React.FunctionComponent<DefaultGroupProps> = ({ element, ...rest }: DefaultGroupProps) => {
  if (!isNode(element)) {
    throw new Error('DefaultGroup must be used only on Node elements');
  }

  return <DefaultGroupInner element={element} {...rest} />;
};

export default DefaultGroup;
