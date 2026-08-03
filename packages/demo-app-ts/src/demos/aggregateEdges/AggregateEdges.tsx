import { FunctionComponent, useEffect, useState, useRef } from 'react';
import { action } from 'mobx';
import { ToolbarGroup, ToolbarItem, Checkbox } from '@patternfly/react-core';
import {
  ColaLayout,
  DefaultNode,
  Graph,
  GraphComponent,
  GraphElement,
  isEdge,
  isNode,
  Layout,
  LayoutFactory,
  ModelKind,
  SELECTION_EVENT,
  SelectionEventListener,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withDragNode,
  withPanZoom,
  withSelection,
  useEventListener,
  observer
} from '@patternfly/react-topology';
import DemoControlBar from '../DemoControlBar';
import AggregateEdge from './AggregateEdge';
import AggregateGroup from './AggregateGroup';
import LabeledDefaultEdge from './LabeledDefaultEdge';
import { getModel } from './model';
import { AggregateEdgesDemoModel, AggregateEdgesDemoProvider, useAggregateEdgesDemo } from './DemoContext';

const layoutFactory: LayoutFactory = (_type: string, graph: Graph): Layout | undefined =>
  new ColaLayout(graph, {
    layoutOnDrag: false,
    nodeDistance: 80,
    // Demo-sized graph: fewer ticks keeps aggregate edge snapping responsive.
    maxTicks: 200,
    initialUnconstrainedIterations: 50,
    initialUserConstraintIterations: 25,
    initialAllConstraintsIterations: 50
  });

/** Live Node.isCollapsed() — used only as input to createAggregateEdges. */
const collectCollapsedIds = (controller: Visualization): Set<string> => {
  const ids = new Set<string>();
  controller.getElements().forEach((element: GraphElement) => {
    if (isNode(element) && element.isGroup() && element.isCollapsed()) {
      ids.add(element.getId());
    }
  });
  return ids;
};

/**
 * Reused bridge/stub elements keep setStartPoint/setEndPoint overrides across collapse.
 * Clear them so anchors recompute against the new collapsed bounds.
 */
const clearAggregateEdgeEndpoints = (controller: Visualization) => {
  controller.getElements().forEach((element) => {
    if (!isEdge(element) || element.getType() !== 'aggregate-edge') {
      return;
    }
    element.setStartPoint();
    element.setEndPoint();
  });
};

const applyDemoModel = (
  controller: Visualization,
  groupEdges: boolean,
  opts: { layout?: boolean; merge?: boolean; clearEndpoints?: boolean } = {}
) => {
  const { layout = false, merge = true, clearEndpoints = false } = opts;
  action(() => {
    // Pass live collapse only for aggregation; getModel strips it before fromModel
    // so we never re-drive Node.setCollapsed (DefaultGroup already owns that).
    const model = getModel({
      groupEdges,
      collapsedIds: collectCollapsedIds(controller)
    });
    controller.fromModel(model, merge);
    // Only clear on collapse/expand — label/tag toggles are UI-only and must not
    // clear endpoints (geoKey unchanged → no AggregateEdge snap effect).
    if (clearEndpoints) {
      clearAggregateEdgeEndpoints(controller);
    }
    if (layout) {
      controller.getGraph().layout();
      controller.getGraph().fit(80);
    }
  })();
};

const AggregateEdgesView: FunctionComponent<{ controller: Visualization }> = observer(({ controller }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const {
    groupEdges,
    setGroupEdges,
    showEdgeLabels,
    setShowEdgeLabels,
    showMetricTags,
    setShowMetricTags,
    setOnCollapseChange,
    bumpSnapGeneration
  } = useAggregateEdgesDemo();
  const fittedRef = useRef(false);
  const groupEdgesRef = useRef(groupEdges);
  groupEdgesRef.current = groupEdges;

  useEventListener<SelectionEventListener>(SELECTION_EVENT, (ids) => {
    setSelectedIds(ids);
  });

  useEffect(() => {
    const isFirstLoad = !fittedRef.current;
    applyDemoModel(controller, groupEdges, {
      merge: !isFirstLoad,
      layout: isFirstLoad
    });
    if (isFirstLoad) {
      fittedRef.current = true;
    }
  }, [controller, groupEdges]);

  useEffect(() => {
    setOnCollapseChange(() => {
      // Collapse is already applied on the Node by DefaultGroup; rebuild aggregates only.
      applyDemoModel(controller, groupEdgesRef.current, { merge: true, layout: false, clearEndpoints: true });
      bumpSnapGeneration();
    });
  }, [bumpSnapGeneration, controller, setOnCollapseChange]);

  const viewToolbar = (
    <ToolbarGroup>
      <ToolbarItem>
        <Checkbox
          id="group-edges"
          label="Aggregate edges between groups"
          isChecked={groupEdges}
          onChange={(_event, checked) => {
            // Full graph shape change — re-layout + fit.
            fittedRef.current = false;
            setGroupEdges(checked);
          }}
        />
      </ToolbarItem>
      <ToolbarItem>
        <Checkbox
          id="edge-labels"
          label="Show custom edge labels"
          isChecked={showEdgeLabels}
          onChange={(_event, checked) => setShowEdgeLabels(checked)}
        />
      </ToolbarItem>
      <ToolbarItem>
        <Checkbox
          id="metric-tags"
          label="Show metric tags (summed Bps)"
          isChecked={showMetricTags}
          onChange={(_event, checked) => setShowMetricTags(checked)}
        />
      </ToolbarItem>
    </ToolbarGroup>
  );

  return (
    <TopologyView controlBar={<DemoControlBar />} viewToolbar={viewToolbar}>
      <VisualizationSurface state={{ selectedIds }} />
    </TopologyView>
  );
});

export const AggregateEdges = () => {
  const [controller] = useState(() => {
    const vis = new Visualization();
    vis.registerLayoutFactory(layoutFactory);
    vis.registerComponentFactory((kind, type) => {
      if (kind === ModelKind.graph) {
        return withPanZoom()(GraphComponent);
      }
      if (type === 'group') {
        return withDragNode({ canCancel: false })(withSelection()(AggregateGroup));
      }
      if (type === 'aggregate-edge') {
        return withSelection()(AggregateEdge);
      }
      if (kind === ModelKind.node) {
        return withDragNode({ canCancel: false })(withSelection()(DefaultNode));
      }
      if (kind === ModelKind.edge) {
        return withSelection()(LabeledDefaultEdge);
      }
      return undefined;
    });
    vis.fromModel(getModel({ groupEdges: false }), false);
    return vis;
  });

  return (
    <AggregateEdgesDemoProvider value={new AggregateEdgesDemoModel()}>
      <VisualizationProvider controller={controller}>
        <AggregateEdgesView controller={controller} />
      </VisualizationProvider>
    </AggregateEdgesDemoProvider>
  );
};
