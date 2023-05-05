import * as React from 'react';
import { observer } from 'mobx-react';
import { Graph, isGraph } from '../types';
import { WithPanZoomProps } from '../behavior/usePanZoom';
import { WithDndDropProps } from '../behavior/useDndDrop';
import { WithSelectionProps } from '../behavior/useSelection';
import { WithContextMenuProps } from '../behavior/withContextMenu';
import LayersProvider from './layers/LayersProvider';
import ElementWrapper from './ElementWrapper';
import { GraphElementProps } from './factories';

type GraphComponentProps = GraphElementProps &
    WithPanZoomProps &
    WithDndDropProps &
    WithSelectionProps &
    WithContextMenuProps;

// This inner Component will prevent the re-rendering of all children when the transform changes
const ElementChildren: React.FunctionComponent<{ element: Graph }> = observer(({ element }) => (
  <>
    {element.getEdges().map(e => (
      <ElementWrapper key={e.getId()} element={e} />
    ))}
    {element.getNodes().map(e => (
      <ElementWrapper key={e.getId()} element={e} />
    ))}
  </>
));

// This inner Component will prevent re-rendering layers when the transform changes
const Inner: React.FunctionComponent<{ element: Graph }> = React.memo(
  observer(({ element }) => (
    <LayersProvider layers={element.getLayers()}>
      <ElementChildren element={element} />
    </LayersProvider>
  ))
);

const GraphComponent: React.FunctionComponent<GraphComponentProps> = ({
  element,
  panZoomRef,
  dndDropRef,
  onSelect,
  onContextMenu
}) => {
  if (!isGraph(element)) {
    return null;
  }
  const graphElement = element as Graph;
  const { x, y, width, height } = graphElement.getBounds();
  return (
    <>
      <rect
        ref={dndDropRef}
        x={0}
        y={0}
        width={width}
        height={height}
        fillOpacity={0}
        onClick={onSelect}
        onContextMenu={onContextMenu}
      />
      <g data-surface="true" ref={panZoomRef} transform={`translate(${x}, ${y}) scale(${graphElement.getScale()})`}>
        <Inner element={graphElement} />
      </g>
    </>
  );
};

export default observer(GraphComponent);
