import * as React from 'react';
import { observer } from 'mobx-react';
import {
  AnchorEnd,
  DagreLayoutOptions,
  PipelinesDefaultGroup,
  GraphElement,
  isNode,
  LabelPosition,
  Node,
  TOP_TO_BOTTOM,
  useAnchor,
  WithContextMenuProps,
  WithSelectionProps,
  ShapeProps,
  WithDragNodeProps,
} from '@patternfly/react-topology';
import TaskGroupSourceAnchor from './TaskGroupSourceAnchor';
import TaskGroupTargetAnchor from './TaskGroupTargetAnchor';

type DemoTaskGroupProps = {
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

const DemoTaskGroup: React.FunctionComponent<DemoTaskGroupProps> = ({ element, collapsedWidth, collapsedHeight, ...rest }) => {
  const verticalLayout = (element.getGraph().getLayoutOptions?.() as DagreLayoutOptions)?.rankdir === TOP_TO_BOTTOM;

  useAnchor(
    React.useCallback((node: Node) => new TaskGroupSourceAnchor(node, verticalLayout), [verticalLayout]),
    AnchorEnd.source
  );
  useAnchor(
    React.useCallback((node: Node) => new TaskGroupTargetAnchor(node, verticalLayout), [verticalLayout]),
    AnchorEnd.target
  );
  if (!isNode(element)) {
    return null;
  }
  return (
    <PipelinesDefaultGroup
      hulledOutline={false}
      labelPosition={verticalLayout ? LabelPosition.top : LabelPosition.bottom}
      collapsible
      collapsedWidth={collapsedWidth}
      collapsedHeight={collapsedHeight}
      element={element as Node}
      {...rest}
    />
  );
};

export default observer(DemoTaskGroup);
