import * as React from 'react';
import { observer } from 'mobx-react';
import {
  DEFAULT_LAYER,
  GraphElement,
  Layer,
  ScaleDetailsLevel,
  TaskNode,
  TOP_LAYER,
  useHover,
  WithContextMenuProps,
  WithSelectionProps
} from '@patternfly/react-topology';

type DemoTaskNodeProps = {
  element: GraphElement;
} & WithContextMenuProps & WithSelectionProps;

const DemoTaskNode: React.FunctionComponent<DemoTaskNodeProps> = ({ element, ...rest }) => {
  const data = element.getData();
  const [hover, hoverRef] = useHover();
  const detailsLevel = element.getGraph().getDetailsLevel();

  return (
    <Layer id={detailsLevel !== ScaleDetailsLevel.high && hover ? TOP_LAYER : DEFAULT_LAYER}>
      <g ref={hoverRef}>
        <TaskNode
          element={element}
          scaleNode={hover && detailsLevel !== ScaleDetailsLevel.high}
          showStatusState
          status={data.status}
          hideDetailsAtMedium
          {...rest}
        />
      </g>
    </Layer>
  );
};

export default observer(DemoTaskNode);
