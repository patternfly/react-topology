---
id: Selection
section: topology
sortValue: 21
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologySelectableDemo.tsx
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

**Selection** functionality enables users to select nodes and edges in a Topology view.

## Using selection

To allow nodes and edges to be selectable, use the `withSelection` utility when you return the node/edge component in the `ComponentFactory`. 
  - For example: `withSelection()(MyCustomNode)`

The component should accept 2 parameters, `onSelect` and `selected` (you can simply extend `WithSelectionProps`).
- **`onSelect`:** Function to call upon node selection. Typically, the outer container for the component would call `onSelect` when clicked.
- **`selected`:** Indicates if the element is currently selected. Updates the drawing of the component to indicate its selection status.

Alternatively, you can use the `useSelection` hook within the component to retrieve the same 2 properties.

If you are using `DefaultNode`, these properties can be passed along and will be handled appropriately.

By default, the application must control the selection state. This can be done by adding a listener to the controller for a `SELECTION_EVENT`. The listener would then keep track of the `selectedIds` and maintain the ids in `state`, which should be passed to the `VisualizationSurface`.

Alternatively, you can pass `{ controlled: true }` to the `withSelection` utility or to the `useSelection` hook.

### Example

```ts file='./TopologySelectableDemo.tsx'
```
