import React from 'react';
import {
  observer,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  useEventListener,
  SelectionEventListener,
  SELECTION_EVENT,
  useVisualizationController
} from '@patternfly/react-topology';
import pipelineComponentFactory from './pipelineComponentFactory';
import { useDemoPipelineNodes } from './useDemoPipelineNodes';
import { PipelineDemoContext, PipelineDemoModel } from './PipelineDemoContext';
import PipelineOptionsBar from './PipelineOptionsBar';

export const TASKS_TITLE = 'Tasks';

export const PipelineTasks: React.FC = observer(() => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>();

  const controller = useVisualizationController();
  const pipelineOptions = React.useContext(PipelineDemoContext);
  const pipelineNodes = useDemoPipelineNodes(
    pipelineOptions.showContextMenus,
    pipelineOptions.showBadges,
    pipelineOptions.showIcons,
  );

  React.useEffect(() => {
    controller.fromModel(
      {
        graph: {
          id: 'g1',
          type: 'graph',
          x: 25,
          y: 25
        },
        nodes: pipelineNodes
      },
      false
    );
  }, [controller, pipelineNodes]);

  useEventListener<SelectionEventListener>(SELECTION_EVENT, (ids) => {
    setSelectedIds(ids);
  });

  return (
    <TopologyView contextToolbar={<PipelineOptionsBar />}>
      <VisualizationSurface state={{ selectedIds }} />
    </TopologyView>
  );
});

PipelineTasks.displayName = 'PipelineTasks';

export const PipelineTasksDemo = React.memo(() => {
  const controller = new Visualization();
  controller.registerComponentFactory(pipelineComponentFactory);
  return (
    <div className="pf-ri__topology-demo">
      <VisualizationProvider controller={controller}>
        <PipelineDemoContext.Provider value={new PipelineDemoModel()}>
          <PipelineTasks />
        </PipelineDemoContext.Provider>
      </VisualizationProvider>
    </div>
  );
});
