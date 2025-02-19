# PatternFly Topology

This package provides the resources necessary to use PatternFly Topology, an open source utility that you can use to create a visual representation of all the applications within your project, their build status, and the components and services associated with them.

Topology utilizes some of PatternFly's React components https://github.com/patternfly/patternfly-react.

Documentation for Topology and its features is available on [the PatternFly website.](www.patternfly.org/topology/about-topology)

## Table of contents

- [PatternFly Topology](#patternfly-topology)
  - [Table of contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installing Topology](#installing-topology)
  - [Initial setup and usage](#initial-setup-and-usage)
  - [Example](#example)
  - [Demo app](#demo-app)
  - [Need help?](#need-help)

## Prerequisites

To use Topology, you will need to have both [Node Active LTS](https://github.com/nodejs/Release#release-schedule) and [Yarn](https://yarnpkg.com/) installed.

1. Install and develop with the most up-to-date version of Node Active LTS. For example, to develop with Node 8, you would use the following commands:

   ```
   nvm install 8
   nvm use 8
   ```

1. Install and use version 1.6.0 or later of Yarn.

## Installing Topology

Once you have all of the prerequisites, you can install the Topology package with Yarn or npm:

1. Using Yarn:

   ```
   yarn add @patternfly/react-topology
   ```

1. Using npm:

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
   - Adding state to `<VisualizationSurface>` allows hooks to update when state changes.
   - State can also be used to keep track of your graph state, such as selected elements.

1. Wrap your `TopologyView` with your controller. In the example below, this is done via the `VisualizationProvider` which consumes the `Controller` via context.

1. There are 3 `register` methods that the controller accesses.

   These 2 must be declared explicitly:

   1. **`registerLayoutFactory`:** Sets the layout of your topology view (e.g. Force, Dagre, Cola, etc.). You can use `defaultLayoutFactory` as a parameter if your application supports all layouts. You can also update `defaultLayout` to a custom implementation if you only want to support a subset of the available layout options.
   1. **`registerComponentFactory`:** Lets you customize the components in your topology view (e.g. nodes, groups, and edges). You can use `defaultComponentFactory` as a parameter.

   The remaining method is initialized in `Visualization.ts`, so it doesn't need to be declared unless you want to support a custom implementation that modifies the types:

   3. **`registerElementFactory`:** Sets the types of the elements being used (e.g. graphs, nodes, edges). `defaultElementFactory` uses types from `ModelKind` and is exported in `index.ts`.

## Example

```ts
import * as React from 'react';
import {
  EdgeStyle,
  Model,
  NodeShape,
  SELECTION_EVENT,
  Visualization,
  VisualizationProvider,
  VisualizationSurface
} from '@patternfly/react-topology';
import defaultLayoutFactory from './layouts/defaultLayoutFactory';
import defaultComponentFactory from './components/defaultComponentFactory';

const NODE_SHAPE = NodeShape.ellipse;
const NODE_DIAMETER = 75;

const NODES = [
  {
    id: 'node-0',
    type: 'node',
    label: 'Node 0',
    width: NODE_DIAMETER,
    height: NODE_DIAMETER,
    shape: NODE_SHAPE
  },
  {
    id: 'node-1',
    type: 'node',
    label: 'Node 1',
    width: NODE_DIAMETER,
    height: NODE_DIAMETER,
    shape: NODE_SHAPE
  },
  {
    id: 'node-2',
    type: 'node',
    label: 'Node 2',
    width: NODE_DIAMETER,
    height: NODE_DIAMETER,
    shape: NODE_SHAPE
  },
  {
    id: 'node-3',
    type: 'node',
    label: 'Node 3',
    width: NODE_DIAMETER,
    height: NODE_DIAMETER,
    shape: NODE_SHAPE
  },
  {
    id: 'node-4',
    type: 'node',
    label: 'Node 4',
    width: NODE_DIAMETER,
    height: NODE_DIAMETER,
    shape: NODE_SHAPE
  },
  {
    id: 'node-5',
    type: 'node',
    label: 'Node 5',
    width: NODE_DIAMETER,
    height: NODE_DIAMETER,
    shape: NODE_SHAPE
  },
  {
    id: 'Group-1',
    children: ['node-0', 'node-1', 'node-2', 'node-3'],
    type: 'group-hull',
    group: true,
    label: 'Group-1',
    style: {
      padding: 15
    }
  }
];

const EDGES = [
  {
    id: 'edge-node-4-node-5',
    type: 'edge',
    source: 'node-4',
    target: 'node-5',
    edgeStyle: EdgeStyle.default
  },
  {
    id: 'edge-node-0-node-2',
    type: 'edge',
    source: 'node-0',
    target: 'node-2',
    edgeStyle: EdgeStyle.default
  }
];

export const TopologyBaselineDemo = React.memo(() => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const controller = React.useMemo(() => {
    const model: Model = {
      nodes: NODES,
      edges: EDGES,
      graph: {
        id: 'g1',
        type: 'graph',
        layout: 'Cola'
      }
    };

    const newController = new Visualization();
    newController.registerLayoutFactory(defaultLayoutFactory);
    newController.registerComponentFactory(defaultComponentFactory);

    newController.addEventListener(SELECTION_EVENT, setSelectedIds);

    newController.fromModel(model, false);

    return newController;
  }, []);

  return (
    <VisualizationProvider controller={controller}>
      <VisualizationSurface state={{ selectedIds }} />
    </VisualizationProvider>
  );
});
```

## Demo app

To help you better understand and visualize the different Topology components, we have created an interactive demo, [which is contained here.](https://github.com/patternfly/react-topology/tree/main/packages/demo-app-ts)

See the instructions to install and run the demo app, here: [Demo README.md](packages/demo-app-ts/README.md)

## Need help?

If you find a bug, have a request, or have any questions about Topology that aren't answered in our documentation, please [reach out to us on Slack.](https://patternfly.slack.com/archives/CK7URGJ2W)
