import * as React from 'react';
import {
  DefaultTaskGroup,
  GraphElement,
  LabelPosition,
  observer,
  WithContextMenuProps,
  WithDragNodeProps,
  WithSelectionProps
} from '@patternfly/react-topology';

type DemoPipelinesGroupProps = {
  element: GraphElement;
} & WithContextMenuProps &
  WithDragNodeProps &
  WithSelectionProps;

const DemoPipelinesGroup: React.FunctionComponent<DemoPipelinesGroupProps> = ({ element }) => {
  const data = element.getData();

  return (
    <DefaultTaskGroup
      element={element}
      collapsible={false}
      labelPosition={LabelPosition.top}
      showLabelOnHover
      hideDetailsAtMedium
      badge={data?.badge}
    />
  );
};

export default observer(DemoPipelinesGroup);
