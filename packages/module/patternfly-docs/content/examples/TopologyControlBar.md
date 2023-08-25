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

2. For each button, pass in each action callback method as parameter:

   - zoomInCallback: Handle the click on the zoom in button. Eg:
       ```noLive
         action(() => {
           // Zoom in by desired amount
           controller.getGraph().scaleBy(4 / 3);
         })
        ```
   - zoomOutCallback: Handle the click on the zoom out button. Eg:
       ```noLive
         action(() => {
           // Zoom in out desired amount
           controller.getGraph().scaleBy(0.75);
         })
        ```
    - fitToScreenCallback: Handle click on fit to screen button. Eg:
       ```noLive
         action(() => {
           // Note: The default BaseGraph's fit implementation will not scale to greater
           // than 1 so it will not zoom in to enlarge the graph to take up the entire
           // viewable area.

           // Fit entire graph in the viewable area with an 80px margin
           controller.getGraph().fit(80);
         })
        ```
    - resetViewCallback: Handle the click on the reset view button. Eg:
       ```noLive
         action(() => {
           // BaseGraph's reset implementation will scale back to 1, and re-center
           // the graph
           controller.getGraph().reset();

          // re-run the layout
           controller.getGraph().layout();
         })
        ```
    - legendCallback: Handle the click on the legend. Eg:
       ```noLive
         action(() => {
           // application specific code to show a legend (no default support)
         })
       ```

```ts file="./TopologyControlBarDemo.tsx"
```
