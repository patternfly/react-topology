import * as React from 'react';
import {
  DefaultTaskGroup,
  EdgeCreationTypes,
  GraphElement,
  LabelPosition,
  observer,
  ScaleDetailsLevel,
  WithContextMenuProps,
  WithDragNodeProps,
  WithSelectionProps,
} from '@patternfly/react-topology';
import { GROUPED_EDGE_TYPE } from './pipelineComponentFactory';

type DemoPipelinesGroupProps = {
  element: GraphElement;
} & WithContextMenuProps &
  WithDragNodeProps &
  WithSelectionProps;

const getEdgeCreationTypes = (): EdgeCreationTypes => ({
  edgeType: GROUPED_EDGE_TYPE,
  spacerEdgeType: GROUPED_EDGE_TYPE,
  finallyEdgeType: GROUPED_EDGE_TYPE,
});

const DemoPipelinesGroup: React.FunctionComponent<DemoPipelinesGroupProps> = ({ element }) => {
  const data = element.getData();
  const detailsLevel = element.getGraph().getDetailsLevel()

  return (
    <DefaultTaskGroup
      element={element}
      collapsible
      collapsedWidth={75}
      collapsedHeight={75}
      showLabel={detailsLevel === ScaleDetailsLevel.high}
      labelPosition={LabelPosition.top}
      badge={data?.badge}
      getEdgeCreationTypes={getEdgeCreationTypes}
    />
  );
};

export default observer(DemoPipelinesGroup);
