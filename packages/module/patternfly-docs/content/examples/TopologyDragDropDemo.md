---
id: Drag and drop
section: topology
sortValue: 24
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologyDragDropDemo.tsx
propComponents: ['DefaultNode', 'DefaultEdge', 'withDndDrop']
---

import {
ColaLayout,
DefaultEdge,
DefaultGroup,
DefaultNode,
EdgeStyle,
GraphComponent,
graphDropTargetSpec,
groupDropTargetSpec,
ModelKind,
nodeDragSourceSpec,
nodeDropTargetSpec,
NodeShape,
NodeStatus,
SELECTION_EVENT,
Visualization,
VisualizationProvider,
VisualizationSurface,
withDndDrop,
withDragNode,
withPanZoom,
withSelection,
withTargetDrag,
} from '@patternfly/react-topology';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';

import './topology-example.css';

# Introduction

**Note:** Topology lives in its own package at [`@patternfly/react-topology`](https://www.npmjs.com/package/@patternfly/react-topology).

**Drag and drop** functionality allows users to move Topology view elements as needed.

## Drag and drop

To add drag and drop functionality to your Topology view, add the following in your `ComponentFactory`:

- Nodes can be dragged about the canvas by using the `useDragNode` hook, or by wrapping the `<Node>` component with `withDragNode`.

  - These utilities will provide a `dragNodeRef`, which should be added to the outer element of the node, where users can click and drag.
  - `DefaultNode` accepts `dragNodeRef` and adds it appropriately.

- Edges can be dragged in order to change the source and/or target of the edge by using either `withSourceDrag` and/or `withTargetDrag`.
  - These utilities will provide a `sourceDragRef` and a `targetDragRef`, which should be added to the respective terminals for the edge.
  - `DefaultEdge` accepts these utilities and adds them to the appropriate terminals.

### Example

```ts file='./TopologyDragDropDemo.tsx'
```

### Functions

#### withDragNode

```noLive
/**
 * Parameters:
 *  spec: The drag source spec
 * Returns:
 *  function that takes the draggable node component and returns the draggable component
 *  which is also passed 'dragNodeRef' to attach to the element.
 **/
export const withDragNode = (spec?: DragSourceSpec) => 
  (wrappedComponent: React.FunctionComponent) =>  React.ComponentType);
```

#### withSourceDrag

```noLive
/**
 * Parameters:
 *  spec: The drag source spec
 * Returns:
 *  function that takes the draggable edge component and returns the draggable component
 *  which is also passed 'sourceDragRef' to attach to the element.
 **/
export const withSourceDrag = (spec: DragSourceSpec) =>
  (wrappedComponent: React.FunctionComponent) =>  React.ComponentType);

```

#### withTargetDrag

```noLive
/**
 * Parameters:
 *  spec: The drag source spec
 * Returns:
 *  function that takes the draggable edge component and returns the draggable component
 *  which is also passed 'targetDragRef' to attach to the element.
 **/
export const withTargetDrag = (spec: DragSourceSpec) =>
  (wrappedComponent: React.FunctionComponent) =>  React.ComponentType);
```

#### withDndDrop

```noLive
/**
 * Parameters:
 *  spec: The drop target spec
 * Returns:
 *  function that takes the droppable component and returns the droppable component
 *  which is also passed 'dndDropRef' to attach to the element's drop zone.
 **/
 export const withDndDrop = (spec: DropTargetSpec) =>
  (wrappedComponent: React.FunctionComponent) =>  React.ComponentType);
```
