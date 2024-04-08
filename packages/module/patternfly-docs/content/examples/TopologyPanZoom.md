---
id: Pan and zoom
section: topology
sortValue: 22
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologyPanZoomDemo.tsx
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
  withPanZoom
} from '@patternfly/react-topology';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';

import './topology-example.css';

# Introduction

**Note:** Topology lives in its own package at [`@patternfly/react-topology`](https://www.npmjs.com/package/@patternfly/react-topology).

**Pan and zoom** functionality provides users with additional methods of navigating in a Topology view.

## Using pan and zoom

To allow users to pan and zoom in a Topology view, use the `withPanZoom` utility when you return the graph component in the `ComponentFactory`
  - For example: `withPanZoom(GraphComponent)`

The component should accept a `panZoomRef` property, which should be the ref on the surface element for the group. This is the element that will accept the drag or mouse-wheel events.

Alternatively, you can use the `usePanZoom` hook within the component to retrieve the `panZoomRef` property. If you are using the provided `GraphComponent`, this property is accepted and will be handled appropriately.

### Example

```ts file='./TopologyPanZoomDemo.tsx'
```
