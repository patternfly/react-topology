---
id: Context menu
section: topology
sortValue: 23
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologyContextMenuDemo.tsx
---

import {
  ColaLayout,
  ContextMenuItem,
  ContextMenuSeparator,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeStyle,
  GraphComponent,
  ModelKind,
  NodeShape,
  SELECTION_EVENT,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withContextMenu
} from '@patternfly/react-topology';

import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import './topology-example.css';

# Introduction

**Note:** Topology lives in its own package at [`@patternfly/react-topology`](https://www.npmjs.com/package/@patternfly/react-topology).

A **context menu** displays a list of actions or links related to a graph element. Nodes, edges, and the graph itself can have context menus, which are shown when you select the menu toggle or right-click on a graph element. Selecting a menu item will trigger a process or navigate to a new location.  

## Using context menus

To add a context menu to a Topology element, you can simply extend `WithContextMenuProps` and use the `withContextMenu` utility when the context menu component is returned in the `componentFactory`. For example, `withContextMenu(() => contextMenu)(MyCustomNode)`. The component should accept 2 parameters: 

- **`onContextMenu`:** The function to call upon node selection. Typically the outer container for the component would call `onContextMenu` when clicked.
- **`contextMenuOpen`:** Indicates if the menu is currently open and applies styling to the respective component.

If you are using `DefaultNode`, these properties can be passed along and will be handled appropriately.


### Example 

```ts file='./TopologyContextMenuDemo.tsx'
```
