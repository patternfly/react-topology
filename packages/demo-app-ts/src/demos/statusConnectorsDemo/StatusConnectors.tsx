import * as React from 'react';
import { action } from 'mobx';
import {
  createTopologyControlButtons,
  DagreLayout,
  defaultControlButtonsOptions,
  EdgeModel,
  Graph,
  Layout,
  LayoutFactory,
  LEFT_TO_RIGHT,
  NODE_SEPARATION_HORIZONTAL,
  NodeModel,
  NodeShape,
  SELECTION_EVENT,
  TopologyControlBar,
  TopologyView,
  useVisualizationController,
  Visualization,
  VisualizationProvider,
  VisualizationSurface
} from '@patternfly/react-topology';
import defaultComponentFactory from '../../components/defaultComponentFactory';
import statusConnectorsComponentFactory from './statusConnectorsComponentFactory';

const DEFAULT_CHAR_WIDTH = 8;
const DEFAULT_NODE_SIZE = 75;

const getTextWidth = (text: string, font: string = '1rem RedHatText'): number => {
  if (!text || text.length === 0) {
    return 0;
  }
  const canvas = document.createElement('canvas');
  const context = canvas.getContext?.('2d');
  if (!context) {
    return text.length * DEFAULT_CHAR_WIDTH;
  }
  context.font = font;
  const { width } = context.measureText(text);

  return width || text.length * DEFAULT_CHAR_WIDTH;
};

const defaultLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {
  return new DagreLayout(graph, {
    linkDistance: 10,
    nodeDistance: 0,
    groupDistance: 10,
    allowDrag: false,
    layoutOnDrag: false,
    nodesep: NODE_SEPARATION_HORIZONTAL + 20,
    ranksep: NODE_SEPARATION_HORIZONTAL,
    edgesep: 100,
    ranker: 'longest-path',
    rankdir: LEFT_TO_RIGHT,
    marginx: 20,
    marginy: 20,
  });
};

export const StatusConnectorsDemo: React.FunctionComponent= () => {
  const controller = useVisualizationController();
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const nodes: NodeModel[] = [
      {
        id: '1',
        type: 'node',
        shape: NodeShape.rect,
        width: DEFAULT_NODE_SIZE,
        height: DEFAULT_NODE_SIZE,
        label: 'Demo Job Template',
        data: {
          secondaryLabel: 'Job template',
        },
      },
      {
        id: '2',
        type: 'node',
        shape: NodeShape.rect,
        width: DEFAULT_NODE_SIZE,
        height: DEFAULT_NODE_SIZE,
        label: 'Demo Job Template @ 05:02:15:215PM',
        data: {
          secondaryLabel: 'Job template',
        }
      },
      {
        id: '3',
        type: 'node',
        shape: NodeShape.rect,
        width: DEFAULT_NODE_SIZE,
        height: DEFAULT_NODE_SIZE,
        label: 'Approval',
        data: {
          secondaryLabel: 'Approval',
        }
      },
      {
        id: '4',
        type: 'node',
        shape: NodeShape.rect,
        width: DEFAULT_NODE_SIZE,
        height: DEFAULT_NODE_SIZE,
        label: 'Demo Project',
        data: {
          secondaryLabel: 'Project',
        }
      },
      {
        id: '5',
        type: 'node',
        shape: NodeShape.rect,
        width: DEFAULT_NODE_SIZE,
        height: DEFAULT_NODE_SIZE,
        label: 'Cleanup Activity Stream',
        data: {
          secondaryLabel: 'System job',
        }
      },
    ];

    const edges: EdgeModel[] = [
      {
        id: `edge-${1}-${2}`,
        type: 'success-edge',
        source: '1',
        target: '2',
      },
      {
        id: `edge-${1}-${3}`,
        type: 'success-edge',
        source: '1',
        target: '3',
      },
      {
        id: `edge-${1}-${4}`,
        type: 'success-edge',
        source: '1',
        target: '4',
      },
      {
        id: `edge-${1}-${5}`,
        type: 'failed-edge',
        source: '1',
        target: '5',
      },
      {
        id: `edge-${2}-${4}`,
        type: 'failed-edge',
        source: '2',
        target: '4',
      },
      {
        id: `edge-${3}-${4}`,
        type: 'success-edge',
        source: '3',
        target: '4',
      },
      {
        id: `edge-${3}-${5}`,
        type: 'failed-edge',
        source: '3',
        target: '5',
      },
      {
        id: `edge-${4}-${5}-success`,
        type: 'success-edge',
        source: '4',
        target: '5',
      },
      {
        id: `edge-${4}-${5}-failed`,
        type: 'failed-edge',
        source: '4',
        target: '5',
      },
    ];

    nodes.forEach((node) => {
      node.width = getTextWidth(node.label);
    });
    nodes[1].width = Math.max(nodes[1].width, nodes[2].width);
    nodes[2].width = nodes[1].width;

    const graph = {
      id: 'g1',
      type: 'graph',
      layout: 'Dagre'
    };

    const model = { graph, nodes, edges };

    controller.addEventListener(SELECTION_EVENT, ids => {
      setSelectedIds(ids);
    });

    controller.fromModel(model, false);
  }, [controller]);

  return (
    <TopologyView
      controlBar={
        <TopologyControlBar
          controlButtons={createTopologyControlButtons({
            ...defaultControlButtonsOptions,
            zoomInCallback: action(() => {
              controller.getGraph().scaleBy(4 / 3);
            }),
            zoomOutCallback: action(() => {
              controller.getGraph().scaleBy(0.75);
            }),
            fitToScreenCallback: action(() => {
              controller.getGraph().fit(80);
            }),
            resetViewCallback: action(() => {
              controller.getGraph().reset();
              controller.getGraph().layout();
            }),
            legend: false
          })}
        />
      }
    >
      <VisualizationSurface state={{ selectedIds }} />
    </TopologyView>
  );
};



export const StatusConnectors = React.memo(() => {
  const controller = new Visualization();
  controller.registerLayoutFactory(defaultLayoutFactory);
  controller.registerComponentFactory(defaultComponentFactory);
  controller.registerComponentFactory(statusConnectorsComponentFactory);

  return (
    <VisualizationProvider controller={controller}>
      <StatusConnectorsDemo />
    </VisualizationProvider>
  );
});
