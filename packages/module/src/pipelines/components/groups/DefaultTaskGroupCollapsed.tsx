import { observer } from 'mobx-react';
import RhUiArrowUpRightDownLeftFromCenterIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-arrow-up-right-down-left-from-center-icon';
import { CollapsibleGroupProps } from '../../../components';
import { Node } from '../../../types';
import { TaskNode } from '../nodes';
import { TaskNodeProps } from '../nodes/TaskNode';

export type DefaultTaskGroupCollapsedProps = {
  element: Node;
  shadowCount?: number;
} & Omit<TaskNodeProps, 'element'> &
  CollapsibleGroupProps;

const DefaultTaskGroupCollapsed: React.FunctionComponent<DefaultTaskGroupCollapsedProps> = ({
  element,
  shadowCount = 2,
  collapsible,
  onCollapseChange,
  actionIconAriaLabel = 'expand',
  ...rest
}) => {
  return (
    <TaskNode
      element={element}
      actionIcon={collapsible ? <RhUiArrowUpRightDownLeftFromCenterIcon /> : undefined}
      onActionIconClick={() => onCollapseChange(element, false)}
      actionIconAriaLabel={actionIconAriaLabel}
      shadowCount={shadowCount}
      {...rest}
    />
  );
};

export default observer(DefaultTaskGroupCollapsed);
