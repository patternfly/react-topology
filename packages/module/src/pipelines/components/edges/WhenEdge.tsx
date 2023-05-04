import * as React from 'react';
import { EdgeTerminalType, GraphElement } from '../../../types';
import { DefaultEdge } from '../../../components';

const WhenEdge: React.FC<{ element: GraphElement }> = ({ element }) => (
  <DefaultEdge element={element} endTerminalType={EdgeTerminalType.none} />
);

export default WhenEdge;
