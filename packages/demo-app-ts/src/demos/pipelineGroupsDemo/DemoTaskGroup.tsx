import * as React from 'react';
import { observer } from 'mobx-react';
import {
  AnchorEnd,
  DagreLayoutOptions,
  DefaultTaskGroup,
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
  EdgeCreationTypes,
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

export const DEFAULT_TASK_WIDTH = 180;
export const DEFAULT_TASK_HEIGHT = 32;

const getEdgeCreationTypes = (): EdgeCreationTypes => ({
  edgeType: 'edge',
  spacerEdgeType: 'edge'
});

const DemoTaskGroup: React.FunctionComponent<DemoTaskGroupProps> = ({ element, ...rest }) => {
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
    <DefaultTaskGroup
      labelPosition={verticalLayout ? LabelPosition.top : LabelPosition.bottom}
      collapsible
      collapsedWidth={DEFAULT_TASK_WIDTH}
      collapsedHeight={DEFAULT_TASK_HEIGHT}
      element={element as Node}
      recreateLayoutOnCollapseChange
      getEdgeCreationTypes={getEdgeCreationTypes}
      {...rest}
    />
  );
};

export default observer(DemoTaskGroup);
