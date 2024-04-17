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
  DEFAULT_LAYER,
  Layer,
  TOP_LAYER,
  GROUPS_LAYER,
  RunStatus
} from '@patternfly/react-topology';

type DemoTaskGroupProps = {
  element: GraphElement;
} & WithSelectionProps;

export const DEFAULT_TASK_WIDTH = 180;
export const DEFAULT_TASK_HEIGHT = 32;

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
  const groupLayer = element.isCollapsed() ? DEFAULT_LAYER : GROUPS_LAYER;

  return (
    <Layer id={detailsLevel !== ScaleDetailsLevel.high && hover ? TOP_LAYER : groupLayer}>
      <g ref={hoverRef}>
        <DefaultTaskGroup
          labelPosition={verticalLayout ? LabelPosition.top : LabelPosition.bottom}
          collapsible
          collapsedWidth={DEFAULT_TASK_WIDTH}
          collapsedHeight={DEFAULT_TASK_HEIGHT}
          element={element as Node}
          recreateLayoutOnCollapseChange
          getEdgeCreationTypes={getEdgeCreationTypes}
          scaleNode={hover && detailsLevel !== ScaleDetailsLevel.high}
          showLabel={detailsLevel === ScaleDetailsLevel.high}
          hideDetailsAtMedium
          showStatusState
          status={data.status}
          hiddenDetailsShownStatuses={[RunStatus.Succeeded]}
          {...rest}
        />
      </g>
    </Layer>
  );
};

export default observer(DemoTaskGroup);
