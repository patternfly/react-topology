import * as React from 'react';
import { observer } from 'mobx-react';
import { computed } from 'mobx';
import ElementContext from '../utils/ElementContext';
import { Edge, Graph, isGraph, isEdge, isNode, Node } from '../types';
import { ATTR_DATA_ID, ATTR_DATA_KIND, ATTR_DATA_TYPE } from '../const';
import ComputeElementDimensions from './ComputeElementDimensions';
import { useDndManager } from '../behavior/useDndManager';

interface ElementWrapperProps {
  element: Graph | Edge | Node;
  level?: number; // used for groups to set z-index keeping child groups drawn on top of their parent.
}

const NodeElementComponent: React.FunctionComponent<{ element: Node }> = observer(({ element }) => {
  const dndManager = useDndManager();
  const isDragging = dndManager.isDragging();
  const dragItem = dndManager.getItem();
  const controller = element.hasController() && element.getController();
  const isVisible = React.useMemo(
    () => computed(() => controller && controller.shouldRenderNode(element)),
    [element, controller]
  );
  if (isVisible.get() || (isDragging && dragItem === element)) {
    return <ElementComponent element={element} />;
  }
  return null;
});

// in a separate component so that changes to behaviors do not re-render children
const ElementComponent: React.FunctionComponent<ElementWrapperProps> = observer(({ element }) => {
  const kind = element.getKind();
  const type = element.getType();
  const controller = element.hasController() && element.getController();

  const Component = React.useMemo(() => controller && controller.getComponent(kind, type), [controller, kind, type]);

  if (Component) {
    return (
      <ElementContext.Provider value={element}>
        <Component {...element.getState()} element={element} />
      </ElementContext.Provider>
    );
  }
  return null;
});

const ElementChildren: React.FunctionComponent<ElementWrapperProps> = observer(({ element, level }) => (
  <>
    {element
      .getChildren()
      .filter(isEdge)
      .map((e) => (
        <ElementWrapper key={e.getId()} element={e} />
      ))}
    {element
      .getChildren()
      .filter(isNode)
      .map((e) => (
        <ElementWrapper key={e.getId()} element={e} level={level} />
      ))}
  </>
));

const ElementWrapper: React.FunctionComponent<ElementWrapperProps> = observer(({ element, level = 0 }) => {
  if (!element.isVisible()) {
    if (!isNode(element) || element.isDimensionsInitialized()) {
      return null;
    }
  }

  if (isEdge(element)) {
    const source = element.getSourceAnchorNode();
    const target = element.getTargetAnchorNode();
    if ((source && !source.isVisible()) || (target && !target.isVisible())) {
      return null;
    }
  }

  const commonAttrs = {
    [ATTR_DATA_ID]: element.getId(),
    [ATTR_DATA_KIND]: element.getKind(),
    [ATTR_DATA_TYPE]: element.getType()
  };

  if (isGraph(element)) {
    return (
      <g {...commonAttrs}>
        <ElementComponent element={element} />
      </g>
    );
  }

  if (isNode(element)) {
    if (!element.isDimensionsInitialized()) {
      return (
        <ComputeElementDimensions element={element}>
          <ElementComponent element={element} />
          <ElementChildren element={element} />
        </ComputeElementDimensions>
      );
    }
    if (!element.isGroup() || element.isCollapsed()) {
      const { x, y } = element.getPosition();
      return (
        <g {...commonAttrs} transform={`translate(${x}, ${y})`}>
          <NodeElementComponent element={element} />
          <ElementChildren element={element} />
        </g>
      );
    }
    return (
      <g {...commonAttrs}>
        <NodeElementComponent element={element} />
        <ElementChildren element={element} />
      </g>
    );
  }
  return (
    <g {...commonAttrs} style={{ zIndex: level }}>
      <ElementComponent element={element} />
      <ElementChildren element={element} level={level + 1} />
    </g>
  );
});

export default ElementWrapper;
