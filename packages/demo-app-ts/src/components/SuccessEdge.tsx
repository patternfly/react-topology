import * as React from 'react';
import { observer } from 'mobx-react';
import {
  Edge,
  GraphElement,
  integralShapePath,
  Layer,
  TOP_LAYER
} from '@patternfly/react-topology';
import styles from '@patternfly/react-topology/src/css/topology-components';

interface SuccessEdgeProps {
  element: GraphElement;
}

const SuccessEdge: React.FunctionComponent<SuccessEdgeProps> = ({ element }) => {
  const edgeElement = element as Edge;
  const startPoint = edgeElement.getStartPoint();
  const endPoint = edgeElement.getEndPoint();
  const startIndent: number = element.getData()?.indent || 0;

  return (
    <Layer id={TOP_LAYER}>
      <g data-test-id="task-handler" className={styles.topologyEdge} fillOpacity={0}>
        <path
          d={integralShapePath(startPoint, endPoint, startIndent, 20)}
          transform="translate(0.5,0.5)"
          shapeRendering="geometricPrecision"
          stroke="green"
        />
      </g>
    </Layer>
  );
};

export default observer(SuccessEdge);
