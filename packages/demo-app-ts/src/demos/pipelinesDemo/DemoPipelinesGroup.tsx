import * as React from 'react';
import {
  GraphElement,
  Node,
  ScaleDetailsLevel,
  ShapeProps,
  WithContextMenuProps,
  WithDragNodeProps,
  WithSelectionProps,
  PipelinesDefaultGroup,
  AnchorEnd,
  DagreLayoutOptions,
  TOP_TO_BOTTOM,
  useAnchor,
  Dimensions
} from '@patternfly/react-topology';

export enum DataTypes {
  Default,
  Alternate
}

type DemoPipelinesGroupProps = {
  element: GraphElement;
  collapsible?: boolean;
  collapsedWidth?: number;
  collapsedHeight?: number;
  onCollapseChange?: (group: Node, collapsed: boolean) => void;
  getCollapsedShape?: (node: Node) => React.FunctionComponent<ShapeProps>;
  collapsedShadowOffset?: number; // defaults to 10
} & WithContextMenuProps &
  WithDragNodeProps &
  WithSelectionProps;

import TaskGroupSourceAnchor from '../pipelineGroupsDemo/TaskGroupSourceAnchor';
import TaskGroupTargetAnchor from '../pipelineGroupsDemo/TaskGroupTargetAnchor';

export const DemoPipelinesGroup: React.FunctionComponent<DemoPipelinesGroupProps> = ({
  element,
  onCollapseChange,
  ...rest
}) => {
  const data = element.getData();
  const detailsLevel = element.getGraph().getDetailsLevel();
  const verticalLayout = (element.getGraph().getLayoutOptions?.() as DagreLayoutOptions)?.rankdir === TOP_TO_BOTTOM;

  const handleCollapse = (group: Node, collapsed: boolean): void => {
    if (collapsed && rest.collapsedWidth !== undefined && rest.collapsedHeight !== undefined) {
      group.setDimensions(new Dimensions(rest.collapsedWidth, rest.collapsedHeight));
    }
    group.setCollapsed(collapsed);
    onCollapseChange && onCollapseChange(group, collapsed);
  };

  useAnchor(
    React.useCallback((node: Node) => new TaskGroupSourceAnchor(node, verticalLayout), [verticalLayout]),
    AnchorEnd.source
  );

  useAnchor(
    React.useCallback((node: Node) => new TaskGroupTargetAnchor(node, verticalLayout), [verticalLayout]),
    AnchorEnd.target
  );

  return (
    <PipelinesDefaultGroup
      element={element}
      collapsible
      collapsedWidth={75}
      collapsedHeight={75}
      // TODO: labels don't render until clicked
      showLabel={detailsLevel === ScaleDetailsLevel.high}
      badge={data?.badge}
      onCollapseChange={handleCollapse}
      {...rest}
    />
  );
};
