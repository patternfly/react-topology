import React from 'react';
import {
  Graph,
  Layout,
  PipelineDagreLayout,
  Visualization,
  VisualizationProvider,
  useEventListener,
  SelectionEventListener,
  SELECTION_EVENT,
  TopologyView,
  VisualizationSurface,
  useVisualizationController,
  NODE_SEPARATION_HORIZONTAL,
  GRAPH_LAYOUT_END_EVENT,
  getSpacerNodes,
  getEdgesFromNodes,
  DEFAULT_EDGE_TYPE,
  DEFAULT_SPACER_NODE_TYPE,
  DEFAULT_FINALLY_NODE_TYPE,
  TOP_TO_BOTTOM,
  LEFT_TO_RIGHT,
  observer
} from '@patternfly/react-topology';
import pipelineComponentFactory, { GROUPED_EDGE_TYPE } from './pipelineComponentFactory';
import { useDemoPipelineNodes } from './useDemoPipelineNodes';
import { GROUPED_PIPELINE_NODE_SEPARATION_HORIZONTAL } from './DemoTaskGroupEdge';
import { PipelineDemoContext, PipelineDemoModel } from './PipelineDemoContext';
import PipelineOptionsBar from './PipelineOptionsBar';

export const PIPELINE_NODE_SEPARATION_VERTICAL = 65;

export const LAYOUT_TITLE = 'Layout';

const GROUP_PREFIX = 'Grouped_';
const VERTICAL_SUFFIX = '_Vertical';
const PIPELINE_LAYOUT = 'PipelineLayout';

const TopologyPipelineLayout: React.FC = observer(() => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>();

  const controller = useVisualizationController();
  const pipelineOptions = React.useContext(PipelineDemoContext);
  const pipelineNodes = useDemoPipelineNodes(
    pipelineOptions.showContextMenus,
    pipelineOptions.showBadges,
    pipelineOptions.showIcons,
    'PipelineDagreLayout',
    pipelineOptions.showGroups
  );

  React.useEffect(() => {
    const spacerNodes = getSpacerNodes(pipelineNodes);
    const nodes = [...pipelineNodes, ...spacerNodes];
    const edgeType = pipelineOptions.showGroups ? GROUPED_EDGE_TYPE : DEFAULT_EDGE_TYPE;
    const edges = getEdgesFromNodes(
      nodes.filter(n => !n.group),
      DEFAULT_SPACER_NODE_TYPE,
      edgeType,
      edgeType,
      [DEFAULT_FINALLY_NODE_TYPE],
      edgeType
    );

    controller.fromModel(
      {
        graph: {
          id: 'g1',
          type: 'graph',
          x: 25,
          y: 25,
          layout: `${pipelineOptions.showGroups ? GROUP_PREFIX : ''}${PIPELINE_LAYOUT}${pipelineOptions.verticalLayout ? VERTICAL_SUFFIX : ''}`
        },
        nodes,
        edges
      },
      true
    );
    controller.getGraph().layout();
  }, [controller, pipelineNodes, pipelineOptions.showGroups, pipelineOptions.verticalLayout]);

  useEventListener<SelectionEventListener>(SELECTION_EVENT, ids => {
    setSelectedIds(ids);
  });

  return (
    <TopologyView contextToolbar={<PipelineOptionsBar isLayout />}>
      <VisualizationSurface state={{ selectedIds }} />
    </TopologyView>
  );
});

TopologyPipelineLayout.displayName = 'TopologyPipelineLayout';

export const PipelineLayoutDemo = React.memo(() => {
  const controller = new Visualization();
  controller.setFitToScreenOnLayout(true);
  controller.registerComponentFactory(pipelineComponentFactory);
  controller.registerLayoutFactory(
    (type: string, graph: Graph): Layout | undefined =>
      new PipelineDagreLayout(graph, {
        nodesep: PIPELINE_NODE_SEPARATION_VERTICAL,
        rankdir: type.endsWith(VERTICAL_SUFFIX) ? TOP_TO_BOTTOM : LEFT_TO_RIGHT,
        ranksep:
          type.startsWith(GROUP_PREFIX) ? GROUPED_PIPELINE_NODE_SEPARATION_HORIZONTAL : NODE_SEPARATION_HORIZONTAL,
        ignoreGroups: true
      })
  );
  controller.fromModel(
    {
      graph: {
        id: 'g1',
        type: 'graph',
        x: 25,
        y: 25,
        layout: PIPELINE_LAYOUT
      }
    },
    false
  );
  controller.addEventListener(GRAPH_LAYOUT_END_EVENT, () => {
    controller.getGraph().fit(75);
  });

  return (
    <div className="pf-ri__topology-demo">
      <VisualizationProvider controller={controller}>
        <PipelineDemoContext.Provider value={new PipelineDemoModel()}>
          <TopologyPipelineLayout />
        </PipelineDemoContext.Provider>
      </VisualizationProvider>
    </div>
  );
});
