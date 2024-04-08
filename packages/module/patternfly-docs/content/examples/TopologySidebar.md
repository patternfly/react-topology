---
id: Sidebar
section: topology
sortValue: 33
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologySidebarDemo.tsx
propComponents: ['TopologySideBar', 'TopologyView']
---

import {
  ColaLayout,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeStyle,
  GraphComponent,
  ModelKind,
  NodeShape,
  NodeStatus,
  SELECTION_EVENT,
  TopologySideBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withSelection
} from '@patternfly/react-topology';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';

import './topology-example.css';

# Introduction

**Note:** Topology lives in its own package at [`@patternfly/react-topology`](https://www.npmjs.com/package/@patternfly/react-topology).

A **side bar** is a menu that is displayed in a side drawer within a Topology view.

## Using a side bar

To add a sidebar to a Topology view:

1. Wrap your `VisualizationProvider` with the `<TopologyView>` component, which accepts `sideBar` as a property.

1. Pass the `<TopologySideBar>` component to the `sideBar` property. `<TopologySideBar>` should accept the following properties:
    - **`show`:** Logic to show the sidebar.
      - For example, you may display the side bar when a node is selected.
    - **`onClose`:** Handles the behavior that should be triggered when users close the side bar.
      - For example, you may deselect the current selection.

### Example

```ts file='./TopologySidebarDemo.tsx'
```
