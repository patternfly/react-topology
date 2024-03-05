import * as React from 'react';
import { observer } from 'mobx-react';
import {
  AnchorEnd,
  DagreLayoutOptions,
  DefaultGroup,
  GraphElement,
  isNode,
  LabelPosition,
  Node,
  TOP_TO_BOTTOM,
  useAnchor,
} from '@patternfly/react-topology';
import TaskGroupSourceAnchor from './TaskGroupSourceAnchor';
import TaskGroupTargetAnchor from './TaskGroupTargetAnchor';

interface DemoTaskNodeProps {
  element: GraphElement;
}

const DemoTaskGroup: React.FunctionComponent<DemoTaskNodeProps> = ({ element, ...rest }) => {
  const verticalLayout = (element.getGraph().getLayoutOptions?.() as DagreLayoutOptions)?.rankdir === TOP_TO_BOTTOM;

  useAnchor(
    React.useCallback((node: Node) =>new TaskGroupSourceAnchor(node, verticalLayout), [verticalLayout]),
    AnchorEnd.source
  );
  useAnchor(
    React.useCallback((node: Node) => new TaskGroupTargetAnchor(node, verticalLayout),[verticalLayout]),
    AnchorEnd.target
  );
  if (!isNode(element)) {
    return null;
  }
  return (
    <DefaultGroup hulledOutline={false} labelPosition={verticalLayout ? LabelPosition.top : LabelPosition.bottom} element={element as Node} {...rest} />
  );
};

export default observer(DemoTaskGroup);
