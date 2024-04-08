---
id: Toolbar
section: topology
sortValue: 32
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologyToolbarDemo.tsx
propComponents: ['TopologyView']
---

import {
  BadgeLocation,
  ColaLayout,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeStyle,
  GraphComponent,
  LabelPosition,
  ModelKind,
  NodeShape,
  NodeStatus,
  observer,
  SELECTION_EVENT,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface
} from '@patternfly/react-topology';
import {
  MenuToggle,
  Select,
  SelectList,
  SelectOption,
  ToolbarItem
} from '@patternfly/react-core';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';

import './topology-example.css';

# Introduction

**Note:** Topology lives in its own package at [`@patternfly/react-topology`](https://www.npmjs.com/package/@patternfly/react-topology).

A **toolbar** places controls within a panel at the top of a Topology view.

## Using a toolbar

To add a toolbar to a Topology view, wrap your `VisualizationProvider` with the `<TopologyView>` component, which will accept `viewToolbar` and/or `contextToolbar` as properties.
  - **`contextToolbar`:** Displayed at the top of the view, containing components for changing context.
  - **`viewToolbar`:** Displayed below the context toolbar, containing components for changing view contents.

**Note**: You can set the "state" on the controller to track values such as the `viewOptions`.

`GraphElement` components can retrieve state from the controller via:
`element.getController().getState<ControllerState>();`
and react to that state accordingly.

You will need to pass in the corresponding properties and the related `viewOptions` state values to your custom `<DefaultNode>` component for all view options you want to track.

### Example

```ts file='./TopologyToolbarDemo.tsx'
```
