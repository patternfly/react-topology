import { observer } from 'mobx-react';
import {
  WithCreateConnectorProps,
  WithContextMenuProps,
  WithDragNodeProps,
  WithSelectionProps,
  WithDndDragProps,
  WithDndDropProps,
  GraphElement
} from '@patternfly/react-topology';
import Path from './shapes/Path';
import DemoDefaultNode from './DemoDefaultNode';

type CustomPathNodeProps = {
  element: GraphElement;
  droppable?: boolean;
  canDrop?: boolean;
} & WithSelectionProps &
  WithDragNodeProps &
  WithDndDragProps &
  WithDndDropProps &
  WithCreateConnectorProps &
  WithContextMenuProps;

const CustomPathNode: React.FunctionComponent<CustomPathNodeProps> = (props) => (
  <DemoDefaultNode getCustomShape={() => Path} {...props} />
);

export default observer(CustomPathNode);
