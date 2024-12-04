import * as React from 'react';
import * as d3 from 'd3';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import ElementContext from '../utils/ElementContext';
import useCallbackRef from '../utils/useCallbackRef';
import { Graph, GRAPH_AREA_DRAGGING_EVENT, GRAPH_AREA_SELECTED_EVENT, isGraph, ModifierKey } from '../types';
import Point from '../geom/Point';

export type AreaSelectionRef = (node: SVGGElement | null) => void;

// Used to send events prevented by d3.zoom to the document allowing modals, dropdowns, etc, to close
const propagateAreaSelectionMouseEvent = (e: Event): void => {
  document.dispatchEvent(new MouseEvent(e.type, e));
};

export const useAreaSelection = (modifiers: ModifierKey[] = ['ctrlKey']): WithAreaSelectionProps => {
  const element = React.useContext(ElementContext);
  const [draggingState, setDraggingState] = React.useState<Omit<WithAreaSelectionProps, 'areaSelectionRef'>>({});

  if (!isGraph(element)) {
    throw new Error('useAreaSelection must be used within the scope of a Graph');
  }
  const elementRef = React.useRef<Graph>(element);
  elementRef.current = element;

  const areaSelectionRef = useCallbackRef<AreaSelectionRef>((node: SVGGElement | null) => {
    if (node) {
      // TODO fix any type
      const $svg = d3.select(node.ownerSVGElement) as any;
      if (node && node.ownerSVGElement) {
        node.ownerSVGElement.addEventListener('mousedown', propagateAreaSelectionMouseEvent);
        node.ownerSVGElement.addEventListener('click', propagateAreaSelectionMouseEvent);
      }
      const drag = d3
        .drag()
        .on(
          'start',
          action((event: d3.D3DragEvent<Element, any, any>) => {
            const { offsetX, offsetY } =
              event.sourceEvent instanceof MouseEvent ? event.sourceEvent : { offsetX: 0, offsetY: 0 };
            const { width: maxX, height: maxY } = elementRef.current.getDimensions();

            const startPoint = new Point(Math.min(Math.max(offsetX, 0), maxX), Math.min(Math.max(offsetY, 0), maxY));
            const modifier = modifiers.find((m) => event.sourceEvent[m]);

            setDraggingState({
              modifier,
              isAreaSelectDragging: true,
              areaSelectDragStart: startPoint,
              areaSelectDragEnd: startPoint
            });
            elementRef.current
              .getController()
              .fireEvent(GRAPH_AREA_DRAGGING_EVENT, { graph: elementRef.current, isDragging: true });
          })
        )
        .on(
          'drag',
          action((event: d3.D3DragEvent<Element, any, any>) => {
            const { offsetX, offsetY } =
              event.sourceEvent instanceof MouseEvent ? event.sourceEvent : { offsetX: 0, offsetY: 0 };
            const { width: maxX, height: maxY } = elementRef.current.getDimensions();
            setDraggingState((prev) => ({
              ...prev,
              areaSelectDragEnd: new Point(Math.min(Math.max(offsetX, 0), maxX), Math.min(Math.max(offsetY, 0), maxY))
            }));
          })
        )
        .on(
          'end',
          action(() => {
            setDraggingState((prev) => {
              elementRef.current.getController().fireEvent(GRAPH_AREA_SELECTED_EVENT, {
                graph: elementRef.current,
                modifier: prev.modifier,
                startPoint: prev.areaSelectDragStart,
                endPoint: prev.areaSelectDragEnd
              });
              return { isAreaSelectDragging: false };
            });
            elementRef.current
              .getController()
              .fireEvent(GRAPH_AREA_DRAGGING_EVENT, { graph: elementRef.current, isDragging: false });
          })
        )
        .filter((event: React.MouseEvent) => modifiers.find((m) => event[m]) && !event.button);
      drag($svg);
    }

    return () => {
      if (node) {
        // remove all drag listeners
        d3.select(node.ownerSVGElement).on('.drag', null);
        if (node.ownerSVGElement) {
          node.ownerSVGElement.removeEventListener('mousedown', propagateAreaSelectionMouseEvent);
          node.ownerSVGElement.removeEventListener('click', propagateAreaSelectionMouseEvent);
        }
      }
    };
  });
  return { areaSelectionRef, ...draggingState };
};
export interface WithAreaSelectionProps {
  areaSelectionRef?: AreaSelectionRef;
  modifier?: ModifierKey;
  isAreaSelectDragging?: boolean;
  areaSelectDragStart?: Point;
  areaSelectDragEnd?: Point;
}

export const withAreaSelection =
  (modifier: ModifierKey[] = ['ctrlKey']) =>
  <P extends WithAreaSelectionProps>(WrappedComponent: React.ComponentType<P>) => {
    const Component: React.FunctionComponent<Omit<P, keyof WithAreaSelectionProps>> = (props) => {
      const areaSelectionProps = useAreaSelection(modifier);
      return <WrappedComponent {...(props as any)} {...areaSelectionProps} />;
    };
    Component.displayName = `withAreaSelection(${WrappedComponent.displayName || WrappedComponent.name})`;
    return observer(Component);
  };
