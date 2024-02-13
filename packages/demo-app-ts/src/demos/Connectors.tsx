import * as React from 'react';
import {
  Model,
  ModelKind,
  Edge,
  Node,
  AnchorEnd,
  withTargetDrag,
  withSourceDrag,
  DragEvent,
  DragObjectWithType,
  withDndDrop,
  withPanZoom,
  GraphComponent,
  withCreateConnector,
  CREATE_CONNECTOR_DROP_TYPE,
  ConnectorChoice,
  useSvgAnchor,
  withDragNode,
  WithDragNodeProps,
  Layer,
  Graph,
  isGraph,
  useModel,
  useComponentFactory,
  ComponentFactory,
  useVisualizationController,
  GraphElement,
  GraphElementProps
} from '@patternfly/react-topology';
import defaultComponentFactory from '../components/defaultComponentFactory';
import DefaultEdge from '../components/DemoDefaultEdge';
import DemoDefaultNode from '../components/DemoDefaultNode';
import withTopologySetup from '../utils/withTopologySetup';
import NodeRect from '../components/NodeRect';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';

export const Reconnect = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(
    React.useCallback<ComponentFactory>(kind => {
      if (kind === ModelKind.graph) {
        return withPanZoom()(GraphComponent);
      }
      if (kind === ModelKind.node) {
        return withDndDrop<Edge, any, { droppable?: boolean; hover?: boolean; canDrop?: boolean }, GraphElementProps>({
          accept: 'test',
          canDrop: (item, monitor, props) =>
            !props || (item.getSource() !== props.element && item.getTarget() !== props.element),
          collect: monitor => ({
            droppable: monitor.isDragging(),
            hover: monitor.isOver(),
            canDrop: monitor.canDrop()
          })
        })(DemoDefaultNode);
      }
      if (kind === ModelKind.edge) {
        return withSourceDrag<DragObjectWithType, Node, any, GraphElementProps>({
          item: { type: 'test' },
          begin: (monitor, props) => {
            props.element.raise();
            return props.element;
          },
          drag: (event, monitor, props) => {
            (props.element as Edge).setStartPoint(event.x, event.y);
          },
          end: (dropResult, monitor, props) => {
            if (monitor.didDrop() && dropResult && props) {
              (props.element as Edge).setSource(dropResult);
            }
            (props.element as Edge).setStartPoint();
          }
        })(
          withTargetDrag<DragObjectWithType, Node, { dragging?: boolean }, GraphElementProps>({
            item: { type: 'test' },
            begin: (monitor, props) => {
              props.element.raise();
              return props.element;
            },
            drag: (event, monitor, props) => {
              (props.element as Edge).setEndPoint(event.x, event.y);
            },
            end: (dropResult, monitor, props) => {
              if (monitor.didDrop() && dropResult && props) {
                (props.element as Edge).setTarget(dropResult);
              }
              (props.element as Edge).setEndPoint();
            },
            collect: monitor => ({
              dragging: monitor.isDragging()
            })
          })(DefaultEdge)
        );
      }
      return undefined;
    }, [])
  );
  useModel(
    React.useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: [
          {
            id: 'n1',
            type: 'node',
            x: 20,
            y: 150,
            width: 20,
            height: 20
          },
          {
            id: 'n2',
            type: 'node',
            x: 200,
            y: 50,
            width: 100,
            height: 30
          },
          {
            id: 'n3',
            type: 'node',
            x: 200,
            y: 300,
            width: 30,
            height: 30
          }
        ],
        edges: [
          {
            id: 'e1',
            type: 'edge',
            source: 'n1',
            target: 'n2',
            bendpoints: [
              [50, 30],
              [110, 10]
            ]
          },
          {
            id: 'e2',
            type: 'edge',
            source: 'n1',
            target: 'n3'
          }
        ]
      }),
      []
    )
  );
  return null;
});

type ColorChoice = ConnectorChoice & {
  color?: string;
};

export const CreateConnector = withTopologySetup(() => {
  const model = React.useMemo(
    (): Model => ({
      graph: {
        id: 'g1',
        type: 'graph'
      },
      nodes: [
        {
          id: 'n1',
          type: 'node',
          x: 20,
          y: 150,
          width: 104,
          height: 104
        },
        {
          id: 'n2',
          type: 'node',
          x: 200,
          y: 50,
          width: 100,
          height: 30
        },
        {
          id: 'n3',
          type: 'node',
          x: 200,
          y: 300,
          width: 30,
          height: 30
        }
      ]
    }),
    []
  );
  const controller = useVisualizationController();
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(
    React.useCallback<ComponentFactory>(
      kind => {
        if (kind === ModelKind.graph) {
          return withDndDrop({
            accept: CREATE_CONNECTOR_DROP_TYPE,
            dropHint: 'create'
          })(withPanZoom()(GraphComponent));
        }
        if (kind === ModelKind.node) {
          return withCreateConnector(
            (
              source: Node,
              target: Node | Graph,
              event: DragEvent,
              dropHints: string[],
              choice: ColorChoice | undefined
            ): ColorChoice[] | void => {
              if (!choice) {
                return [
                  { label: 'Create Annotation', color: 'red' },
                  { label: 'Create Binding', color: 'green' }
                ];
              }

              let targetId;
              if (isGraph(target)) {
                if (!model.nodes) {
                  model.nodes = [];
                }
                targetId = `n${controller.getGraph().getNodes().length + 1}`;
                model.nodes.push({
                  id: targetId,
                  type: 'node',
                  x: event.x - 15,
                  y: event.y - 15,
                  height: 30,
                  width: 30
                });
              } else {
                targetId = target.getId();
              }
              const id = `e${controller.getGraph().getEdges().length + 1}`;
              if (!model.edges) {
                model.edges = [];
              }
              model.edges.push({
                id,
                type: 'edge',
                source: source.getId(),
                target: targetId,
                data: {
                  color: choice.color
                }
              });
              controller.fromModel(model);
            }
          )(
            withDndDrop<Node, any, { droppable?: boolean; hover?: boolean; canDrop?: boolean }, GraphElementProps>({
              accept: CREATE_CONNECTOR_DROP_TYPE,
              canDrop: (item, monitor, props) => !props || item !== props.element,
              collect: monitor => ({
                droppable: monitor.isDragging(),
                hover: monitor.isOver(),
                canDrop: monitor.canDrop()
              })
            })(DemoDefaultNode)
          );
        }
        return undefined;
      },
      [model, controller]
    )
  );
  useModel(model);
  return null;
});

const NodeWithPointAnchor: React.FunctionComponent<{ element: GraphElement } & WithDragNodeProps> = ({ element, ...props }) => {
  const nodeElement = element as Node;
  const nodeRef = useSvgAnchor();
  const targetRef = useSvgAnchor(AnchorEnd.target, 'edge-point');
  const { width, height } = nodeElement.getDimensions();
  return (
    <>
      <Layer id="bottom">
        <NodeRect element={element} {...(props as any)} />
      </Layer>
      <circle ref={nodeRef} fill="lightgreen" r="5" cx={width * 0.25} cy={height * 0.25} />
      <circle ref={targetRef} fill="red" r="5" cx={width * 0.75} cy={height * 0.75} />
    </>
  );
};

export const Anchors = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(
    React.useCallback<ComponentFactory>(kind => {
      if (kind === ModelKind.node) {
        return withDragNode()(NodeWithPointAnchor);
      }
      return undefined;
    }, [])
  );
  useModel(
    React.useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: [
          {
            id: 'n1',
            type: 'node',
            x: 150,
            y: 10,
            width: 100,
            height: 100
          },
          {
            id: 'n2',
            type: 'node',
            x: 25,
            y: 250,
            width: 50,
            height: 50
          },
          {
            id: 'n3',
            type: 'node',
            x: 225,
            y: 250,
            width: 50,
            height: 50
          }
        ],
        edges: [
          {
            id: 'e1',
            type: 'edge-point',
            source: 'n1',
            target: 'n3'
          },
          {
            id: 'e2',
            type: 'edge-point',
            source: 'n2',
            target: 'n1'
          }
        ]
      }),
      []
    )
  );
  return null;
});

export const Connectors: React.FunctionComponent = () => {
  const [activeKey, setActiveKey] = React.useState<string | number>(0);

  const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveKey(tabIndex);
  };

  return (
    <div className="pf-ri__topology-demo">
      <Tabs unmountOnExit activeKey={activeKey} onSelect={handleTabClick}>
        <Tab eventKey={0} title={<TabTitleText>Reconnect</TabTitleText>}>
          <Reconnect />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Create Connector</TabTitleText>}>
          <CreateConnector />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Anchors</TabTitleText>}>
          <Anchors />
        </Tab>
      </Tabs>
    </div>
  );
};
