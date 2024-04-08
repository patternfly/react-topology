---
id: Anchors
section: topology
sortValue: 13
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologyAnchorsDemo.tsx
---

import {
  AbstractAnchor,
  AnchorEnd,
  ColaLayout,
  DefaultEdge,
  DefaultNode,
  GraphComponent,
  Layer,
  ModelKind,
  NodeShape,
  Point,
  useAnchor,
  useSvgAnchor,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withDragNode,
} from '@patternfly/react-topology';

import './topology-example.css';

# Introduction

**Note:** Topology lives in its own package at [`@patternfly/react-topology`](https://www.npmjs.com/package/@patternfly/react-topology).

An **anchor** is the point at which an edge connects to a node.

By default, nodes use a `CenterAnchor`, which refers to the center of the bounds of the node. You can use different anchors for different node shapes.

## Using custom anchors

You can customize the start and end points for a node edge by specifying the anchors.

You can specify the SVG element that determines edge locations by using the provided hooks: 
- **`usePolygonAnchor`**
- **`useSvgAnchor`**
- **`useAnchor`:** Allows you to specify your own custom anchor or provide a function that returns a specific anchor.
  - This is useful for adjusting the anchor based on the node being displayed.

These hooks accept the following parameters, allowing you to customize the anchor:

- **`points` (for `usePolygonAnchor` only):** The points for the polygon.
- **`AnchorEnd`:** Use for start, end, or both.
- **`type` (optional):** Which edge types to use the anchor for.

A custom anchor must extend the `AbstractAnchor` class. There are 2 methods used for anchors:

- **`getLocation(reference: Point): Point`:** Return the location of the anchor, based on the incoming reference point. Default anchors use the point on the node border closest to the reference point.
- **`getReferencePoint(): Point`:** Return the location where outgoing edges initiate from.

### Example

```ts file="./TopologyAnchorsDemo.tsx"
```
