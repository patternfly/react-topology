import * as React from 'react';
import { observer } from 'mobx-react';
import {
  DEFAULT_LAYER,
  FinallyNode,
  GraphElement,
  Layer,
  ScaleDetailsLevel,
  TOP_LAYER,
  useHover,
  WithContextMenuProps,
  WithSelectionProps
} from '@patternfly/react-topology';

type DemoFinallyNodeProps = {
  element: GraphElement;
} & WithContextMenuProps & WithSelectionProps;

const DemoFinallyNode: React.FunctionComponent<DemoFinallyNodeProps> = ({ ...props }) => {
  const [hover, hoverRef] = useHover();
  const detailsLevel = props.element.getGraph().getDetailsLevel();

  return (
    <Layer id={detailsLevel !== ScaleDetailsLevel.high && hover ? TOP_LAYER : DEFAULT_LAYER}>
      <g ref={hoverRef}>
        <FinallyNode scaleNode={hover && detailsLevel !== ScaleDetailsLevel.high} hideDetailsAtMedium {...props} />
      </g>
    </Layer>
  );
};

export default observer(DemoFinallyNode);
