import * as React from 'react';
import { observer } from 'mobx-react';
import {
  DagreLayoutOptions,
  DefaultTaskGroup,
  GraphElement,
  isNode,
  LabelPosition,
  Node,
  TOP_TO_BOTTOM,
  WithSelectionProps,
  EdgeCreationTypes,
  useHover,
  ScaleDetailsLevel,
  RunStatus,
  TaskGroupPillLabel
} from '@patternfly/react-topology';
import { DEFAULT_TASK_HEIGHT, GROUP_TASK_WIDTH } from './createDemoPipelineGroupsNodes';

type DemoTaskGroupProps = {
  element: GraphElement;
} & WithSelectionProps;

const getEdgeCreationTypes = (): EdgeCreationTypes => ({
  edgeType: 'edge',
  spacerEdgeType: 'edge'
});

const DemoTaskGroup: React.FunctionComponent<DemoTaskGroupProps> = ({ element, ...rest }) => {
  const verticalLayout = (element.getGraph().getLayoutOptions?.() as DagreLayoutOptions)?.rankdir === TOP_TO_BOTTOM;
  const [hover, hoverRef] = useHover();
  const detailsLevel = element.getGraph().getDetailsLevel();
  const data = element.getData();

  if (!isNode(element)) {
    return null;
  }

  return (
    <g id="group-hover-ref" ref={hoverRef}>
      <DefaultTaskGroup
        labelPosition={verticalLayout ? LabelPosition.top : LabelPosition.bottom}
        collapsible
        collapsedWidth={GROUP_TASK_WIDTH}
        collapsedHeight={DEFAULT_TASK_HEIGHT}
        GroupLabelComponent={TaskGroupPillLabel}
        element={element as Node}
        centerLabelOnEdge
        recreateLayoutOnCollapseChange
        getEdgeCreationTypes={getEdgeCreationTypes}
        scaleNode={hover && detailsLevel !== ScaleDetailsLevel.high}
        showLabelOnHover
        hideDetailsAtMedium
        showStatusState
        status={data.status}
        hiddenDetailsShownStatuses={[RunStatus.Succeeded]}
        {...rest}
      />
    </g>
  );
};

export default observer(DemoTaskGroup);
