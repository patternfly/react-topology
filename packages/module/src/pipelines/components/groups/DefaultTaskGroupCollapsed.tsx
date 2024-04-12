import * as React from 'react';
import { observer } from 'mobx-react';
import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-alt-icon';
import { CollapsibleGroupProps } from "../../../components";
import { Node } from '../../../types';
import { TaskNode } from '../nodes';
import { TaskNodeProps } from '../nodes/TaskNode';

export type DefaultTaskGroupCollapsedProps = {
  element: Node;
  shadowCount?: number;
} & Omit<TaskNodeProps, 'element'> & CollapsibleGroupProps;

const DefaultTaskGroupCollapsed: React.FunctionComponent<DefaultTaskGroupCollapsedProps> = ({
  element,
  shadowCount = 2,
  collapsible,
  onCollapseChange,
  ...rest
}) => {

  return (
    <TaskNode
      element={element} {...rest}
      actionIcon={collapsible ? <ExpandIcon /> : undefined}
      onActionIconClick={() => onCollapseChange(element, false)}
      shadowCount={shadowCount}
      {...rest}
    />
  );
};

export default observer(DefaultTaskGroupCollapsed);
