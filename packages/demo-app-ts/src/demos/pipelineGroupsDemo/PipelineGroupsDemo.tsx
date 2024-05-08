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
  addSpacerNodes,
  pipelineElementFactory,
  isEdge,
  Edge,
} from '@patternfly/react-topology';
import pipelineGroupsComponentFactory from './pipelineGroupsComponentFactory';
import {
  createComplexDemoPipelineGroupsNodes,
  createDemoPipelineGroupsNodes
} from './createDemoPipelineGroupsNodes';
import { PipelineGroupsDemoContext, PipelineGroupsDemoModel } from './PipelineGroupsDemoContext';
import OptionsBar from './OptionsBar';
import DemoControlBar from '../DemoControlBar';

const TopologyPipelineGroups: React.FC<{ nodes: PipelineNodeModel[] }> = observer(({ nodes }) => {
  const controller = useVisualizationController();
  const options = React.useContext(PipelineGroupsDemoContext);
  const [selectedIds, setSelectedIds] = React.useState<string[]>();

  useEventListener<SelectionEventListener>(SELECTION_EVENT, ids => {
    if (ids?.[0]) {
      const element = controller?.getElementById(ids[0]);
      if (element && isEdge(element)) {
        const edge = element as Edge;
        const selectedEdges = [edge.getId()];
        const source = edge.getSource();
        const target = edge.getTarget();
        if (source.getType() === DEFAULT_SPACER_NODE_TYPE) {
          const sourceEdges = source.getTargetEdges();
          selectedEdges.push(...sourceEdges.map((e) => e.getId()));
        }
        if (target.getType() === DEFAULT_SPACER_NODE_TYPE) {
          const targetEdges = target.getSourceEdges();
          selectedEdges.push(...targetEdges.map((e) => e.getId()));
        }
        setSelectedIds(selectedEdges);
        return;
      }
    }
    setSelectedIds(ids);
  });

  React.useEffect(() => {
    const pipelineNodes = addSpacerNodes(nodes);
    const edges = getEdgesFromNodes(pipelineNodes, DEFAULT_SPACER_NODE_TYPE, 'edge', 'edge');

    controller.fromModel(
      {
        graph: {
          id: 'g1',
          type: 'graph',
          x: 25,
          y: 25,
          layout: options.verticalLayout ? TOP_TO_BOTTOM : LEFT_TO_RIGHT
        },
        nodes: pipelineNodes,
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

export const PipelineGroupsDemoComponent: React.FC<{ complex?: boolean }> = ({ complex }) => {
  const controller = new Visualization();
  controller.registerElementFactory(pipelineElementFactory);
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
  const nodes = complex ? createComplexDemoPipelineGroupsNodes() : createDemoPipelineGroupsNodes();
  return (
    <div className="pf-ri__topology-demo">
      <VisualizationProvider controller={controller}>
        <PipelineGroupsDemoContext.Provider value={new PipelineGroupsDemoModel()}>
          <TopologyPipelineGroups nodes={nodes} />
        </PipelineGroupsDemoContext.Provider>
      </VisualizationProvider>
    </div>
  );
};

export const PipelineGroupsDemo = () => {
  return <PipelineGroupsDemoComponent />
};

export const PipelineGroupsComplexDemo = () => {
  return <PipelineGroupsDemoComponent complex />
};

