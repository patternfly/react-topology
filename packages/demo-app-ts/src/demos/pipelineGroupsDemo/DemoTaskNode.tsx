import * as React from 'react';
import { observer } from 'mobx-react';
import {
  DEFAULT_LAYER,
  GraphElement,
  Layer,
  RunStatus,
  ScaleDetailsLevel,
  TaskNode,
  TOP_LAYER,
  useHover,
  WithContextMenuProps,
  WithSelectionProps
} from '@patternfly/react-topology';
import { BanIcon } from '@patternfly/react-icons';

type DemoTaskNodeProps = {
  element: GraphElement;
} & WithContextMenuProps &
  WithSelectionProps;

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
          customStatusIcon={data.status === RunStatus.Cancelled ? <BanIcon /> : undefined}
          {...rest}
        />
      </g>
    </Layer>
  );
};

export default observer(DemoTaskNode);
