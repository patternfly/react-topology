---
id: About Topology
section: topology
sortValue: 1
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologyGettingStartedDemo.tsx
propComponents: ['VisualizationProvider', 'VisualizationSurface']
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

PatternFly's **Topology** is an open source utility built off of [@patternfly/react-core](https://www.npmjs.com/package/@patternfly/react-core) that you can use to create a visual representation of all the applications within your project, their build status, and the components and services associated with them. Creating these visuals can help document and communicate the intricacies of the processes behind your product.

To create a Topology view for your product, you can create a simple layout of nodes, which represents your data points, and connecting edges, which represent the relationships between nodes. Beyond this basis, you can continue to customize and enhance your Topology view to fit the specific needs of your product.

## Prerequisites

To use Topology, you will need to have both [Node Active LTS](https://github.com/nodejs/Release#release-schedule) and [Yarn](https://yarnpkg.com/) installed.

1. Install and develop with the most up-to-date version of Node Active LTS. For example, to develop with Node 8, you would use the following commands:

    ```
    nvm install 8
    nvm use 8
    ```
2. Install and use version 1.6.0 or later of Yarn.

## Installing Topology

Once you have all of the prequisites, you can install the Topology package with Yarn or npm:

1. Using Yarn:
   
    ```
    yarn add @patternfly/react-topology
    ```
2. Using npm:
   
    ```
    npm install @patternfly/react-topology --save
    ```

## Initial setup and usage

To use Topology out of the box, follow these steps: 

1. First transform your back-end data into a [Model](https://github.com/patternfly/react-topology/blob/main/packages/module/src/types.ts) object. This will contain the information needed to display the nodes and edges in your Topology view. Each node and edge contains a set of properties used by Topology, as well as a data field, which Topology can be used to customize the nodes and edges.

1. Declare a controller, which can be initialized via the `useVisualizationController()` method.

1. Create nodes by calling the `fromModel` method on the controller you initialized. `fromModel` will take the `Model` that you created as a parameter. Your data model should include a `graph` object, on which you will need to set `id` , `type`, and `layout`.

1. To create your Topology view component, wrap `TopologyView` around `<VisualizationSurface>`, which can accept a `state` parameter.
    - The value of state is application specific and should include any data the application wants to store/retrieve from the controller.
    - Adding state to  `<VisualizationSurface>` allows hooks to update when state changes.
    - State cam also be used to keep track of your graph state, such as selected elements.

1. Wrap your `TopologyView` with your controller. In the example below, this is done via the `VisualizationProvider` which consumes the `Controller` via context.

1. There are 3 `register` methods that the controller accesses.

    These 2 must be declared explicitly:

    1. **`registerLayoutFactory`:** Sets the layout of your topology view (e.g. Force, Dagre, Cola, etc.). You can use `defaultLayoutFactory` as a parameter if your application supports all layouts. You can also update `defaultLayout` to a custom implementation if you only want to support a subset of the available layout options.
    1. **`registerComponentFactory`:** Lets you customize the components in your topology view (e.g. nodes, groups, and edges). You can use `defaultComponentFactory` as a parameter.
    
    The remaining method is initialized in `Visualization.ts`, so it doesn't need to be declared unless you want to support a custom implementation that modifies the types:

    3. **`registerElementFactory`:** Sets the types of the elements being used (e.g. graphs, nodes, edges). `defaultElementFactory` uses types from `ModelKind` and is exported in `index.ts`.

1. Create nodes by calling the `fromModel` method on the controller. `fromModel` will take your data model as a parameter. Your data model should include a `graph` object, on which you will need to set `id` , `type`, and `layout`.

1. To create your topology view component, add a `<VisualizationProvider>`, which is a useful context provider. It allows access to the created controller and is required when using the `<VisualizationSurface>` component.

1. Use `<VisualizationSurface>` to provide the SVG component required for your topology components. `<VisualizationSurface>` can take a state parameter, which enables you to pass your state settings to the controller.

## Demo app

To help you better understand and visualize the different Topology components, we have created an interactive demo, [which is contained in the react-topology repository.](https://github.com/patternfly/react-topology/tree/main/packages/demo-app-ts)

You can run the demo app [by following these instructions.](https://github.com/patternfly/react-topology?tab=readme-ov-file#demo-app)

### Example

```ts file='./TopologyGettingStartedDemo.tsx'
```
