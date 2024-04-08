---
id: Control bar
section: topology
sortValue: 31
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologyControlBarDemo.tsx
propComponents: ['TopologyControlBar', 'TopologyView']

---

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

# Introduction

**Note:** Topology lives in its own package at [`@patternfly/react-topology`](https://www.npmjs.com/package/@patternfly/react-topology).

A **control bar** adds visualization controls to a Topology view, so that users can more easily explore the graph layout.

## Using a control bar

To add a control bar to the Topology view:

1. Wrap your `VisualizationProvider` with the `<TopologyView>` component, which accepts `controlBar` as a property.

1. Pass the `<TopologyControlBar>` component to the `controlBar` property, and pass the `controlButtons` property into `<TopologyControlBar>`.

1. Call the `createTopologyControlButtons` function, which will create  common control buttons via several parameters:

  To render the default control buttons, pass in `defaultControlButtonsOptions`, which includes:
     - Zoom In.
     - Zoom Out.
     - Fit to Screen.
     - Reset View.
     - Legend.

  You can override these defaults by passing in any of the `defaultControlButtonsOptions` as a parameter, with your updated boolean value to replace the default option.

  For each control button, pass in each of the following action callback methods as a parameter:

    - **`zoomInCallback`:** Handle clicks on the Zoom In button. For example:
        ```noLive
          action(() => {
            // Zoom in by desired amount
            controller.getGraph().scaleBy(4 / 3);
          })
        ```
    - **`zoomOutCallback`:** Handle clicks on the Zoom Out button. For example:
        ```noLive
          action(() => {
            // Zoom in out desired amount
            controller.getGraph().scaleBy(0.75);
          })
        ```
    - **`fitToScreenCallback`:** Handle clicks on the Fit to Screen button. For example:
      ```noLive
        action(() => {
          // Note: The default BaseGraph's fit implementation will not scale to greater
          // than 1 so it will not zoom in to enlarge the graph to take up the entire
          // viewable area.

          // Fit entire graph in the viewable area with an 80px margin
          controller.getGraph().fit(80);
        })
      ```
    - **`resetViewCallback`:** Handle clicks on the Reset View button. For example:
      ```noLive
        action(() => {
          // BaseGraph's reset implementation will scale back to 1, and re-center
          // the graph
          controller.getGraph().reset();

          // re-run the layout
          controller.getGraph().layout();
        })
      ```
    - **`legendCallback`:** Handle clicks on the Legend. For example:
      ```noLive
        action(() => {
          // application specific code to show a legend (no default support)
        })
      ```

### Example

```ts file="./TopologyControlBarDemo.tsx"
```
