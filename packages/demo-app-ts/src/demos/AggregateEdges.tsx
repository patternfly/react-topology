import * as React from 'react';
import { action } from 'mobx';
import * as _ from 'lodash';
import {
  ColaLayout,
  createAggregateEdges,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  Graph,
  Layout,
  LayoutFactory,
  Model,
  NodeShape,
  SELECTION_EVENT,
  TopologyControlBar,
  TopologySideBar,
  TopologyView, useVisualizationController,
  Visualization, VisualizationProvider,
  VisualizationSurface
} from '@patternfly/react-topology';
import defaultComponentFactory from '../components/defaultComponentFactory';
import stylesComponentFactory from '../components/stylesComponentFactory';
import {
  createEdge,
  createNode,
} from '../utils/styleUtils';
import { ToolbarGroup, ToolbarItem, Checkbox } from '@patternfly/react-core';

const defaultLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {
  return new ColaLayout(graph, { layoutOnDrag: false, nodeDistance: 100 });
};

const getModel = (peerAggregate: boolean, collapsibleAggregate: boolean): Model => {
  const node1 = createNode({
    id: '1',
    shape: NodeShape.ellipse,
    label: 'One',
    setLocation: false,
  });
  const node2 = createNode({
    id: '2',
    shape: NodeShape.ellipse,
    label: 'Two',
    setLocation: false,
  });
  const group1Nodes = [
    createNode({
      id: '11',
      shape: NodeShape.ellipse,
      label: 'One-One',
      setLocation: false,
    }),
    createNode({
      id: '12',
      shape: NodeShape.ellipse,
      label: 'One-Two',
      setLocation: false,
    }),
    createNode({
      id: '13',
      shape: NodeShape.ellipse,
      label: 'One-Three',
      setLocation: false,
    }),
  ];
  const group2Nodes = [
    createNode({
      id: '21',
      shape: NodeShape.ellipse,
      label: 'Two-One',
      setLocation: false,
    }),
    createNode({
      id: '22',
      shape: NodeShape.ellipse,
      label: 'Two-Two',
      setLocation: false,
    }),
    createNode({
      id: '23',
      shape: NodeShape.ellipse,
      label: 'Two-Three',
      setLocation: false,
    }),
    createNode({
      id: '24',
      shape: NodeShape.ellipse,
      label: 'Two-Four',
      setLocation: false,
    }),
    createNode({
      id: '25',
      shape: NodeShape.ellipse,
      label: 'Two-Five',
      setLocation: false,
    }),
  ];
  const group3Nodes = [
    createNode({
      id: '31',
      shape: NodeShape.ellipse,
      label: 'Three-One',
      setLocation: false,
    }),
    createNode({
      id: '32',
      shape: NodeShape.ellipse,
      label: 'Three-Two',
      setLocation: false,
    }),
    createNode({
      id: '33',
      shape: NodeShape.ellipse,
      label: 'Three-Three',
      setLocation: false,
    }),
  ];

  const groupOne = {
    id: 'Group 1',
    type: 'group',
    label: 'Group 1',
    children: group1Nodes.map(n => n.id),
    group: true,
    style: { padding: 17 },
    data: {
      collapsedWidth: 75,
      collapsedHeight: 75,
      collapsible: true
    }
  };

  const groupTwo = {
    id: 'Group 2',
    type: 'group',
    label: 'Group 2',
    children: group2Nodes.map(n => n.id),
    group: true,
    collapsed: collapsibleAggregate,
    style: { padding: 17 },
    data: {
      collapsedWidth: 75,
      collapsedHeight: 75,
      collapsible: true
    }
  };

  const groupThree = {
    id: 'Group 3',
    type: 'group',
    label: 'Group 3',
    children: group3Nodes.map(n => n.id),
    group: true,
    style: { padding: 17 },
    data: {
      collapsedWidth: 75,
      collapsedHeight: 75,
      collapsible: true
    }
  };

  const nodes = [node1, node2, ...group1Nodes, ...group2Nodes, ...group3Nodes, groupOne, groupTwo, groupThree];

  const edges = [
    createEdge('11', '21', {}),
    createEdge('12', '21', {}),
    createEdge('13', '21', {}),
    createEdge('1', '31', {}),
    createEdge('1', '32', {}),
    createEdge('2', '31', {}),
    createEdge('21', '31', {}),
    createEdge('32', '21', {}),
    createEdge('21', '32', {}),
    createEdge('22', '31', {}),
    createEdge('22', '32', {}),
    // createEdge('23', '25', {}), TODO: crash view
  ];

  const graph = {
    id: 'g1',
    type: 'graph',
    layout: 'ColaNoForce'
  };

  return {
    graph,
    nodes,
    edges: createAggregateEdges('aggregate-edge', edges, nodes, { group: peerAggregate, visibility: collapsibleAggregate })
  };
};

export const AggregateEdgesDemo: React.FunctionComponent = () => {
  const controller = useVisualizationController();
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [peerAggregate, setGroupAggregate] = React.useState<boolean>(true);
  const [collapsibleAggregate, setCollapsibleAggregate] = React.useState<boolean>(false);

  const viewToolbar = (
    <>
      <ToolbarGroup>
        <ToolbarItem>
          <Checkbox
            id="peer-aggregate"
            label="Aggregate by group peers"
            isChecked={peerAggregate}
            onChange={checked => setGroupAggregate(checked)}
          />
        </ToolbarItem>
        <ToolbarItem>
          <Checkbox
            id="collapsible-aggregate"
            label="Aggregate by collapsible groups"
            isChecked={collapsibleAggregate}
            onChange={checked => setCollapsibleAggregate(checked)}
          />
        </ToolbarItem>
      </ToolbarGroup>
    </>
  );

  React.useEffect(() => {
    const model = getModel(peerAggregate, collapsibleAggregate);
    // eslint-disable-next-line no-console
    console.log("model", model);
    controller.addEventListener(SELECTION_EVENT, ids => {
      setSelectedIds(ids);
    });

    controller.fromModel(model, false);
  }, [collapsibleAggregate, controller, peerAggregate]);

  const topologySideBar = (
    <TopologySideBar show={_.size(selectedIds) > 0} onClose={() => setSelectedIds([])}>
      <div style={{ marginTop: 27, marginLeft: 20, height: '800px' }}>{_.head(selectedIds)}</div>
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
      sideBar={topologySideBar}
      sideBarOpen={_.size(selectedIds) > 0}
      viewToolbar={viewToolbar}
    >
      <VisualizationSurface state={{ selectedIds }} />
    </TopologyView>
  );
};



export const AggregateEdges = React.memo(() => {
  const controller = new Visualization();
  controller.registerLayoutFactory(defaultLayoutFactory);
  controller.registerComponentFactory(defaultComponentFactory);
  controller.registerComponentFactory(stylesComponentFactory);

  return (
    <VisualizationProvider controller={controller}>
      <AggregateEdgesDemo />
    </VisualizationProvider>
  );
});
