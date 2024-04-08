---
id: Pipelines
section: topology
sortValue: 71
sourceLink: https://github.com/patternfly/react-topology/blob/main/packages/module/patternfly-docs/content/examples/TopologyPipelinesGettingStartedDemo.tsx
propComponents: ['TaskNode', 'TaskEdge', 'WhenDecorator']
functions: { 'packages/module/src/pipelines/utils/utils.ts': ['getSpacerNodes', 'getEdgesFromNodes'] }
---

import {
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  useVisualizationController,
  DefaultTaskGroup,
  GraphComponent,
  ModelKind,
  SpacerNode,
  TaskEdge,
  FinallyNode,
  DEFAULT_FINALLY_NODE_TYPE,
  DEFAULT_TASK_NODE_TYPE,
  DEFAULT_EDGE_TYPE,
  DEFAULT_SPACER_NODE_TYPE,
  DEFAULT_WHEN_OFFSET,
  TaskNode,
  WhenDecorator,
  RunStatus,
  getEdgesFromNodes,
  getSpacerNodes,
  PipelineDagreLayout
} from '@patternfly/react-topology';

import './topology-pipelines-example.css';

# Introduction

**Note:** Topology lives in its own package at [`@patternfly/react-topology`](https://www.npmjs.com/package/@patternfly/react-topology).

A **pipeline** displays a series of connected tasks, shown in the order that they occur.

## Using pipelines

To create a pipeline:

1. Create a new controller, using the default `Visualization` class.
      - It is important to note that 3 `register` methods are accessed by the controller.

    The following 2 must be declared explicitly:

      - `registerLayoutFactory`: Sets the layout of your Topology view. For pipelines, this should use the `PipelineDagreLayout` layout, or an extension of it.
      - `registerComponentFactory`: Lets you customize Topology view elements, such as nodes, groups, and edges.
        - Nodes and edges should use a `PipelineNodeModel`, which adds the model field `runAfterTasks`.

    The remaining method is initialized in `Visualization.ts`. It is optional and only needs to be declared if you support a custom implementation that modifies the types.

      - `registerElementFactory`: Sets the types of the elements being used, such as graphs, nodes, edges.
        - `defaultElementFactory` uses types from `ModelKind` and is exported in `index.ts`.

1. Set the task nodes and their relationships using the `runAfterTasks` field.

1. Use the `getSpacerNodes` function to determine the necessary spacer nodes. Spacer nodes are used to aggregate edges to and from multiple task nodes.

1. Determine the edges in your model by calling the `getEdgesFromNodes` function, passing in all nodes, including spacer nodes.

1. Call the `fromModel` method, passing along all nodes and determined edges. 
   - Your data model should include a `graph` object, on which you will need to set `id` , `type`, and `layout`.

1. To create your Topology view component, add a `VisualizationProvider`, which is a useful context provider that enables access to your controller. It is required when using the `VisualizationSurface` component.

1. Use `VisualizationSurface` to provide the SVG component required for the Topology components. `VisualizationSurface` can take a "state" parameter, which will allow you to pass your state settings to the controller.

### Example

```ts file='./TopologyPipelinesGettingStartedDemo.tsx'
```

## Functions
### getSpacerNodes
```noLive
/**
 * parameters:
 *   nodes: PipelineNodeModel[] - List of task and finally nodes in the model
 *   spacerNodeType: string     - Type to use for Spacer nodes
 *   finallyNodeTypes: string[] - Types to consider as finally nodes on incoming nodes
 *
 * Returns:
 *   PipelineNodeModel[]: a list of spacer nodes required to layout the pipeline view
 **/
 
const getSpacerNodes = (
  nodes: PipelineNodeModel[],
  spacerNodeType = DEFAULT_SPACER_NODE_TYPE,
  finallyNodeTypes: string[] = [DEFAULT_FINALLY_NODE_TYPE]
): PipelineNodeModel[]
```

### getEdgesFromNodes
```noLive
/**
 * parameters:
 *   nodes: PipelineNodeModel[] - List of all nodes in the model
 *   spacerNodeType: string     - Type set on spacer nodes
 *   edgeType:                  - Type to set on created edges
 *   spacerEdgeType:            - Type to set on edges between spacer nodes
 *   finallyNodeTypes: string[] - Types to consider as finally nodes on incoming nodes
 *   finallyEdgeType: string[]  - Type to set on edges to finally nodes
 *
 * Returns:
 *   EdgeModel[]: a list edges required to layout the pipeline view
 **/
const getEdgesFromNodes = (
  nodes: PipelineNodeModel[],
  spacerNodeType = DEFAULT_SPACER_NODE_TYPE,
  edgeType = DEFAULT_EDGE_TYPE,
  spacerEdgeType = DEFAULT_EDGE_TYPE,
  finallyNodeTypes: string[] = [DEFAULT_FINALLY_NODE_TYPE],
  finallyEdgeType = DEFAULT_EDGE_TYPE
): EdgeModel[]
```

