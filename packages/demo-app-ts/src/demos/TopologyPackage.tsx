import * as React from 'react';
import { action } from 'mobx';
import * as _ from 'lodash';
import {
  Controller,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  EdgeModel,
  EventListener,
  GRAPH_POSITION_CHANGE_EVENT,
  GRAPH_LAYOUT_END_EVENT,
  isNode,
  Node,
  NodeModel,
  SELECTION_EVENT,
  SelectionEventListener,
  TopologyControlBar,
  TopologySideBar,
  TopologyView,
  useEventListener,
  useVisualizationController,
  Visualization,
  VisualizationProvider,
  VisualizationSurface
} from '@patternfly/react-topology';
import stylesComponentFactory from '../components/stylesComponentFactory';
import defaultLayoutFactory from '../layouts/defaultLayoutFactory';
import defaultComponentFactory from '../components/defaultComponentFactory';
import { generateDataModel, generateEdge, generateNode, updateGroup } from '../data/generator';
import { useTopologyOptions } from '../utils/useTopologyOptions';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';

interface TopologyViewComponentProps {
  useSidebar: boolean;
  sideBarResizable?: boolean;
}

let positionTimer: NodeJS.Timer;

const graphPositionChangeListener: EventListener = ({ graph }): void => {
  const scale = graph.getScale();
  const position = graph.getPosition();
  const scaleExtent = graph.getScaleExtent();

  // eslint-disable-next-line no-console
  console.log(`Graph Position Change:\n  Position: ${Math.round(position.x)},${Math.round(position.y)}\n  Scale: ${scale}\n  Scale Extent: max: ${scaleExtent[0]} max: ${scaleExtent[1]}`);

  // After an interval, check that what we got was the final value.
  if (positionTimer) {
    clearTimeout(positionTimer);
  }

  positionTimer = setTimeout(() => {
    const newScale = graph.getScale();
    const newPosition = graph.getPosition();
    const newScaleExtent = graph.getScaleExtent();

    // Output an error if any of the graph position values differ from when the last event was fired
    if (newScale !== scale) {
      // eslint-disable-next-line no-console
      console.error(`Scale Changed: ${scale} => ${newScale}`);
    }
    if (newPosition.x !== position.x || newPosition.y !== position.y) {
      // eslint-disable-next-line no-console
      console.error(`Graph Position Changed: ${Math.round(position.x)},${Math.round(position.y)} => ${Math.round(newPosition.x)},${Math.round(newPosition.y)}`);
    }
    if (newScaleExtent !== scaleExtent) {
      // eslint-disable-next-line no-console
      console.error(`Scale Extent Changed: ${scaleExtent} => ${scaleExtent}`);
    }
  }, 1000);
};

const layoutEndListener: EventListener = ({ graph }): void => {
  const controller: Controller = graph.getController();
  const positions = controller.getElements().filter(e => isNode(e)).map((node) => `Node: ${node.getLabel()}: ${Math.round((node as Node).getPosition().x)},${Math.round((node as Node).getPosition().y)}`);

  // eslint-disable-next-line no-console
  console.log(`Layout Complete:\n${positions.join('\n')}`);
};


const TopologyViewComponent: React.FunctionComponent<TopologyViewComponentProps> = ({
  useSidebar,
  sideBarResizable = false
}) => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const controller = useVisualizationController();

  const {
    layout,
    nodeOptions,
    edgeOptions,
    nestedLevel,
    creationCounts,
    medScale,
    lowScale,
    contextToolbar,
    viewToolbar
  } = useTopologyOptions(controller);

  React.useEffect(() => {
    const dataModel = generateDataModel(
      creationCounts.numNodes,
      creationCounts.numGroups,
      creationCounts.numEdges,
      nestedLevel,
      nodeOptions,
      edgeOptions
    );

    const model = {
      graph: {
        id: 'g1',
        type: 'graph',
        layout
      },
      ...dataModel
    };

    controller.fromModel(model, false);
    // Don't update on option changes, its handled differently to not re-layout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creationCounts, layout]);

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
      low: lowScale,
      medium: medScale
    });
  }, [controller, lowScale, medScale]);

  const topologySideBar = (
    <TopologySideBar show={_.size(selectedIds) > 0} resizable={sideBarResizable} onClose={() => setSelectedIds([])}>
      <div style={{ marginTop: 27, marginLeft: 20, height: '800px' }}>{_.head(selectedIds)}</div>
    </TopologySideBar>
  );

  React.useEffect(() => {
    const currentModel = controller.toModel();
    const nodes = currentModel.nodes;
    if (nodes.length) {
      const updatedNodes: NodeModel[] = nodes.map((node, index) => {
        if (node.group) {
          return updateGroup(node, nodeOptions);
        }
        return {
          ...node,
          ...generateNode(index, nodeOptions)
        };
      });
      controller.fromModel({ nodes: updatedNodes, edges: currentModel.edges });
    }
    // Don't update on controller change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeOptions]);

  React.useEffect(() => {
    const currentModel = controller.toModel();
    const edges = currentModel.edges;
    if (edges.length) {
      const updatedEdges: EdgeModel[] = edges.map((edge, index) => ({
        ...edge,
        ...generateEdge(index, edge.source, edge.target, edgeOptions)
      }));
      controller.fromModel({ edges: updatedEdges, nodes: currentModel.nodes });
    }
  }, [edgeOptions, controller]);

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
      contextToolbar={contextToolbar}
      viewToolbar={viewToolbar}
      sideBar={useSidebar && topologySideBar}
      sideBarOpen={useSidebar && _.size(selectedIds) > 0}
      sideBarResizable={sideBarResizable}
    >
      <VisualizationSurface state={{ selectedIds }} />
    </TopologyView>
  );
};

export const Topology = React.memo(() => {
  const controller = new Visualization();
  controller.registerLayoutFactory(defaultLayoutFactory);
  controller.registerComponentFactory(defaultComponentFactory);
  controller.registerComponentFactory(stylesComponentFactory);

  return (
    <VisualizationProvider controller={controller}>
      <TopologyViewComponent useSidebar={false} />
    </VisualizationProvider>
  );
});

export const WithSideBar = React.memo(() => {
  const controller = new Visualization();
  controller.registerLayoutFactory(defaultLayoutFactory);
  controller.registerComponentFactory(defaultComponentFactory);
  controller.registerComponentFactory(stylesComponentFactory);

  return (
    <VisualizationProvider controller={controller}>
      <TopologyViewComponent useSidebar />
    </VisualizationProvider>
  );
});

export const WithResizableSideBar = React.memo(() => {
  const controller = new Visualization();
  controller.registerLayoutFactory(defaultLayoutFactory);
  controller.registerComponentFactory(defaultComponentFactory);
  controller.registerComponentFactory(stylesComponentFactory);
  return (
    <VisualizationProvider controller={controller}>
      <TopologyViewComponent useSidebar sideBarResizable />
    </VisualizationProvider>
  );
});

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
          <WithSideBar />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>With Resizeable Side Bar</TabTitleText>}>
          <WithResizableSideBar />
        </Tab>
      </Tabs>
    </div>
  );
};
