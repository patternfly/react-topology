import * as React from 'react';
import { observer } from 'mobx-react';
import {
  DefaultEdge,
  Edge, EdgeTerminalType,
  getEdgeAnimationDuration,
  WithContextMenuProps,
  WithSelectionProps
} from '@patternfly/react-topology';
import { DemoContext } from './DemoContext';
import {
  EDGE_ANIMATION_SPEEDS,
  EDGE_STYLES,
  EDGE_TERMINAL_TYPES,
  NODE_STATUSES
} from './generator';

type DemoEdgeProps = {
  element: Edge;
} & WithContextMenuProps &
  WithSelectionProps;

const DemoEdge: React.FunctionComponent<DemoEdgeProps> = ({ element, ...rest }) => {
  const options = React.useContext(DemoContext).edgeOptions;
  const data = element.getData();

  return (
    <DefaultEdge
      element={element}
      {...rest}
      edgeStyle={options.showStyles && EDGE_STYLES[data.index % EDGE_STYLES.length]}
      animationDuration={options.showAnimations && getEdgeAnimationDuration(EDGE_ANIMATION_SPEEDS[data.index % EDGE_ANIMATION_SPEEDS.length])}
      endTerminalType={options.terminalTypes ? EDGE_TERMINAL_TYPES[data.index % EDGE_TERMINAL_TYPES.length] : EdgeTerminalType.directional}
      endTerminalStatus={options.showStatus && NODE_STATUSES[data.index % NODE_STATUSES.length]}
      tag={options.showTags ? data.tag : undefined}
      tagStatus={options.showStatus && NODE_STATUSES[data.index % NODE_STATUSES.length]}
    />
  );
};

export default observer(DemoEdge);
