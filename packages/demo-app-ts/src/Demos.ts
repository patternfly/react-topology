import { TopologyPipelineDemo } from './demos/TopologyPipelineDemo';
import { Basics } from './demos/Basics';
import { StyleEdges, StyleGroups, StyleLabels, StyleNodes } from './demos/Styles';
import { Selection } from './demos/Selection';
import { PanZoom } from './demos/PanZoom';
import { Layouts } from './demos/Layouts';
import { Connectors } from './demos/Connectors';
import { DragAndDrop } from './demos/DragDrop';
import { Shapes } from './demos/Shapes';
import { ContextMenus } from './demos/ContextMenus';
import { TopologyPackage } from './demos/TopologyPackage';
import { ComplexGroup } from './demos/Groups';
import { CollapsibleGroups } from './demos/CollapsibleGroups';
import { StatusConnectors } from './demos/StatusConnectors';

import './Demo.css';

interface DemoInterface {
  /** ID for the demo, it will be used to help generate general ids to help with testing */
  id: string;
  /** The name of the demo */
  name: string;
  /** Demo component associated with the demo  */
  componentType?: any;
  /** Flag if this is the default demo */
  isDefault?: boolean;
  /** sub demos for the demo  */
  demos?: DemoInterface[];
}
/** Add the name of the demo and it's component here to have them show up in the demo app */
export const Demos: DemoInterface[] = [
  {
    id: 'topology-package',
    name: 'Topology Package',
    componentType: TopologyPackage,
    isDefault: true,
  },
  {
    id: 'topology-pipelines-demo',
    name: 'Topology Pipelines',
    componentType: TopologyPipelineDemo
  },
  {
    id: 'status-connectors',
    name: 'Status Connectors',
    componentType: StatusConnectors,
  },
  {
    id: 'basic',
    name: 'Basic',
    componentType: Basics,
  },
  {
    id: 'styles',
    name: 'Styles',
    demos: [
      {
        id: 'nodes',
        name: 'Nodes',
        componentType: StyleNodes,
      },
      {
        id: 'labels',
        name: 'Labels',
        componentType: StyleLabels,
      },
      {
        id: 'groups',
        name: 'Groups',
        componentType: StyleGroups,
      },
      {
        id: 'edges',
        name: 'Edges',
        componentType: StyleEdges,
      },
    ]
  },
  {
    id: 'selection',
    name: 'Selection',
    componentType: Selection,
  },
  {
    id: 'pan-zoom',
    name: 'Pan Zoom',
    componentType: PanZoom,
  },
  {
    id: 'layout',
    name: 'Layout',
    componentType: Layouts,
  },
  {
    id: 'connectors',
    name: 'Connectors',
    componentType: Connectors,
  },
  {
    id: 'drag-and-drop',
    name: 'Drag and Drop',
    componentType: DragAndDrop,
  },
  {
    id: 'shapes',
    name: 'Shapes',
    componentType: Shapes,
  },
  {
    id: 'context-menus',
    name: 'Context Menus',
    componentType: ContextMenus,
  },
  {
    id: 'complex-group',
    name: 'Complex Group',
    componentType: ComplexGroup,
  },
  {
    id: 'collapsible-groups',
    name: 'Collapsible Groups',
    componentType: CollapsibleGroups,
  },
];

export default Demos;
