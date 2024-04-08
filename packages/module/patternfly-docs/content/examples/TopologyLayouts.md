---
id: Layouts
section: topology
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologyLayoutsDemo.tsx
---

import {
  action,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  BreadthFirstLayout,
  ColaLayout,
  ColaGroupsLayout,
  ConcentricLayout,
  DagreLayout,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  ForceLayout,
  GridLayout,
  GraphComponent,
  ModelKind,
  NodeShape,
  NodeStatus,
  observer,
  GRAPH_LAYOUT_END_EVENT,
  TopologyControlBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withDragNode,
  withPanZoom
} from '@patternfly/react-topology';
import { ToolbarItem } from '@patternfly/react-core';
import {
 Dropdown,
 DropdownItem,
 DropdownList,
} from '@patternfly/react-core';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';

import './topology-example.css';

# Introduction

**Note:** Topology lives in its own package at [`@patternfly/react-topology`](https://www.npmjs.com/package/@patternfly/react-topology).

A **layout** helps position the nodes in a Topology view, according to different visualization structures.

There are many algorithms available for positioning nodes, based on factors like the side of nodes, distance between nodes, edges, and so on. The following layouts are available for you to use in your Topology views.

- **Force:** Built on top of the d3-force layout provided by [d3/d3-force](https://github.com/d3/d3-force).
- **Dagre:** Built on top of the dagrejs dagre layout provided by [dagrejs/dagre](https://github.com/dagrejs/dagre).
- **Cola:** Built on top of the WebCola layout provided by [tgdwyer/WebCola](://github.com/tgdwyer/WebCola). 
  - This layout uses `force simulation` by default, but can be turned off by setting the options `layoutOnDrag` flag to "false".
- **ColaGroups:** Uses the cola layout recursively on each group, so that the group's children locations are set before the group's location is set relative to other groups or nodes at its level.
- **Grid:** Orders nodes in a grid, making the grid as `square` as possible.
  - This layout works well to distribute nodes without taking edges into consideration.
- **Concentric:** Places nodes in a circular pattern.
  - This layout has better results focused on high connectivity.
- **BreadthFirst:** Uses a breadth-first algorithm to place the nodes. 
  - This layout helps when you need to provide a natural "levels" approach that can be combined with other algorithms, in order to help users to identify the dependencies between elements.
  - Note: The current version doesn't manage the overflow of a row.

### Example

```ts file='./TopologyLayoutsDemo.tsx'
```
