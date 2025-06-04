import { observer } from 'mobx-react';
import {
  WithCreateConnectorProps,
  WithContextMenuProps,
  WithDragNodeProps,
  WithSelectionProps,
  WithDndDragProps,
  WithDndDropProps,
  ShapeProps,
  useAnchor,
  RectAnchor,
  GraphElement
} from '@patternfly/react-topology';
import DemoDefaultNode from './DemoDefaultNode';

type CustomRectNodeProps = {
  element: GraphElement;
  droppable?: boolean;
  canDrop?: boolean;
} & WithSelectionProps &
  WithDragNodeProps &
  WithDndDragProps &
  WithDndDropProps &
  WithCreateConnectorProps &
  WithContextMenuProps;

const CustomRect: React.FunctionComponent<ShapeProps> = observer(({ className }) => {
  useAnchor(RectAnchor);
  return <rect className={className} x={0} y={0} width={100} height={20} />;
});

const CustomRectNode: React.FunctionComponent<CustomRectNodeProps> = (props) => (
  <DemoDefaultNode getCustomShape={() => CustomRect} {...props} />
);

export default observer(CustomRectNode);
