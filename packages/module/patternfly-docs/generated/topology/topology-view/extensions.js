import React from 'react';
import { AutoLinkHeader, Example, Link as PatternflyThemeLink } from '@patternfly/documentation-framework/components';
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
NodeShape,
NodeStatus,
nodeDragSourceSpec,
nodeDropTargetSpec,
SELECTION_EVENT,
Visualization,
VisualizationProvider,
VisualizationSurface,
withDndDrop,
withDragNode,
withSelection,
withPanZoom
} from '@patternfly/react-topology';
import '../../../content/examples/./topology-example.css';
import Icon1 from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import Icon2 from '@patternfly/react-icons/dist/esm/icons/folder-open-icon';
const pageData = {
  "id": "Topology view",
  "section": "topology",
  "subsection": "",
  "source": "extensions",
  "tabName": null,
  "slug": "/topology/topology-view/extensions",
  "sourceLink": "https://github.com/patternfly/patternfly-org/blob/main/packages/module/patternfly-docs/content/examples/Topology.md",
  "relPath": "packages/module/patternfly-docs/content/examples/Topology.md",
  "examples": [
    "Baseline Topology",
    "Custom Nodes",
    "Custom Edges",
    "Pan/Zoom",
    "Selectable Topology"
  ]
};
pageData.liveContext = {
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
  NodeShape,
  NodeStatus,
  nodeDragSourceSpec,
  nodeDropTargetSpec,
  SELECTION_EVENT,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withDndDrop,
  withDragNode,
  withSelection,
  withPanZoom,
  Icon1,
  Icon2
};
pageData.relativeImports = {
  
};
pageData.examples = {
  'Baseline Topology': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\nimport {\n  ColaLayout,\n  ComponentFactory,\n  DefaultEdge,\n  DefaultGroup,\n  DefaultNode,\n  EdgeStyle,\n  Graph,\n  GraphComponent,\n  Layout,\n  LayoutFactory,\n  Model,\n  ModelKind,\n  NodeShape,\n  SELECTION_EVENT,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface\n} from '@patternfly/react-topology';\n\nconst baselineLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {\n  switch (type) {\n    case 'Cola':\n      return new ColaLayout(graph);\n    default:\n      return new ColaLayout(graph, { layoutOnDrag: false });\n  }\n};\n\nconst baselineComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {\n  switch (type) {\n    case 'group':\n      return DefaultGroup;\n    default:\n      switch (kind) {\n        case ModelKind.graph:\n          return GraphComponent;\n        case ModelKind.node:\n          return DefaultNode;\n        case ModelKind.edge:\n          return DefaultEdge;\n        default:\n          return undefined;\n      }\n  }\n};\n\nconst NODE_SHAPE = NodeShape.ellipse;\nconst NODE_DIAMETER = 75;\n\nconst NODES = [\n  {\n    id: 'node-0',\n    type: 'node',\n    label: 'Node 0',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE\n  },\n  {\n    id: 'node-1',\n    type: 'node',\n    label: 'Node 1',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE\n  },\n  {\n    id: 'node-2',\n    type: 'node',\n    label: 'Node 2',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE\n  },\n  {\n    id: 'node-3',\n    type: 'node',\n    label: 'Node 3',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE\n  },\n  {\n    id: 'node-4',\n    type: 'node',\n    label: 'Node 4',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE\n  },\n  {\n    id: 'node-5',\n    type: 'node',\n    label: 'Node 5',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NODE_SHAPE\n  },\n  {\n    id: 'Group-1',\n    children: ['node-0', 'node-1', 'node-2'],\n    type: 'group',\n    group: true,\n    label: 'Group-1',\n    style: {\n      padding: 40\n    }\n  }\n];\n\nconst EDGES = [\n  {\n    id: 'edge-node-4-node-5',\n    type: 'edge',\n    source: 'node-4',\n    target: 'node-5',\n    edgeStyle: EdgeStyle.default\n  },\n  {\n    id: 'edge-node-0-node-2',\n    type: 'edge',\n    source: 'node-0',\n    target: 'node-2',\n    edgeStyle: EdgeStyle.default\n  }\n];\n\nexport const TopologyBaselineDemo: React.FC = () => {\n  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);\n\n  const controller = React.useMemo(() => {\n    const model: Model = {\n      nodes: NODES,\n      edges: EDGES,\n      graph: {\n        id: 'g1',\n        type: 'graph',\n        layout: 'Cola'\n      }\n    };\n\n    const newController = new Visualization();\n    newController.registerLayoutFactory(baselineLayoutFactory);\n    newController.registerComponentFactory(baselineComponentFactory);\n\n    newController.addEventListener(SELECTION_EVENT, setSelectedIds);\n\n    newController.fromModel(model, false);\n\n    return newController;\n  }, []);\n\n  return (\n    <VisualizationProvider controller={controller}>\n      <VisualizationSurface state={{ selectedIds }} />\n    </VisualizationProvider>\n  );\n};\n","title":"Baseline Topology","lang":"ts"}}>
      
      <ol {...{"className":"ws-ol"}}>
        

        
        <li {...{"className":"ws-li"}}>
          

          
          <p {...{"className":"ws-p"}}>
            {`Create a new Controller which can be done using the default `}
            
            <code {...{"className":"ws-code"}}>
              {`Visualization`}
            </code>
            {` class.`}
          </p>
          

          
          <p {...{"className":"ws-p"}}>
            {`It is important to note that three `}
            
            <code {...{"className":"ws-code"}}>
              {`register`}
            </code>
            {` methods are accessed by the controller.`}
          </p>
          

          
          <p {...{"className":"ws-p"}}>
            {`The following two must be declared explicitly:`}
          </p>
          

          
          <ul {...{"className":"ws-ul"}}>
            

            
            <li {...{"className":"ws-li"}}>
              

              
              <p {...{"className":"ws-p"}}>
                
                <code {...{"className":"ws-code"}}>
                  {`registerLayoutFactory`}
                </code>
                {`: This method sets the layout of your topology view (e.g. Force, Dagre, Cola, etc.). If your application supports all layouts, use `}
                
                <code {...{"className":"ws-code"}}>
                  {`defaultLayoutFactory`}
                </code>
                {` as a parameter. If you only want to support a subset of the available layout options, update `}
                
                <code {...{"className":"ws-code"}}>
                  {`defaultLayout`}
                </code>
                {` to a custom implementation .`}
              </p>
              

            </li>
            

            
            <li {...{"className":"ws-li"}}>
              

              
              <p {...{"className":"ws-p"}}>
                
                <code {...{"className":"ws-code"}}>
                  {`registerComponentFactory`}
                </code>
                {`: This method lets you customize the components in your topology view (e.g. nodes, groups, and edges). You can use `}
                
                <code {...{"className":"ws-code"}}>
                  {`defaultComponentFactory`}
                </code>
                {` as a parameter.`}
              </p>
              

            </li>
            

          </ul>
          

          
          <p {...{"className":"ws-p"}}>
            {`The register method below is initialized in `}
            
            <code {...{"className":"ws-code"}}>
              {`Visualization.ts`}
            </code>
            {`. It doesn't need to be declared unless you support a custom implementation which modifies the types.`}
          </p>
          

          
          <ul {...{"className":"ws-ul"}}>
            

            
            <li {...{"className":"ws-li"}}>
              
              <code {...{"className":"ws-code"}}>
                {`registerElementFactory`}
              </code>
              {`: This method sets the types of the elements being used (e.g. graphs, nodes, edges). `}
              
              <code {...{"className":"ws-code"}}>
                {`defaultElementFactory`}
              </code>
              {` uses types from `}
              
              <code {...{"className":"ws-code"}}>
                {`ModelKind`}
              </code>
              {` and is exported in `}
              
              <code {...{"className":"ws-code"}}>
                {`index.ts`}
              </code>
              {`.`}
            </li>
            

          </ul>
          

        </li>
        

      </ol>
      
      <ol {...{"start":2,"className":"ws-ol"}}>
        

        
        <li {...{"className":"ws-li"}}>
          

          
          <p {...{"className":"ws-p"}}>
            {`The `}
            
            <code {...{"className":"ws-code"}}>
              {`fromModel`}
            </code>
            {` method must be called on the controller to create the nodes. `}
            
            <code {...{"className":"ws-code"}}>
              {`fromModel`}
            </code>
            {` will take your data model as a parameter. Your data model should include a `}
            
            <code {...{"className":"ws-code"}}>
              {`graph`}
            </code>
            {` object, on which you will need to set `}
            
            <code {...{"className":"ws-code"}}>
              {`id`}
            </code>
            {` , `}
            
            <code {...{"className":"ws-code"}}>
              {`type`}
            </code>
            {` and `}
            
            <code {...{"className":"ws-code"}}>
              {`layout`}
            </code>
            {`.`}
          </p>
          

        </li>
        

        
        <li {...{"className":"ws-li"}}>
          

          
          <p {...{"className":"ws-p"}}>
            {`To create your topology view component, add a `}
            
            <code {...{"className":"ws-code"}}>
              {`VisualizationProvider`}
            </code>
            {`, which is a useful context provider. It allows access to the created Controller and is required when using the `}
            
            <code {...{"className":"ws-code"}}>
              {`VisualizationSurface`}
            </code>
            {` component.`}
          </p>
          

        </li>
        

        
        <li {...{"className":"ws-li"}}>
          

          
          <p {...{"className":"ws-p"}}>
            {`You can use the provided `}
            
            <code {...{"className":"ws-code"}}>
              {`VisualizationSurface`}
            </code>
            {` to provide the SVG component required for the topology components. The `}
            
            <code {...{"className":"ws-code"}}>
              {`VisualizationSurface`}
            </code>
            {` can take a state parameter that will allow you to pass your state settings along to the Controller.`}
          </p>
          

        </li>
        

      </ol>
    </Example>,
  'Custom Nodes': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\n\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { RegionsIcon as Icon1 } from '@patternfly/react-icons';\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { FolderOpenIcon as Icon2 } from '@patternfly/react-icons';\n\nimport {\n  ColaLayout,\n  DefaultEdge,\n  DefaultGroup,\n  DefaultNode,\n  EdgeStyle,\n  GraphComponent,\n  ModelKind,\n  NodeModel,\n  NodeShape,\n  SELECTION_EVENT,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface\n} from '@patternfly/react-topology';\nimport { ComponentFactory, Graph, Layout, LayoutFactory, Model, Node, NodeStatus } from '@patternfly/react-topology';\n\ninterface CustomNodeProps {\n  element: Node;\n}\n\nconst BadgeColors = [\n  {\n    name: 'A',\n    badgeColor: '#ace12e',\n    badgeTextColor: '#0f280d',\n    badgeBorderColor: '#486b00'\n  },\n  {\n    name: 'B',\n    badgeColor: '#F2F0FC',\n    badgeTextColor: '#5752d1',\n    badgeBorderColor: '#CBC1FF'\n  }\n];\n\nconst CustomNode: React.FC<CustomNodeProps> = ({ element }) => {\n  const data = element.getData();\n  const Icon = data.alternate ? Icon2 : Icon1;\n  const badgeColors = BadgeColors.find(badgeColor => badgeColor.name === data.badge);\n\n  return (\n    <DefaultNode\n      element={element}\n      showStatusDecorator\n      badge={data.badge}\n      badgeColor={badgeColors?.badgeColor}\n      badgeTextColor={badgeColors?.badgeTextColor}\n      badgeBorderColor={badgeColors?.badgeBorderColor}\n    >\n      <g transform={`translate(25, 25)`}>\n        <Icon style={{ color: '#393F44' }} width={25} height={25} />\n      </g>\n    </DefaultNode>\n  );\n};\n\nconst customLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {\n  switch (type) {\n    case 'Cola':\n      return new ColaLayout(graph);\n    default:\n      return new ColaLayout(graph, { layoutOnDrag: false });\n  }\n};\n\nconst customComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {\n  switch (type) {\n    case 'group':\n      return DefaultGroup;\n    default:\n      switch (kind) {\n        case ModelKind.graph:\n          return GraphComponent;\n        case ModelKind.node:\n          return CustomNode;\n        case ModelKind.edge:\n          return DefaultEdge;\n        default:\n          return undefined;\n      }\n  }\n};\n\nconst NODE_DIAMETER = 75;\n\nconst NODES: NodeModel[] = [\n  {\n    id: 'node-0',\n    type: 'node',\n    label: 'Node 0',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.ellipse,\n    status: NodeStatus.danger,\n    data: {\n      badge: 'B',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-1',\n    type: 'node',\n    label: 'Node 1',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    status: NodeStatus.warning,\n    data: {\n      badge: 'B',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-2',\n    type: 'node',\n    label: 'Node 2',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.octagon,\n    status: NodeStatus.success,\n    data: {\n      badge: 'A',\n      isAlternate: true\n    }\n  },\n  {\n    id: 'node-3',\n    type: 'node',\n    label: 'Node 3',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rhombus,\n    status: NodeStatus.info,\n    data: {\n      badge: 'A',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-4',\n    type: 'node',\n    label: 'Node 4',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    status: NodeStatus.default,\n    data: {\n      badge: 'C',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-5',\n    type: 'node',\n    label: 'Node 5',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rect,\n    data: {\n      badge: 'C',\n      isAlternate: true\n    }\n  },\n  {\n    id: 'Group-1',\n    children: ['node-0', 'node-1', 'node-2'],\n    type: 'group',\n    group: true,\n    label: 'Group-1',\n    style: {\n      padding: 40\n    }\n  }\n];\n\nconst EDGES = [\n  {\n    id: 'edge-node-4-node-5',\n    type: 'edge',\n    source: 'node-4',\n    target: 'node-5',\n    edgeStyle: EdgeStyle.default\n  },\n  {\n    id: 'edge-node-0-node-2',\n    type: 'edge',\n    source: 'node-0',\n    target: 'node-2',\n    edgeStyle: EdgeStyle.default\n  }\n];\n\nexport const TopologyCustomNodeDemo: React.FC = () => {\n  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);\n\n  const controller = React.useMemo(() => {\n    const model: Model = {\n      nodes: NODES,\n      edges: EDGES,\n      graph: {\n        id: 'g1',\n        type: 'graph',\n        layout: 'Cola'\n      }\n    };\n\n    const newController = new Visualization();\n    newController.registerLayoutFactory(customLayoutFactory);\n    newController.registerComponentFactory(customComponentFactory);\n\n    newController.addEventListener(SELECTION_EVENT, setSelectedIds);\n\n    newController.fromModel(model, false);\n\n    return newController;\n  }, []);\n\n  return (\n    <VisualizationProvider controller={controller}>\n      <VisualizationSurface state={{ selectedIds }} />\n    </VisualizationProvider>\n  );\n};\n","title":"Custom Nodes","lang":"ts"}}>
      
      <p {...{"className":"ws-p"}}>
        {`To create a demo with custom node styling, you will need to create a custom node component, which your `}
        
        <code {...{"className":"ws-code"}}>
          {`customComponentFactory`}
        </code>
        {` will return.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`To do this, you will need:`}
      </p>
      
      <ul {...{"className":"ws-ul"}}>
        

        
        <li {...{"className":"ws-li"}}>
          {`A `}
          
          <code {...{"className":"ws-code"}}>
            {`CustomNode`}
          </code>
          {` component, with `}
          
          <code {...{"className":"ws-code"}}>
            {`CustomNodeProps`}
          </code>
          {` as the generic type, and the destructured `}
          
          <code {...{"className":"ws-code"}}>
            {`element`}
          </code>
          {` as the parameter. The code in the example shows how you can get data from `}
          
          <code {...{"className":"ws-code"}}>
            {`element`}
          </code>
          {` and apply it to the attributes of `}
          
          <code {...{"className":"ws-code"}}>
            {`DefaultNode`}
          </code>
          {`.`}
        </li>
        

      </ul>
      
      <p {...{"className":"ws-p"}}>
        {`Within each node in your `}
        
        <code {...{"className":"ws-code"}}>
          {`NODES`}
        </code>
        {` array, you can set `}
        
        <code {...{"className":"ws-code"}}>
          {`data`}
        </code>
        {` to include additional custom attributes.`}
      </p>
    </Example>,
  'Custom Edges': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\n\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { RegionsIcon as Icon1 } from '@patternfly/react-icons';\n\nimport {\n  ColaLayout,\n  ComponentFactory,\n  CREATE_CONNECTOR_DROP_TYPE,\n  DefaultEdge,\n  DefaultGroup,\n  DefaultNode,\n  Edge,\n  EdgeAnimationSpeed,\n  EdgeModel,\n  EdgeStyle,\n  EdgeTerminalType,\n  Graph,\n  GraphComponent,\n  LabelPosition,\n  Layout,\n  LayoutFactory,\n  Model,\n  ModelKind,\n  Node,\n  nodeDragSourceSpec,\n  nodeDropTargetSpec,\n  NodeModel,\n  NodeShape,\n  SELECTION_EVENT,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface,\n  withDndDrop,\n  withDragNode,\n  WithDragNodeProps,\n  withSelection,\n  WithSelectionProps\n} from '@patternfly/react-topology';\n\ninterface CustomNodeProps {\n  element: Node;\n}\n\ninterface DataEdgeProps {\n  element: Edge;\n}\n\nconst CONNECTOR_SOURCE_DROP = 'connector-src-drop';\nconst CONNECTOR_TARGET_DROP = 'connector-target-drop';\n\nconst DataEdge: React.FC<DataEdgeProps> = ({ element, ...rest }) => (\n  <DefaultEdge\n    element={element}\n    startTerminalType={EdgeTerminalType.cross}\n    endTerminalType={EdgeTerminalType.directionalAlt}\n    {...rest}\n  />\n);\n\nconst CustomNode: React.FC<CustomNodeProps & WithSelectionProps & WithDragNodeProps> = ({\n  element,\n  selected,\n  onSelect,\n  ...rest\n}) => {\n  const Icon = Icon1;\n\n  return (\n    <DefaultNode\n      element={element}\n      showStatusDecorator\n      selected={selected}\n      onSelect={onSelect}\n      labelPosition={LabelPosition.right}\n      {...rest}\n    >\n      <g transform={`translate(25, 25)`}>\n        <Icon style={{ color: '#393F44' }} width={25} height={25} />\n      </g>\n    </DefaultNode>\n  );\n};\n\nconst customLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined =>\n  new ColaLayout(graph, { layoutOnDrag: false });\n\nconst customComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {\n  switch (type) {\n    case 'group':\n      return DefaultGroup;\n    case 'node':\n      return withDndDrop(\n        nodeDropTargetSpec([CONNECTOR_SOURCE_DROP, CONNECTOR_TARGET_DROP, CREATE_CONNECTOR_DROP_TYPE])\n      )(withDragNode(nodeDragSourceSpec('node', true, true))(withSelection()(CustomNode)));\n    case 'data-edge':\n      return DataEdge;\n    default:\n      switch (kind) {\n        case ModelKind.graph:\n          return GraphComponent;\n        case ModelKind.node:\n          return CustomNode;\n        case ModelKind.edge:\n          return DefaultEdge;\n        default:\n          return undefined;\n      }\n  }\n};\n\nconst NODE_DIAMETER = 75;\n\nconst NODES: NodeModel[] = [\n  {\n    id: 'node-0',\n    type: 'node',\n    label: 'Node 0',\n    labelPosition: LabelPosition.right,\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.ellipse,\n    x: 350,\n    y: 50\n  },\n  {\n    id: 'node-1',\n    type: 'node',\n    label: 'Node 1',\n    labelPosition: LabelPosition.right,\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    x: 150,\n    y: 150\n  },\n  {\n    id: 'node-2',\n    type: 'node',\n    label: 'Node 2',\n    labelPosition: LabelPosition.right,\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.octagon,\n    x: 150,\n    y: 350\n  },\n  {\n    id: 'node-3',\n    type: 'node',\n    label: 'Node 3',\n    labelPosition: LabelPosition.right,\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rhombus,\n    x: 350,\n    y: 450\n  },\n  {\n    id: 'node-4',\n    type: 'node',\n    label: 'Node 4',\n    labelPosition: LabelPosition.right,\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    x: 550,\n    y: 350\n  },\n  {\n    id: 'node-5',\n    type: 'node',\n    label: 'Node 5',\n    labelPosition: LabelPosition.right,\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rect,\n    x: 550,\n    y: 150\n  },\n  {\n    id: 'Group-1',\n    children: ['node-0', 'node-1', 'node-2'],\n    type: 'group',\n    group: true,\n    label: 'Group-1',\n    style: {\n      padding: 40\n    }\n  }\n];\n\nconst EDGES: EdgeModel[] = [\n  {\n    id: `edge-1`,\n    type: 'edge',\n    source: 'node-4',\n    target: 'node-5'\n  },\n  {\n    id: `edge-2`,\n    type: 'data-edge',\n    source: 'node-0',\n    target: 'node-1',\n    edgeStyle: EdgeStyle.dashedMd,\n    animationSpeed: EdgeAnimationSpeed.medium\n  }\n];\n\nexport const TopologyEdgeDemo: React.FC = () => {\n  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);\n\n  const controller = React.useMemo(() => {\n    const model: Model = {\n      nodes: NODES,\n      edges: EDGES,\n      graph: {\n        id: 'g1',\n        type: 'graph',\n        layout: 'Cola'\n      }\n    };\n\n    const newController = new Visualization();\n    newController.registerLayoutFactory(customLayoutFactory);\n    newController.registerComponentFactory(customComponentFactory);\n\n    newController.addEventListener(SELECTION_EVENT, setSelectedIds);\n\n    newController.fromModel(model, false);\n\n    return newController;\n  }, []);\n\n  return (\n    <VisualizationProvider controller={controller}>\n      <VisualizationSurface state={{ selectedIds }} />\n    </VisualizationProvider>\n  );\n};\n","title":"Custom Edges","lang":"ts"}}>
      
      <p {...{"className":"ws-p"}}>
        {`Edges can be styled using properties on `}
        
        <code {...{"className":"ws-code"}}>
          {`EdgeModel`}
        </code>
        {`:`}
      </p>
      
      <ul {...{"className":"ws-ul"}}>
        

        
        <li {...{"className":"ws-li"}}>
          {`edgeStyle: choose from the `}
          
          <code {...{"className":"ws-code"}}>
            {`EdgeStyle`}
          </code>
          {` enumeration providing solid, dashed, or dotted`}
        </li>
        

        
        <li {...{"className":"ws-li"}}>
          {`animationSpeed: choose from the `}
          
          <code {...{"className":"ws-code"}}>
            {`EdgeAnimationSpeed`}
          </code>
          {` enumeration providing various speeds`}
        </li>
        

      </ul>
      
      <p {...{"className":"ws-p"}}>
        {`You can also customize your edges further by providing a custom Edge component. In the component you can specify a variety of parameters to pass to `}
        
        <code {...{"className":"ws-code"}}>
          {`DefaultEdge`}
        </code>
        {` or you can create the SVG elements to depict the edge.`}
      </p>
    </Example>,
  'Pan/Zoom': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\n\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { RegionsIcon as Icon1 } from '@patternfly/react-icons';\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { FolderOpenIcon as Icon2 } from '@patternfly/react-icons';\n\nimport {\n  ColaLayout,\n  DefaultEdge,\n  DefaultGroup,\n  DefaultNode,\n  EdgeStyle,\n  GraphComponent,\n  ModelKind,\n  NodeModel,\n  NodeShape,\n  SELECTION_EVENT,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface,\n  withPanZoom\n} from '@patternfly/react-topology';\nimport { ComponentFactory, Graph, Layout, LayoutFactory, Model, Node, NodeStatus } from '@patternfly/react-topology';\n\ninterface CustomNodeProps {\n  element: Node;\n}\n\nconst BadgeColors = [\n  {\n    name: 'A',\n    badgeColor: '#ace12e',\n    badgeTextColor: '#0f280d',\n    badgeBorderColor: '#486b00'\n  },\n  {\n    name: 'B',\n    badgeColor: '#F2F0FC',\n    badgeTextColor: '#5752d1',\n    badgeBorderColor: '#CBC1FF'\n  }\n];\n\nconst CustomNode: React.FC<CustomNodeProps> = ({ element }) => {\n  const data = element.getData();\n  const Icon = data.alternate ? Icon2 : Icon1;\n  const badgeColors = BadgeColors.find(badgeColor => badgeColor.name === data.badge);\n\n  return (\n    <DefaultNode\n      element={element}\n      showStatusDecorator\n      badge={data.badge}\n      badgeColor={badgeColors?.badgeColor}\n      badgeTextColor={badgeColors?.badgeTextColor}\n      badgeBorderColor={badgeColors?.badgeBorderColor}\n    >\n      <g transform={`translate(25, 25)`}>\n        <Icon style={{ color: '#393F44' }} width={25} height={25} />\n      </g>\n    </DefaultNode>\n  );\n};\n\nconst customLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {\n  switch (type) {\n    case 'Cola':\n      return new ColaLayout(graph);\n    default:\n      return new ColaLayout(graph, { layoutOnDrag: false });\n  }\n};\n\nconst customComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {\n  switch (type) {\n    case 'group':\n      return DefaultGroup;\n    default:\n      switch (kind) {\n        case ModelKind.graph:\n          return withPanZoom()(GraphComponent);\n        case ModelKind.node:\n          return CustomNode;\n        case ModelKind.edge:\n          return DefaultEdge;\n        default:\n          return undefined;\n      }\n  }\n};\n\nconst NODE_DIAMETER = 75;\n\nconst NODES: NodeModel[] = [\n  {\n    id: 'node-0',\n    type: 'node',\n    label: 'Node 0',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.ellipse,\n    status: NodeStatus.danger,\n    data: {\n      badge: 'B',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-1',\n    type: 'node',\n    label: 'Node 1',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    status: NodeStatus.warning,\n    data: {\n      badge: 'B',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-2',\n    type: 'node',\n    label: 'Node 2',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.octagon,\n    status: NodeStatus.success,\n    data: {\n      badge: 'A',\n      isAlternate: true\n    }\n  },\n  {\n    id: 'node-3',\n    type: 'node',\n    label: 'Node 3',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rhombus,\n    status: NodeStatus.info,\n    data: {\n      badge: 'A',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-4',\n    type: 'node',\n    label: 'Node 4',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    status: NodeStatus.default,\n    data: {\n      badge: 'C',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-5',\n    type: 'node',\n    label: 'Node 5',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rect,\n    data: {\n      badge: 'C',\n      isAlternate: true\n    }\n  },\n  {\n    id: 'Group-1',\n    children: ['node-0', 'node-1', 'node-2'],\n    type: 'group',\n    group: true,\n    label: 'Group-1',\n    style: {\n      padding: 40\n    }\n  }\n];\n\nconst EDGES = [\n  {\n    id: 'edge-node-4-node-5',\n    type: 'edge',\n    source: 'node-4',\n    target: 'node-5',\n    edgeStyle: EdgeStyle.default\n  },\n  {\n    id: 'edge-node-0-node-2',\n    type: 'edge',\n    source: 'node-0',\n    target: 'node-2',\n    edgeStyle: EdgeStyle.default\n  }\n];\n\nexport const TopologyPanZoomDemo: React.FC = () => {\n  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);\n\n  const controller = React.useMemo(() => {\n    const model: Model = {\n      nodes: NODES,\n      edges: EDGES,\n      graph: {\n        id: 'g1',\n        type: 'graph',\n        layout: 'Cola'\n      }\n    };\n\n    const newController = new Visualization();\n    newController.registerLayoutFactory(customLayoutFactory);\n    newController.registerComponentFactory(customComponentFactory);\n\n    newController.addEventListener(SELECTION_EVENT, setSelectedIds);\n\n    newController.fromModel(model, false);\n\n    return newController;\n  }, []);\n\n  return (\n    <VisualizationProvider controller={controller}>\n      <VisualizationSurface state={{ selectedIds }} />\n    </VisualizationProvider>\n  );\n};\n","title":"Pan/Zoom","lang":"ts"}}>
      
      <p {...{"className":"ws-p"}}>
        {`To allow the user to pan and zoom on the graph, you can use the `}
        
        <code {...{"className":"ws-code"}}>
          {`withPanZoom`}
        </code>
        {` utility when returning the graph component in the componentFactory: `}
        
        <code {...{"className":"ws-code"}}>
          {`withPanZoom(GraphComponent)`}
        </code>
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`The component should accept a `}
        
        <code {...{"className":"ws-code"}}>
          {`panZoomRef`}
        </code>
        {` property. This should be the ref on the surface element for the group, the element that will accept the drag or mouse wheel events.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`Alternatively, you can use the `}
        
        <code {...{"className":"ws-code"}}>
          {`usePanZoom`}
        </code>
        {` hook within the component to retrieve the `}
        
        <code {...{"className":"ws-code"}}>
          {`panZoomRef`}
        </code>
        {` property.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`If you are using the provided `}
        
        <code {...{"className":"ws-code"}}>
          {`GraphComponent`}
        </code>
        {`, this property is accepted and will be handled appropriately.`}
      </p>
    </Example>,
  'Selectable Topology': props => 
    <Example {...pageData} {...props} {...{"code":"import * as React from 'react';\n\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { RegionsIcon as Icon1 } from '@patternfly/react-icons';\n// eslint-disable-next-line patternfly-react/import-tokens-icons\nimport { FolderOpenIcon as Icon2 } from '@patternfly/react-icons';\n\nimport {\n  ColaLayout,\n  DefaultEdge,\n  DefaultGroup,\n  DefaultNode,\n  EdgeStyle,\n  GraphComponent,\n  ModelKind,\n  NodeModel,\n  NodeShape,\n  SELECTION_EVENT,\n  Visualization,\n  VisualizationProvider,\n  VisualizationSurface,\n  withSelection,\n  WithSelectionProps\n} from '@patternfly/react-topology';\nimport { ComponentFactory, Graph, Layout, LayoutFactory, Model, Node, NodeStatus } from '@patternfly/react-topology';\n\ninterface CustomNodeProps {\n  element: Node;\n}\n\nconst BadgeColors = [\n  {\n    name: 'A',\n    badgeColor: '#ace12e',\n    badgeTextColor: '#0f280d',\n    badgeBorderColor: '#486b00'\n  },\n  {\n    name: 'B',\n    badgeColor: '#F2F0FC',\n    badgeTextColor: '#5752d1',\n    badgeBorderColor: '#CBC1FF'\n  }\n];\n\nconst CustomNode: React.FC<CustomNodeProps & WithSelectionProps> = ({ element, onSelect, selected }) => {\n  const data = element.getData();\n  const Icon = data.alternate ? Icon2 : Icon1;\n  const badgeColors = BadgeColors.find(badgeColor => badgeColor.name === data.badge);\n\n  return (\n    <DefaultNode\n      element={element}\n      showStatusDecorator\n      badge={data.badge}\n      badgeColor={badgeColors?.badgeColor}\n      badgeTextColor={badgeColors?.badgeTextColor}\n      badgeBorderColor={badgeColors?.badgeBorderColor}\n      onSelect={onSelect}\n      selected={selected}\n    >\n      <g transform={`translate(25, 25)`}>\n        <Icon style={{ color: '#393F44' }} width={25} height={25} />\n      </g>\n    </DefaultNode>\n  );\n};\n\nconst customLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {\n  switch (type) {\n    case 'Cola':\n      return new ColaLayout(graph);\n    default:\n      return new ColaLayout(graph, { layoutOnDrag: false });\n  }\n};\n\nconst customComponentFactory: ComponentFactory = (kind: ModelKind, type: string) => {\n  switch (type) {\n    case 'group':\n      return DefaultGroup;\n    default:\n      switch (kind) {\n        case ModelKind.graph:\n          return GraphComponent;\n        case ModelKind.node:\n          return withSelection()(CustomNode);\n        case ModelKind.edge:\n          return withSelection()(DefaultEdge);\n        default:\n          return undefined;\n      }\n  }\n};\n\nconst NODE_DIAMETER = 75;\n\nconst NODES: NodeModel[] = [\n  {\n    id: 'node-0',\n    type: 'node',\n    label: 'Node 0',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.ellipse,\n    status: NodeStatus.danger,\n    data: {\n      badge: 'B',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-1',\n    type: 'node',\n    label: 'Node 1',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    status: NodeStatus.warning,\n    data: {\n      badge: 'B',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-2',\n    type: 'node',\n    label: 'Node 2',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.octagon,\n    status: NodeStatus.success,\n    data: {\n      badge: 'A',\n      isAlternate: true\n    }\n  },\n  {\n    id: 'node-3',\n    type: 'node',\n    label: 'Node 3',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rhombus,\n    status: NodeStatus.info,\n    data: {\n      badge: 'A',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-4',\n    type: 'node',\n    label: 'Node 4',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.hexagon,\n    status: NodeStatus.default,\n    data: {\n      badge: 'C',\n      isAlternate: false\n    }\n  },\n  {\n    id: 'node-5',\n    type: 'node',\n    label: 'Node 5',\n    width: NODE_DIAMETER,\n    height: NODE_DIAMETER,\n    shape: NodeShape.rect,\n    data: {\n      badge: 'C',\n      isAlternate: true\n    }\n  },\n  {\n    id: 'Group-1',\n    children: ['node-0', 'node-1', 'node-2'],\n    type: 'group',\n    group: true,\n    label: 'Group-1',\n    style: {\n      padding: 40\n    }\n  }\n];\n\nconst EDGES = [\n  {\n    id: 'edge-node-4-node-5',\n    type: 'edge',\n    source: 'node-4',\n    target: 'node-5',\n    edgeStyle: EdgeStyle.default\n  },\n  {\n    id: 'edge-node-0-node-2',\n    type: 'edge',\n    source: 'node-0',\n    target: 'node-2',\n    edgeStyle: EdgeStyle.default\n  }\n];\n\nexport const TopologySelectableDemo: React.FC = () => {\n  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);\n\n  const controller = React.useMemo(() => {\n    const model: Model = {\n      nodes: NODES,\n      edges: EDGES,\n      graph: {\n        id: 'g1',\n        type: 'graph',\n        layout: 'Cola'\n      }\n    };\n\n    const newController = new Visualization();\n    newController.registerLayoutFactory(customLayoutFactory);\n    newController.registerComponentFactory(customComponentFactory);\n\n    newController.addEventListener(SELECTION_EVENT, setSelectedIds);\n\n    newController.fromModel(model, false);\n\n    return newController;\n  }, []);\n\n  return (\n    <VisualizationProvider controller={controller}>\n      <VisualizationSurface state={{ selectedIds }} />\n    </VisualizationProvider>\n  );\n};\n","title":"Selectable Topology","lang":"ts"}}>
      
      <p {...{"className":"ws-p"}}>
        {`To allow nodes/edges to be selectable, you can use the `}
        
        <code {...{"className":"ws-code"}}>
          {`withSelection`}
        </code>
        {` utility when returning the component in the componentFactory, e.g.: `}
        
        <code {...{"className":"ws-code"}}>
          {`withSelection()(MyCustomNode)`}
        </code>
        {`.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`The component should accept two parameters, `}
        
        <code {...{"className":"ws-code"}}>
          {`onSelect`}
        </code>
        {` and `}
        
        <code {...{"className":"ws-code"}}>
          {`selected`}
        </code>
        {` (you can simply extend `}
        
        <code {...{"className":"ws-code"}}>
          {`WithSelectionProps`}
        </code>
        {`).`}
      </p>
      
      <ul {...{"className":"ws-ul"}}>
        

        
        <li {...{"className":"ws-li"}}>
          
          <code {...{"className":"ws-code"}}>
            {`onSelect`}
          </code>
          {`: function to call upon node selection. Typically the outer container for the component would call onSelect when clicked.`}
        </li>
        

        
        <li {...{"className":"ws-li"}}>
          
          <code {...{"className":"ws-code"}}>
            {`selected`}
          </code>
          {`: indicates if the element is currently selected. Updates the drawing of the component to indicate its selection status.
Alternatively, you can use the `}
          
          <code {...{"className":"ws-code"}}>
            {`useSelection`}
          </code>
          {` hook within the component to retrieve the same two properties.`}
        </li>
        

      </ul>
      
      <p {...{"className":"ws-p"}}>
        {`If you are using `}
        
        <code {...{"className":"ws-code"}}>
          {`DefaultNode`}
        </code>
        {`, these props can be passed along and will be handled appropriately.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`By default, the application must control selection state. This can be done by adding a listener to the controller for a `}
        
        <code {...{"className":"ws-code"}}>
          {`SELECTION_EVENT`}
        </code>
        {`. The listener would then keep track of the selectedIds and maintain the ids in state and pass that state along to the `}
        
        <code {...{"className":"ws-code"}}>
          {`VisualizationSurface`}
        </code>
        {`.`}
      </p>
      
      <p {...{"className":"ws-p"}}>
        {`Alternatively, you can pass `}
        
        <code {...{"className":"ws-code"}}>
          {`{ controlled: true }`}
        </code>
        {` to the `}
        
        <code {...{"className":"ws-code"}}>
          {`withSelection`}
        </code>
        {` utility or to the `}
        
        <code {...{"className":"ws-code"}}>
          {`useSelection`}
        </code>
        {` hook.`}
      </p>
    </Example>
};

const Component = () => (
  <React.Fragment>
    <p {...{"className":"ws-p"}}>
      {`Note: Topology lives in its own package at `}
      <PatternflyThemeLink {...{"to":"https://www.npmjs.com/package/@patternfly/react-topology"}}>
        <code {...{"className":"ws-code"}}>
          {`@patternfly/react-topology`}
        </code>
      </PatternflyThemeLink>
    </p>
    <AutoLinkHeader {...{"id":"basic-usage","size":"h2","className":"ws-title ws-h2"}}>
      {`Basic Usage`}
    </AutoLinkHeader>
    <p {...{"className":"ws-p"}}>
      {`To use React Topology out-of-the-box, you will first need to transform your back-end data into a `}
      <PatternflyThemeLink {...{"to":"https://github.com/patternfly/patternfly-react/blob/main/packages/react-topology/src/types.ts#L16-L20"}}>
        {`Model`}
      </PatternflyThemeLink>
      {`. These model objects contain the information needed to display the nodes and edges. Each node and edge has a set of properties used by PF Topology as well as a data field which can be used to customize the nodes and edges by the application.`}
    </p>
    <AutoLinkHeader {...{"id":"examples","size":"h2","className":"ws-title ws-h2"}}>
      {`Examples`}
    </AutoLinkHeader>
    {React.createElement(pageData.examples["Baseline Topology"])}
    {React.createElement(pageData.examples["Custom Nodes"])}
    {React.createElement(pageData.examples["Custom Edges"])}
    {React.createElement(pageData.examples["Pan/Zoom"])}
    {React.createElement(pageData.examples["Selectable Topology"])}
  </React.Fragment>
);
Component.displayName = 'TopologyTopologyViewExtensionsDocs';
Component.pageData = pageData;

export default Component;
