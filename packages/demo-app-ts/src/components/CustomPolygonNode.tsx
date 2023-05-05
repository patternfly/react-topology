import * as React from 'react';
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
import Polygon from './shapes/Polygon';
import DemoDefaultNode from './DemoDefaultNode';

type CustomPolygonNodeProps = {
  element: GraphElement;
  droppable?: boolean;
  canDrop?: boolean;
} & WithSelectionProps &
  WithDragNodeProps &
  WithDndDragProps &
  WithDndDropProps &
  WithCreateConnectorProps &
  WithContextMenuProps;

const CustomPolygonNode: React.FunctionComponent<CustomPolygonNodeProps> = props => (
  <DemoDefaultNode getCustomShape={() => Polygon} {...props} />
);

export default observer(CustomPolygonNode);
