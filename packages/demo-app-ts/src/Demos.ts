import { TopologyDemo } from './demos/TopologyDemo';
import { TopologyPipelineDemo } from './demos/TopologyPipelineDemo';
import { Basics } from './demos/Basics';


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
    id: 'topology-demo',
    name: 'Topology Demo',
    componentType: TopologyDemo
  },
  {
    id: 'topology-demos',
    name: 'Topology Demos',
    demos: [
      {
        id: 'basic',
        name: 'Basic',
        componentType: Basics,
      }
    ]
  },
  {
    id: 'topology-pipelines-demo',
    name: 'Topology Pipelines Demo',
    componentType: TopologyPipelineDemo
  },
];

export default Demos;
