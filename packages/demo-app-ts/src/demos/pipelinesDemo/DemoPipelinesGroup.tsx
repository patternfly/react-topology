import * as React from 'react';
import {
  DefaultTaskGroup,
  GraphElement,
  LabelPosition,
  observer,
  ScaleDetailsLevel,
  WithContextMenuProps,
  WithDragNodeProps,
  WithSelectionProps,
} from '@patternfly/react-topology';

type DemoPipelinesGroupProps = {
  element: GraphElement;
} & WithContextMenuProps &
  WithDragNodeProps &
  WithSelectionProps;

const DemoPipelinesGroup: React.FunctionComponent<DemoPipelinesGroupProps> = ({ element }) => {
  const data = element.getData();
  const detailsLevel = element.getGraph().getDetailsLevel()

  return (
    <DefaultTaskGroup
      element={element}
      collapsible={false}
      showLabel={detailsLevel === ScaleDetailsLevel.high}
      labelPosition={LabelPosition.top}
      badge={data?.badge}
    />
  );
};

export default observer(DemoPipelinesGroup);
