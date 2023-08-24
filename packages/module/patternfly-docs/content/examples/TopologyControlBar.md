---
id: Control Bar
section: topology
sortValue: 31
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologyControlBarDemo.tsx
propComponents: ['TopologyControlBar', 'TopologyView']

---

Note: Topology lives in its own package at [`@patternfly/react-topology`](https://www.npmjs.com/package/@patternfly/react-topology)

import {
  action,
  ColaLayout,
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  DefaultEdge,
  DefaultGroup,
  DefaultNode,
  EdgeStyle,
  GraphComponent,
  ModelKind,
  NodeShape,
  SELECTION_EVENT,
  TopologyControlBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withPanZoom,
  withSelection
  } from '@patternfly/react-topology';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';

import './topology-example.css';

### Topology with a control bar

To add a control bar to the topology view, wrap your `VisualizationProvider` with the `TopologyView` component, which accepts `controlBar` as a prop.

Pass the `TopologyControlBar` component to the `controlBar` prop, and pass the `controlButtons` prop into `TopologyControlBar`. Then call the function `createTopologyControlButtons`, which will create the common control buttons via several parameters listed below:

1. To render the default control buttons, pass in `defaultControlButtonsOptions`. These default options include:
     - Zoom In
     - Zoom Out
     - Fit to Screen
     - Reset View
     - Legend

    You can override these defaults by passing in any of the `defaultControlButtonsOptions` as a parameter, with your updated boolean value of the default option.

2. For each button, pass in each action callback method as parameter.

```ts file="./TopologyControlBarDemo.tsx"
```

## Action callback methods

### zoomInCallback

```noLive
/**
 * Parameters:
 *  scale: The interview by which to scale up the topology view
 * Returns:
 *  function that zooms in the topology view by the provided scale value.
 *  Scale changes are not saved on reload.
 **/
zoomInCallback: action(() => {
  controller.getGraph().scaleBy(4 / 3);
})
```

### zoomOutCallback

```noLive
/**
 * Parameters:
 *  scale: The interview by which to scale down the topology view
 * Returns:
 *  function that zooms out the topology view by the provided scale value.
 *  Scale changes are not saved on reload.
 **/
zoomOutCallback: action(() => {
  controller.getGraph().scaleBy(0.75);
}),
```

### fitToScreenCallback

```noLive
/**
 * Parameters:
 *  padding: The padding to give the topology view such that it fits the screen and shows all the nodes
 * Returns:
 *  function that fits the topology view to the screen. Scale changes are not saved on reload.
 *  Fit to screen will not scale up higher than the current scale or 1, whichever is greater.
 *  Therefore it does not zoom in.
 **/
fitToScreenCallback: action(() => {
  controller.getGraph().fit(80);
}),
```

### resetViewCallback

```noLive
/**
 * Returns:
 *  function that resets the topology view to its initial placement on load.
 **/
resetViewCallback: action(() => {
  controller.getGraph().reset();
  controller.getGraph().layout();
}),
```
