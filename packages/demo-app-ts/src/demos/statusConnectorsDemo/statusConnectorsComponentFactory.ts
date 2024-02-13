import { ComponentType } from 'react';
import {
  GraphElement,
  ComponentFactory,
  ModelKind,
  GraphComponent,
  withPanZoom
} from '@patternfly/react-topology';
import DefaultEdge from '../../components/DemoDefaultEdge';
import StatusConnectorNode from './StatusConnectorNode';
import SuccessEdge from './SuccessEdge';
import FailedEdge from './FailedEdge';

const statusConnectorsComponentFactory: ComponentFactory = (
  kind: ModelKind,
  type: string
): ComponentType<{ element: GraphElement }> => {
  switch (type) {
    case 'failed-edge':
      return FailedEdge;
    case 'success-edge':
      return SuccessEdge;
    default:
      switch (kind) {
        case ModelKind.graph:
          return withPanZoom()(GraphComponent);
        case ModelKind.node:
          return StatusConnectorNode;
        case ModelKind.edge:
          return DefaultEdge;
        default:
          return undefined;
      }
  }
};

export default statusConnectorsComponentFactory;
