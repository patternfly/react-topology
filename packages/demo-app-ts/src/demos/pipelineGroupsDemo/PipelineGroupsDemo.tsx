import React from 'react';
import {
  Graph,
  Layout,
  PipelineDagreGroupsLayout,
  Visualization,
  VisualizationProvider,
  useEventListener,
  SelectionEventListener,
  SELECTION_EVENT,
  TopologyView,
  VisualizationSurface,
  getEdgesFromNodes,
  DEFAULT_SPACER_NODE_TYPE,
  observer,
  NODE_SEPARATION_HORIZONTAL,
  NODE_SEPARATION_VERTICAL,
  LEFT_TO_RIGHT,
  TOP_TO_BOTTOM,
  PipelineNodeModel,
  useVisualizationController,
} from '@patternfly/react-topology';
import pipelineGroupsComponentFactory from './pipelineGroupsComponentFactory';
import { createDemoPipelineGroupsNodes } from './createDemoPipelineGroupsNodes';
import { PipelineGroupsDemoContext, PipelineGroupsDemoModel } from './PipelineGroupsDemoContext';
import OptionsBar from './OptionsBar';
import DemoControlBar from '../DemoControlBar';

const TopologyPipelineGroups: React.FC<{ nodes: PipelineNodeModel[] }> = observer(({ nodes }) => {
  const controller = useVisualizationController();
  const options = React.useContext(PipelineGroupsDemoContext);
  const [selectedIds, setSelectedIds] = React.useState<string[]>();

  useEventListener<SelectionEventListener>(SELECTION_EVENT, ids => {
    setSelectedIds(ids);
  });

  React.useEffect(() => {
    const edges = getEdgesFromNodes(nodes, DEFAULT_SPACER_NODE_TYPE, 'edge', 'edge');
    controller.fromModel(
      {
        graph: {
          id: 'g1',
          type: 'graph',
          x: 25,
          y: 25,
          layout: options.verticalLayout ? TOP_TO_BOTTOM : LEFT_TO_RIGHT
        },
        nodes,
        edges,
      },
      false
    );
  }, [controller, nodes, options.verticalLayout]);

  return (
    <TopologyView contextToolbar={<OptionsBar />} controlBar={<DemoControlBar />}>
      <VisualizationSurface state={{ selectedIds }} />
    </TopologyView>
  );
});

TopologyPipelineGroups.displayName = 'TopologyPipelineLayout';

export const PipelineGroupsDemo = observer(() => {
  const controller = new Visualization();
  controller.registerComponentFactory(pipelineGroupsComponentFactory);
  controller.registerLayoutFactory(
    (type: string, graph: Graph): Layout | undefined =>
      new PipelineDagreGroupsLayout(graph, {
        nodesep: NODE_SEPARATION_HORIZONTAL,
        ranksep: NODE_SEPARATION_VERTICAL + 40,
        rankdir: type,
        ignoreGroups: true,
      })
  );
  const nodes = createDemoPipelineGroupsNodes();
  return (
    <div className="pf-ri__topology-demo">
      <VisualizationProvider controller={controller}>
        <PipelineGroupsDemoContext.Provider value={new PipelineGroupsDemoModel()}>
          <TopologyPipelineGroups nodes={nodes} />
        </PipelineGroupsDemoContext.Provider>
      </VisualizationProvider>
    </div>
  );
});
