import { useMemo, useEffect } from 'react';
import {
  Decorator,
  DEFAULT_DECORATOR_RADIUS,
  DEFAULT_LAYER,
  DefaultNode,
  getDefaultShapeDecoratorCenter,
  GraphElement,
  Layer,
  Node,
  NodeShape,
  NodeStatus,
  observer,
  ScaleDetailsLevel,
  ShapeProps,
  TOP_LAYER,
  TopologyQuadrant,
  useHover,
  WithContextMenuProps,
  WithCreateConnectorProps,
  WithDragNodeProps,
  WithSelectionProps
} from '@patternfly/react-topology';
import RhUiCubesIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-cubes-icon';
import RhUiRegionsIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-regions-icon';
import RhUiFolderOpenIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-folder-open-icon';
import RhUiBlueprintIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-blueprint-icon';
import RhUiPauseCircleIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-pause-circle-fill-icon';
import RhUiThumbtackIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-thumbtack-fill-icon';
import { SVGIconProps } from '@patternfly/react-icons/dist/esm/createIcon';

export enum DataTypes {
  Default,
  Alternate
}
const ICON_PADDING = 20;

type StyleNodeProps = {
  element: GraphElement;
  getCustomShape?: (node: Node) => React.FunctionComponent<ShapeProps>;
  getShapeDecoratorCenter?: (quadrant: TopologyQuadrant, node: Node) => { x: number; y: number };
  showLabel?: boolean; // Defaults to true
  labelIcon?: React.ComponentClass<SVGIconProps>;
  showStatusDecorator?: boolean; // Defaults to false
  regrouping?: boolean;
  dragging?: boolean;
} & WithContextMenuProps &
  WithCreateConnectorProps &
  WithDragNodeProps &
  WithSelectionProps;

const getTypeIcon = (dataType?: DataTypes): any => {
  switch (dataType) {
    case DataTypes.Alternate:
      return RhUiRegionsIcon;
    default:
      return RhUiCubesIcon;
  }
};

const renderIcon = (data: { dataType?: DataTypes }, element: Node): React.ReactNode => {
  const { width, height } = element.getDimensions();
  const shape = element.getNodeShape();
  const iconSize =
    (shape === NodeShape.trapezoid ? width : Math.min(width, height)) -
    (shape === NodeShape.stadium ? 5 : ICON_PADDING) * 2;
  const Component = getTypeIcon(data.dataType);

  return (
    <g transform={`translate(${(width - iconSize) / 2}, ${(height - iconSize) / 2})`}>
      <Component style={{ color: '#393F44' }} width={iconSize} height={iconSize} />
    </g>
  );
};

const renderDecorator = (
  element: Node,
  quadrant: TopologyQuadrant,
  icon: React.ReactNode,
  getShapeDecoratorCenter?: (
    quadrant: TopologyQuadrant,
    node: Node,
    radius?: number
  ) => {
    x: number;
    y: number;
  }
): React.ReactNode => {
  const { x, y } = getShapeDecoratorCenter
    ? getShapeDecoratorCenter(quadrant, element)
    : getDefaultShapeDecoratorCenter(quadrant, element);

  return <Decorator x={x} y={y} radius={DEFAULT_DECORATOR_RADIUS} showBackground icon={icon} />;
};

const renderDecorators = (
  element: Node,
  data: { showDecorators?: boolean },
  getShapeDecoratorCenter?: (
    quadrant: TopologyQuadrant,
    node: Node
  ) => {
    x: number;
    y: number;
  }
): React.ReactNode => {
  if (!data.showDecorators) {
    return null;
  }
  const nodeStatus = element.getNodeStatus();
  return (
    <>
      {!nodeStatus || nodeStatus === NodeStatus.default
        ? renderDecorator(element, TopologyQuadrant.upperLeft, <RhUiFolderOpenIcon />, getShapeDecoratorCenter)
        : null}
      {renderDecorator(element, TopologyQuadrant.upperRight, <RhUiBlueprintIcon />, getShapeDecoratorCenter)}
      {renderDecorator(element, TopologyQuadrant.lowerLeft, <RhUiPauseCircleIcon />, getShapeDecoratorCenter)}
      {renderDecorator(element, TopologyQuadrant.lowerRight, <RhUiThumbtackIcon />, getShapeDecoratorCenter)}
    </>
  );
};

const StyleNode: React.FunctionComponent<StyleNodeProps> = ({
  element,
  onContextMenu,
  contextMenuOpen,
  showLabel,
  dragging,
  regrouping,
  onShowCreateConnector,
  onHideCreateConnector,
  ...rest
}) => {
  const nodeElement = element as Node;
  const data = element.getData();
  const detailsLevel = element.getGraph().getDetailsLevel();
  const [hover, hoverRef] = useHover();
  const focused = hover || contextMenuOpen;

  const passedData = useMemo(() => {
    const newData = { ...data };
    Object.keys(newData).forEach((key) => {
      if (newData[key] === undefined) {
        delete newData[key];
      }
    });
    return newData;
  }, [data]);

  useEffect(() => {
    if (detailsLevel === ScaleDetailsLevel.low) {
      onHideCreateConnector && onHideCreateConnector();
    }
  }, [detailsLevel, onHideCreateConnector]);

  const LabelIcon = passedData.labelIcon;
  return (
    <Layer id={focused ? TOP_LAYER : DEFAULT_LAYER}>
      <g ref={hoverRef}>
        <DefaultNode
          element={element}
          scaleLabel={detailsLevel !== ScaleDetailsLevel.low}
          scaleNode={focused && detailsLevel === ScaleDetailsLevel.low}
          raiseLabelOnHover={false}
          {...rest}
          {...passedData}
          dragging={dragging}
          regrouping={regrouping}
          showLabel={focused || (detailsLevel !== ScaleDetailsLevel.low && showLabel)}
          showStatusBackground={!focused && detailsLevel === ScaleDetailsLevel.low}
          showStatusDecorator={detailsLevel === ScaleDetailsLevel.high && passedData.showStatusDecorator}
          statusDecoratorTooltip={nodeElement.getNodeStatus()}
          onContextMenu={data.showContextMenu ? onContextMenu : undefined}
          contextMenuOpen={contextMenuOpen}
          onShowCreateConnector={detailsLevel !== ScaleDetailsLevel.low ? onShowCreateConnector : undefined}
          onHideCreateConnector={onHideCreateConnector}
          labelIcon={LabelIcon && <LabelIcon noVerticalAlign />}
          attachments={
            (focused || detailsLevel === ScaleDetailsLevel.high) &&
            renderDecorators(nodeElement, passedData, rest.getShapeDecoratorCenter)
          }
        >
          {(focused || detailsLevel !== ScaleDetailsLevel.low) && renderIcon(passedData, nodeElement)}
        </DefaultNode>
      </g>
    </Layer>
  );
};

export default observer(StyleNode);
