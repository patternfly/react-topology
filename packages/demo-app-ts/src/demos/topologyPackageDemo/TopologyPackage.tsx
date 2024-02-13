import * as React from 'react';
import { action } from 'mobx';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import {
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  GRAPH_POSITION_CHANGE_EVENT,
  GRAPH_LAYOUT_END_EVENT,
  SELECTION_EVENT,
  SelectionEventListener,
  TopologyControlBar,
  TopologySideBar,
  TopologyView,
  useEventListener,
  useVisualizationController,
  Visualization,
  VisualizationProvider,
  VisualizationSurface, observer
} from '@patternfly/react-topology';
import defaultLayoutFactory from '../../layouts/defaultLayoutFactory';
import defaultComponentFactory from '../../components/defaultComponentFactory';
import { generateDataModel } from './generator';
import OptionsContextBar from './OptionsContextBar';
import OptionsViewBar from './OptionsViewBar';
import { DemoContext } from './DemoContext';
import demoComponentFactory from './demoComponentFactory';
import { graphPositionChangeListener, layoutEndListener } from './listeners';

interface TopologyViewComponentProps {
  useSidebar: boolean;
  sideBarResizable?: boolean;
}

const TopologyViewComponent: React.FunctionComponent<TopologyViewComponentProps> = observer(({
  useSidebar,
  sideBarResizable = false
}) => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const controller = useVisualizationController();
  const options = React.useContext(DemoContext);

  React.useEffect(() => {
    const dataModel = generateDataModel(
      options.creationCounts.numNodes,
      options.creationCounts.numGroups,
      options.creationCounts.numEdges,
      options.nestedLevel,
    );

    const model = {
      graph: {
        id: 'g1',
        type: 'graph',
        layout: options.layout,
      },
      ...dataModel
    };

    controller.fromModel(model, true);
  }, [controller, options.creationCounts, options.layout, options.nestedLevel]);

  useEventListener<SelectionEventListener>(SELECTION_EVENT, ids => {
    setSelectedIds(ids);
  });

  React.useEffect(() => {

    controller.addEventListener(GRAPH_POSITION_CHANGE_EVENT, graphPositionChangeListener);
    controller.addEventListener(GRAPH_LAYOUT_END_EVENT, layoutEndListener);

    return () => {
      controller.removeEventListener(GRAPH_POSITION_CHANGE_EVENT, graphPositionChangeListener);
      controller.removeEventListener(GRAPH_LAYOUT_END_EVENT, layoutEndListener);
    };
  }, [controller]);

  React.useEffect(() => {
    controller.getGraph().setDetailsLevelThresholds({
      low: options.lowScale,
      medium: options.medScale
    });
  }, [controller, options.lowScale, options.medScale]);

  const topologySideBar = (
    <TopologySideBar show={!!selectedIds?.length} resizable={sideBarResizable} onClose={() => setSelectedIds([])}>
      <div style={{ marginTop: 27, marginLeft: 20, height: '800px' }}>{selectedIds?.[0]}</div>
    </TopologySideBar>
  );

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
      contextToolbar={<OptionsContextBar />}
      viewToolbar={<OptionsViewBar controller={controller} /> }
      sideBar={useSidebar && topologySideBar}
      sideBarOpen={useSidebar && !!selectedIds?.length}
      sideBarResizable={sideBarResizable}
    >
      <VisualizationSurface state={{ selectedIds }} />
    </TopologyView>
  );
});

export const Topology: React.FC<{ useSidebar?: boolean, sideBarResizable?: boolean }> = ({
  useSidebar = false,
  sideBarResizable = false
}) => {
  const controller = new Visualization();
  controller.registerLayoutFactory(defaultLayoutFactory);
  controller.registerComponentFactory(defaultComponentFactory);
  controller.registerComponentFactory(demoComponentFactory);

  return (
    <VisualizationProvider controller={controller}>
      <TopologyViewComponent useSidebar={useSidebar} sideBarResizable={sideBarResizable}/>
    </VisualizationProvider>
  );
};

export const TopologyPackage: React.FunctionComponent = () => {
  const [activeKey, setActiveKey] = React.useState<string | number>(0);

  const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveKey(tabIndex);
  };

  return (
    <div className="pf-ri__topology-demo">
      <Tabs unmountOnExit activeKey={activeKey} onSelect={handleTabClick}>
        <Tab eventKey={0} title={<TabTitleText>Topology</TabTitleText>}>
          <Topology />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>With Side Bar</TabTitleText>}>
          <Topology useSidebar={true} />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>With Resizeable Side Bar</TabTitleText>}>
          <Topology useSidebar={true} sideBarResizable={true} />
        </Tab>
      </Tabs>
    </div>
  );
};
