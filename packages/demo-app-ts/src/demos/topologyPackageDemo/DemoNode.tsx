import * as React from 'react';
import {
  Decorator,
  DEFAULT_DECORATOR_RADIUS,
  DEFAULT_LAYER,
  DefaultNode,
  Ellipse,
  getDefaultShapeDecoratorCenter,
  GraphElement,
  Hexagon,
  Layer,
  Node,
  NodeShape,
  NodeStatus,
  observer,
  Octagon,
  Rectangle,
  Rhombus,
  ScaleDetailsLevel,
  ShapeProps,
  Stadium,
  TOP_LAYER,
  TopologyQuadrant,
  Trapezoid,
  useHover,
  WithContextMenuProps,
  WithCreateConnectorProps,
  WithDragNodeProps,
  WithSelectionProps
} from '@patternfly/react-topology';
import DefaultIcon from '@patternfly/react-icons/dist/esm/icons/builder-image-icon';
import AlternateIcon from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import FolderOpenIcon from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';
import BlueprintIcon from '@patternfly/react-icons/dist/esm/icons/blueprint-icon';
import PauseCircle from '@patternfly/react-icons/dist/esm/icons/pause-circle-icon';
import Thumbtack from '@patternfly/react-icons/dist/esm/icons/thumbtack-icon';
import SignOutAltIcon from '@patternfly/react-icons/dist/esm/icons/skull-icon';
import { SVGIconProps } from '@patternfly/react-icons/dist/esm/createIcon';
import { DataTypes, GeneratedNodeData, GeneratorNodeOptions } from './generator';
import { DemoContext } from './DemoContext';
import { logos } from '../../utils/logos';

const ICON_PADDING = 20;

type DemoNodeProps = {
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
      return AlternateIcon;
    default:
      return DefaultIcon;
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
  options: GeneratorNodeOptions,
  element: Node,
  getShapeDecoratorCenter?: (
    quadrant: TopologyQuadrant,
    node: Node
  ) => {
    x: number;
    y: number;
  }
): React.ReactNode => {
  const data = element.getData() as GeneratedNodeData;
  return (
    <>
      {!options.showStatus || data.status === NodeStatus.default
        ? renderDecorator(element, TopologyQuadrant.upperLeft, <FolderOpenIcon />, getShapeDecoratorCenter)
        : null}
      {renderDecorator(element, TopologyQuadrant.upperRight, <BlueprintIcon />, getShapeDecoratorCenter)}
      {renderDecorator(element, TopologyQuadrant.lowerLeft, <PauseCircle />, getShapeDecoratorCenter)}
      {renderDecorator(element, TopologyQuadrant.lowerRight, <Thumbtack />, getShapeDecoratorCenter)}
    </>
  );
};

const getShapeComponent = (shape: NodeShape): React.FunctionComponent<ShapeProps> => {
  switch (shape) {
    case NodeShape.circle:
    case NodeShape.ellipse:
      return Ellipse;
    case NodeShape.stadium:
      return Stadium;
    case NodeShape.rhombus:
      return Rhombus;
    case NodeShape.trapezoid:
      return Trapezoid;
    case NodeShape.rect:
      return Rectangle;
    case NodeShape.hexagon:
      return Hexagon;
    case NodeShape.octagon:
      return Octagon;
    default:
      return Ellipse;
  }
};

const DemoNode: React.FunctionComponent<DemoNodeProps> = observer(
  ({ element, onContextMenu, dragging, contextMenuOpen, onShowCreateConnector, onHideCreateConnector, ...rest }) => {
    const options = React.useContext(DemoContext).nodeOptions;
    const nodeElement = element as Node;
    const data = element.getData() as GeneratedNodeData;
    const detailsLevel = element.getGraph().getDetailsLevel();
    const [hover, hoverRef] = useHover();
    const focused = hover || contextMenuOpen;

    React.useEffect(() => {
      if (detailsLevel === ScaleDetailsLevel.low) {
        onHideCreateConnector && onHideCreateConnector();
      }
    }, [detailsLevel, onHideCreateConnector]);

    const labelIconClass = data.index % 2 === 0 && logos.get('icon-java');
    const LabelIcon = data.index % 2 === 1 ? (SignOutAltIcon as any) : undefined;

    return (
      <Layer id={focused ? TOP_LAYER : DEFAULT_LAYER}>
        <g ref={hoverRef}>
          <DefaultNode
            element={element}
            scaleLabel={detailsLevel !== ScaleDetailsLevel.low}
            scaleNode={focused && detailsLevel === ScaleDetailsLevel.low}
            contextMenuOpen={contextMenuOpen}
            {...rest}
            dragging={dragging}
            showLabel={focused || (detailsLevel !== ScaleDetailsLevel.low && options.labels)}
            raiseLabelOnHover={false}
            showStatusBackground={!focused && detailsLevel === ScaleDetailsLevel.low}
            showStatusDecorator={detailsLevel === ScaleDetailsLevel.high && options.showStatus}
            statusDecoratorTooltip={nodeElement.getNodeStatus()}
            onContextMenu={options.contextMenus ? onContextMenu : undefined}
            hideContextMenuKebab={options.hideKebabMenu}
            onShowCreateConnector={detailsLevel !== ScaleDetailsLevel.low ? onShowCreateConnector : undefined}
            onHideCreateConnector={onHideCreateConnector}
            labelIcon={options.icons && LabelIcon && <LabelIcon noVerticalAlign />}
            labelIconClass={options.icons && labelIconClass}
            secondaryLabel={options.secondaryLabels && data.subTitle}
            nodeStatus={options.showStatus && data.status}
            getCustomShape={options.showShapes ? () => getShapeComponent(data.shape) : undefined}
            badge={options.badges ? data.objectType : undefined}
            attachments={
              (focused || detailsLevel === ScaleDetailsLevel.high) &&
              options.showDecorators &&
              renderDecorators(options, nodeElement, rest.getShapeDecoratorCenter)
            }
          >
            {(focused || detailsLevel !== ScaleDetailsLevel.low) && renderIcon(data, nodeElement)}
          </DefaultNode>
        </g>
      </Layer>
    );
  }
);

export default DemoNode;
