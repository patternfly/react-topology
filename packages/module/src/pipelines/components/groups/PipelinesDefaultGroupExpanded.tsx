import * as React from 'react';
import { observer } from 'mobx-react';
import { LabelPosition, Node } from '../../../types';
import DefaultTaskGroup from './DefaultTaskGroup';
import { CollapsibleGroupProps } from '../../../components';

type PipelinesDefaultGroupExpandedProps = {
  className?: string;
  element: Node;
  labelPosition?: LabelPosition;
  showLabel?: boolean;
} & CollapsibleGroupProps;

const PipelinesDefaultGroupExpanded: React.FunctionComponent<PipelinesDefaultGroupExpandedProps> = ({
  element,
  showLabel = true,
  labelPosition = LabelPosition.top,
  onCollapseChange,
  ...rest
}) => {
  return (
    <DefaultTaskGroup
      element={element}
      onCollapseChange={onCollapseChange}
      showLabel={showLabel}
      labelPosition={labelPosition}
      {...rest}
    />
  );
};

export default observer(PipelinesDefaultGroupExpanded);
