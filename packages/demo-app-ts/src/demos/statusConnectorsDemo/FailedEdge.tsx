import * as React from 'react';
import { observer } from 'mobx-react';
import { Edge, GraphElement, integralShapePath } from '@patternfly/react-topology';
import styles from '@patternfly/react-topology/src/css/topology-components';

interface FailedEdgeProps {
  element: GraphElement;
}

const FailedEdge: React.FunctionComponent<FailedEdgeProps> = ({ element }) => {
  const edgeElement = element as Edge;
  const startPoint = edgeElement.getStartPoint();
  const endPoint = edgeElement.getEndPoint();
  const startIndent: number = element.getData()?.indent || 0;

  const path = integralShapePath(startPoint, endPoint, startIndent, 10);
  return (
    <g data-test-id="task-handler" className={styles.topologyEdge} fillOpacity={0}>
      <path
        d={path}
        transform="translate(0.5,0.5)"
        shapeRendering="geometricPrecision"
        stroke="red"
      />
    </g>
  );
};

export default observer(FailedEdge);
