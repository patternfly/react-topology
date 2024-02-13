import * as React from 'react';
import { observer } from 'mobx-react';
import {
  useCombineRefs,
  WithDragNodeProps,
  WithSelectionProps,
  Node,
  Rect,
  Layer,
  WithDndDropProps,
  WithDndDragProps,
  useAnchor,
  RectAnchor,
  GraphElement
} from '@patternfly/react-topology';

type GroupProps = {
  children?: React.ReactNode;
  element: GraphElement;
  droppable?: boolean;
  hover?: boolean;
  canDrop?: boolean;
} & WithSelectionProps &
  WithDragNodeProps &
  WithDndDragProps &
  WithDndDropProps;

const DemoDefaultGroup: React.FunctionComponent<GroupProps> = ({
  element,
  children,
  selected,
  onSelect,
  dragNodeRef,
  dndDragRef,
  dndDropRef,
  droppable,
  hover,
  canDrop
}) => {
  const nodeElement = element as Node;
  useAnchor(RectAnchor);
  const boxRef = React.useRef<Rect | null>(null);
  const refs = useCombineRefs<SVGRectElement>(dragNodeRef, dndDragRef, dndDropRef);

  if (!droppable || !boxRef.current) {
    // change the box only when not dragging
    boxRef.current = nodeElement.getBounds();
  }
  let fill = '#ededed';
  if (canDrop && hover) {
    fill = 'lightgreen';
  } else if (canDrop && droppable) {
    fill = 'lightblue';
  } else if (element.getData()) {
    fill = element.getData().background;
  }

  if (nodeElement.isCollapsed()) {
    const { width, height } = nodeElement.getDimensions();
    return (
      <g>
        <rect
          ref={refs}
          x={0}
          y={0}
          width={width}
          height={height}
          rx={5}
          ry={5}
          fill={fill}
          strokeWidth={2}
          stroke={selected ? 'blue' : '#cdcdcd'}
        />
      </g>
    );
  }

  return (
    <Layer id="groups">
      <rect
        ref={refs}
        onClick={onSelect}
        x={boxRef.current.x}
        y={boxRef.current.y}
        width={boxRef.current.width}
        height={boxRef.current.height}
        fill={fill}
        strokeWidth={2}
        stroke={selected ? 'blue' : '#cdcdcd'}
      />
      {children}
    </Layer>
  );
};

export default observer(DemoDefaultGroup);
