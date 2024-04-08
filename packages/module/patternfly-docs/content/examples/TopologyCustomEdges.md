---
id: Custom edges
section: topology
sortValue: 12
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologyCustomEdgesDemo.tsx
propComponents: ['DefaultEdge']
---

import {
  ColaLayout,
  CREATE_CONNECTOR_DROP_TYPE,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeAnimationSpeed,
  EdgeStyle,
  EdgeTerminalType,
  GraphComponent,
  LabelPosition,
  ModelKind,
  nodeDragSourceSpec,
  nodeDropTargetSpec,
  NodeShape,
  SELECTION_EVENT,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withDndDrop,
  withDragNode,
  withSelection
} from '@patternfly/react-topology';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';

import './topology-example.css';

# Introduction

**Note:** Topology lives in its own package at [`@patternfly/react-topology`](https://www.npmjs.com/package/@patternfly/react-topology).

An **edge** is a node connector, typically represented by an arrow.

## Edge styles

To customize the style of edges in a Topology view, you can use the following `<EdgeModel>` properties:
- **`edgeStyle`:** Choose from the `EdgeStyle` enumeration, providing "solid", "dashed", or "dotted".
- **`animationSpeed`:** Choose from the `<EdgeAnimationSpeed>` enumeration, providing various speeds.

## Using custom edges

You can further customize your edges by creating a custom edge component. In your custom component, you can specify a variety of parameters to pass to `<DefaultEdge>`, or you can create an SVG element that will be used to depict edges.

### Example

```ts file='./TopologyCustomEdgesDemo.tsx'
```
