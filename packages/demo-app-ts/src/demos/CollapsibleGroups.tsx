import { useState, useEffect } from 'react';
import { action } from 'mobx';
import {
  TopologyView,
  EdgeModel,
  Model,
  ModelKind,
  NodeModel,
  Visualization,
  withPanZoom,
  GraphComponent,
  withDragNode,
  VisualizationSurface,
  SELECTION_EVENT,
  SelectionEventListener,
  withSelection,
  createAggregateEdges,
  VisualizationProvider,
  useEventListener
} from '@patternfly/react-topology';
import { ToolbarGroup, ToolbarItem, Checkbox } from '@patternfly/react-core';
import defaultLayoutFactory from '../layouts/defaultLayoutFactory';
import data from '../data/group-types';
import GroupHull from '../components/GroupHull';
import Group from '../components/DemoDefaultGroup';
import DemoDefaultNode from '../components/DemoDefaultNode';
import defaultComponentFactory from '../components/defaultComponentFactory';
import DemoControlBar from './DemoControlBar';

const getModel = (collapseTypes: string[] = []): Model => {
  // create nodes from data
  const nodes: NodeModel[] = data.nodes.map((d) => {
    if (d.type) {
      return {
        type: d.type,
        id: d.id,
        group: true,
        children: data.nodes.filter((n: any) => n.group === d.id).map((n) => n.id),
        label: d.id,
        width: d.width,
        height: d.height,
        collapsed: collapseTypes.includes(d.type),
        style: {
          padding: 10
        },
        data: {
          background: d.color
        }
      };
    }
    // randomize size somewhat
    const width = 50 + d.id.length;
    const height = 50 + d.id.length;
    return {
      id: d.id,
      type: 'node',
      width,
      height,
      data: d,
      groupId: d.group
    };
  });

  // create links from data
  const edges = data.links.map(
    (d): EdgeModel => ({
      data: d,
      source: d.source,
      target: d.target,
      id: `${d.source}_${d.target}`,
      type: 'edge'
    })
  );

  // create topology model
  return {
    nodes,
    edges: createAggregateEdges('aggregate-edge', edges, nodes)
  };
};

const getVisualization = (model: Model): Visualization => {
  const vis = new Visualization();
  model.graph = {
    id: 'graph1',
    type: 'graph',
    layout: 'Cola'
  };

  vis.registerLayoutFactory(defaultLayoutFactory);
  vis.registerComponentFactory(defaultComponentFactory);

  // support pan zoom, drag, and selection
  vis.registerComponentFactory((kind, type) => {
    if (kind === ModelKind.graph) {
      return withPanZoom()(GraphComponent);
    }
    if (type === 'lightblue' || type === 'cyan') {
      return withDragNode({ canCancel: false })(GroupHull);
    }
    if (type === 'blue' || type === 'orange' || type === 'pink') {
      return withDragNode({ canCancel: false })(Group);
    }
    if (kind === ModelKind.node) {
      return withDragNode({ canCancel: false })(withSelection()(DemoDefaultNode));
    }
    return undefined;
  });

  vis.fromModel(model);

  return vis;
};

interface TopologyViewComponentProps {
  vis: Visualization;
}

const TopologyViewComponent: React.FunctionComponent<TopologyViewComponentProps> = ({ vis }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>();
  const [collapseBlue, setCollapseBlue] = useState<boolean>(false);
  const [collapseLightBlue, setCollapseLightBlue] = useState<boolean>(false);
  const [collapseCyan, setCollapseCyan] = useState<boolean>(false);
  const [collapseOrange, setCollapseOrange] = useState<boolean>(false);
  const [collapsePink, setCollapsePink] = useState<boolean>(false);

  useEventListener<SelectionEventListener>(SELECTION_EVENT, (ids) => {
    setSelectedIds(ids);
  });

  const viewToolbar = (
    <>
      <ToolbarGroup>
        <ToolbarItem>
          <Checkbox
            id="collapse-blue"
            label="Collapse Blue"
            isChecked={collapseBlue}
            onChange={(_event, checked) => setCollapseBlue(checked)}
          />
        </ToolbarItem>
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarItem>
          <Checkbox
            id="collapse-light-blue"
            label="Collapse Light Blue"
            isChecked={collapseLightBlue}
            onChange={(_event, checked) => setCollapseLightBlue(checked)}
          />
        </ToolbarItem>
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarItem>
          <Checkbox
            id="collapse-cyan"
            label="Collapse Cyan"
            isChecked={collapseCyan}
            onChange={(_event, checked) => setCollapseCyan(checked)}
          />
        </ToolbarItem>
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarItem>
          <Checkbox
            id="collapse-orange"
            label="Collapse Orange"
            isChecked={collapseOrange}
            onChange={(_event, checked) => setCollapseOrange(checked)}
          />
        </ToolbarItem>
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarItem>
          <Checkbox
            id="collapse-pink"
            label="Collapse Pink"
            isChecked={collapsePink}
            onChange={(_event, checked) => setCollapsePink(checked)}
          />
        </ToolbarItem>
      </ToolbarGroup>
    </>
  );

  useEffect(() => {
    action(() => {
      const collapsedTypes: string[] = [];
      if (collapseBlue) {
        collapsedTypes.push('blue');
      }
      if (collapseLightBlue) {
        collapsedTypes.push('lightblue');
      }
      if (collapseCyan) {
        collapsedTypes.push('cyan');
      }
      if (collapseOrange) {
        collapsedTypes.push('orange');
      }
      if (collapsePink) {
        collapsedTypes.push('pink');
      }
      const modelUpdate = getModel(collapsedTypes);
      vis.fromModel(modelUpdate);
    })();
  }, [vis, collapseBlue, collapseLightBlue, collapseCyan, collapseOrange, collapsePink]);

  return (
    <TopologyView controlBar={<DemoControlBar />} viewToolbar={viewToolbar}>
      <VisualizationSurface state={{ selectedIds }} />
    </TopologyView>
  );
};

export const CollapsibleGroups = () => {
  const vis: Visualization = getVisualization(getModel());

  return (
    <VisualizationProvider controller={vis}>
      <TopologyViewComponent vis={vis} />
    </VisualizationProvider>
  );
};
