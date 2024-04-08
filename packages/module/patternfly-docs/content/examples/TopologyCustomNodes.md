---
id: Custom nodes
section: topology
sortValue: 11
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologyCustomNodesDemo.tsx
propComponents: ['DefaultNode', 'DefaultEdge', 'DefaultGroup']
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
  VisualizationSurface
} from '@patternfly/react-topology';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';

import './topology-example.css';

# Introduction

**Note:** Topology lives in its own package at [`@patternfly/react-topology`](https://www.npmjs.com/package/@patternfly/react-topology).

A **node** is an element within a Topology view that represents your data point, including processes or services.

## Using custom nodes

To create nodes with custom styling, you will need to create a custom node component, which your `customComponentFactory` will return.

To do this, you will need a `<CustomNode>` component, with `CustomNodeProps` as the generic type and the destructured `element` as the parameter. The code in the following example shows how you can retrieve data from `element` and apply it to the attributes of `<DefaultNode>`.

Within each node in your `NODES` array, you can set `data` to include additional custom attributes.

### Example

```ts file='./TopologyCustomNodesDemo.tsx'
```
