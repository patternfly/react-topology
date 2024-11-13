import * as React from 'react';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import {
  GRAPH_POSITION_CHANGE_EVENT,
  GRAPH_LAYOUT_END_EVENT,
  SELECTION_EVENT,
  SelectionEventListener,
  TopologySideBar,
  TopologyView,
  useEventListener,
  useVisualizationController,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  observer,
  GraphAreaSelectedEventListener,
  GRAPH_AREA_SELECTED_EVENT,
  GraphAreaDraggingEvent,
  GRAPH_AREA_DRAGGING_EVENT
} from '@patternfly/react-topology';
import defaultLayoutFactory from '../../layouts/defaultLayoutFactory';
import defaultComponentFactory from '../../components/defaultComponentFactory';
import { generateDataModel } from './generator';
import OptionsContextBar from './OptionsContextBar';
import OptionsViewBar from './OptionsViewBar';
import { DemoContext } from './DemoContext';
import demoComponentFactory from './demoComponentFactory';
import { graphPositionChangeListener, layoutEndListener } from './listeners';
import DemoControlBar from '../DemoControlBar';
import AreaDragHint from './AreaDragHint';

interface TopologyViewComponentProps {
  useSidebar: boolean;
  sideBarResizable?: boolean;
}

const TopologyViewComponent: React.FunctionComponent<TopologyViewComponentProps> = observer(
  ({ useSidebar, sideBarResizable = false }) => {
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [showAreaDragHint, setShowAreaDragHint] = React.useState<boolean>(false);
    const controller = useVisualizationController();
    const options = React.useContext(DemoContext);

    React.useEffect(() => {
      const dataModel = generateDataModel(
        options.creationCounts.numNodes,
        options.creationCounts.numGroups,
        options.creationCounts.numEdges,
        options.creationCounts.nestedLevel
      );

      const model = {
        graph: {
          id: 'g1',
          type: 'graph',
          layout: options.layout
        },
        ...dataModel
      };

      controller.fromModel(model, true);
    }, [controller, options.creationCounts, options.layout]);

    useEventListener<SelectionEventListener>(SELECTION_EVENT, (ids) => {
      setSelectedIds(ids);
    });

    useEventListener<GraphAreaSelectedEventListener>(
      GRAPH_AREA_SELECTED_EVENT,
      ({ graph, modifier, startPoint, endPoint }) => {
        if (modifier === 'ctrlKey') {
          graph.zoomToSelection(startPoint, endPoint);
          return;
        }
        if (modifier === 'shiftKey') {
          const selections = graph.nodesInSelection(startPoint, endPoint);
          setSelectedIds(
            selections.reduce((acc, node) => {
              if (!node.isGroup()) {
                acc.push(node.getId());
              }
              return acc;
            }, [])
          );
        }
      }
    );

    useEventListener<GraphAreaDraggingEvent>(GRAPH_AREA_DRAGGING_EVENT, ({ isDragging }) => {
      setShowAreaDragHint(isDragging);
    });

    React.useEffect(() => {
      let resizeTimeout: NodeJS.Timeout;

      if (selectedIds[0]) {
        const selectedNode = controller.getNodeById(selectedIds[0]);
        if (selectedNode) {
          // Use a timeout in order to allow the side panel to be shown and window size recomputed
          resizeTimeout = setTimeout(() => {
            controller.getGraph().panIntoView(selectedNode, { offset: 20, minimumVisible: 100 });
            resizeTimeout = null;
          }, 500);
        }
      }
      return () => {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }
      };
    }, [selectedIds, controller]);

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
        controlBar={<DemoControlBar />}
        contextToolbar={<OptionsContextBar />}
        viewToolbar={<OptionsViewBar controller={controller} />}
        sideBar={useSidebar && topologySideBar}
        sideBarOpen={useSidebar && !!selectedIds?.length}
        sideBarResizable={sideBarResizable}
      >
        {showAreaDragHint ? <AreaDragHint /> : null}
        <VisualizationSurface state={{ selectedIds }} />
      </TopologyView>
    );
  }
);

export const Topology: React.FC<{ useSidebar?: boolean; sideBarResizable?: boolean }> = ({
  useSidebar = false,
  sideBarResizable = false
}) => {
  const controller = new Visualization();
  controller.registerLayoutFactory(defaultLayoutFactory);
  controller.registerComponentFactory(defaultComponentFactory);
  controller.registerComponentFactory(demoComponentFactory);

  return (
    <VisualizationProvider controller={controller}>
      <TopologyViewComponent useSidebar={useSidebar} sideBarResizable={sideBarResizable} />
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
