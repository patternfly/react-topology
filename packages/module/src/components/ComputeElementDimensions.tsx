import { useRef, useEffect } from 'react';
import { observer } from 'mobx-react';
import Dimensions from '../geom/Dimensions';
import { Node } from '../types';

interface ComputeElementDimensionsProps {
  children?: React.ReactNode;
  element: Node;
}

const ComputeElementDimensions: React.FunctionComponent<ComputeElementDimensionsProps> = ({ element, children }) => {
  const gRef = useRef<SVGGElement>(null);
  useEffect(() => {
    if (gRef.current && !element.isDimensionsInitialized()) {
      const { width, height } = gRef.current.getBBox();
      element.setDimensions(new Dimensions(width, height));
    }
  }, [element]);

  // render an invisible node
  return (
    <g ref={gRef} style={{ visibility: 'hidden' }}>
      {children}
    </g>
  );
};

// export for testing
export const InternalComputeElementDimensions = ComputeElementDimensions;

export default observer(ComputeElementDimensions);
