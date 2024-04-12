import * as React from 'react';
import { observer } from 'mobx-react';
import { OnSelect, WithDndDragProps, ConnectDragSource, ConnectDropTarget, WithSelectionProps } from '../../../behavior';
import { ShapeProps } from '../../../components';
import { Dimensions } from '../../../geom';
import { GraphElement, LabelPosition, BadgeLocation, isNode, Node } from '../../../types';
import { getEdgesFromNodes, getSpacerNodes } from '../../utils';
import DefaultTaskGroupCollapsed from './DefaultTaskGroupCollapsed';
import DefaultTaskGroupExpanded from './DefaultTaskGroupExpanded';

export interface EdgeCreationTypes {
  spacerNodeType?: string,
  edgeType?: string;
  spacerEdgeType?: string;
  finallyNodeTypes?: string[];
  finallyEdgeType?: string;
}

interface PipelinesDefaultGroupProps {
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
  /** Flag to recreate the layout when the group is expanded/collapsed. Be sure you are registering "pipelineElementFactory" when set to true. */
  recreateLayoutOnCollapseChange?: boolean;
  /** Function to return types used to re-create edges on a group collapse/expand (should be the same as calls to getEdgesFromNodes) */
  getEdgeCreationTypes?: () => {
    spacerNodeType?: string,
    edgeType?: string;
    spacerEdgeType?: string;
    finallyNodeTypes?: string[];
    finallyEdgeType?: string;
  };
}

type PipelinesDefaultGroupInnerProps = Omit<PipelinesDefaultGroupProps, 'element'> & { element: Node } & WithSelectionProps;

const DefaultTaskGroupInner: React.FunctionComponent<PipelinesDefaultGroupInnerProps> = observer(
  ({ className, element, onCollapseChange, recreateLayoutOnCollapseChange, getEdgeCreationTypes, ...rest }) => {
    const childCount = element.getAllNodeChildren().length;

    const handleCollapse = (group: Node, collapsed: boolean): void => {
      if (collapsed && rest.collapsedWidth !== undefined && rest.collapsedHeight !== undefined) {
        group.setDimensions(new Dimensions(rest.collapsedWidth, rest.collapsedHeight));
      }
      group.setCollapsed(collapsed);

      if (recreateLayoutOnCollapseChange) {
        const controller = group.hasController() && group.getController();
        if (controller) {
          const model = controller.toModel();
          const creationTypes: EdgeCreationTypes = getEdgeCreationTypes ? getEdgeCreationTypes() : {};

          const pipelineNodes = model.nodes.filter((n) => n.type !== creationTypes.spacerNodeType).map((n) => ({
            ...n,
            visible: true
          }));
          const spacerNodes = getSpacerNodes(pipelineNodes, creationTypes.spacerNodeType, creationTypes.finallyNodeTypes);
          const nodes = [...pipelineNodes, ...spacerNodes];
          const edges = getEdgesFromNodes(
            pipelineNodes,
            creationTypes.spacerNodeType,
            creationTypes.edgeType,
            creationTypes.edgeType,
            creationTypes.finallyNodeTypes,
            creationTypes.finallyEdgeType
          );
          controller.fromModel({nodes, edges}, true);
          controller.getGraph().layout();
        }
      }

      onCollapseChange && onCollapseChange(group, collapsed);
    };

    if (element.isCollapsed()) {
      return (
        <DefaultTaskGroupCollapsed
          className={className}
          element={element}
          onCollapseChange={handleCollapse}
          badge={`${childCount}`}
          badgeColor="#f5f5f5"
          badgeBorderColor="#d2d2d2"
          badgeTextColor="#000000"
          {...rest}
        />
      );
    }
    return (
      <DefaultTaskGroupExpanded
        className={className}
        labelPosition={LabelPosition.top}
        element={element}
        onCollapseChange={handleCollapse}
        badgeColor="#f5f5f5"
        badgeBorderColor="#d2d2d2"
        badgeTextColor="#000000"
        {...rest}
      />
    );
  }
);

const DefaultTaskGroup: React.FunctionComponent<PipelinesDefaultGroupProps> = ({
  element,
  ...rest
}: PipelinesDefaultGroupProps) => {
  if (!isNode(element)) {
    throw new Error('DefaultTaskGroup must be used only on Node elements');
  }

  return <DefaultTaskGroupInner element={element} {...rest} />;
};

export default DefaultTaskGroup;
