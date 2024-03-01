import * as React from 'react';
import {
  Model,
  ModelKind,
  withPanZoom,
  GraphComponent,
  withDragNode,
  useComponentFactory,
  useLayoutFactory,
  useModel,
  ComponentFactory
} from '@patternfly/react-topology';
import defaultLayoutFactory from '../layouts/defaultLayoutFactory';
import defaultComponentFactory from '../components/defaultComponentFactory';
import GroupHull from '../components/GroupHull';
import Group from '../components/DemoDefaultGroup';
import DemoDefaultNode from '../components/DemoDefaultNode';
import withTopologySetup from '../utils/withTopologySetup';
import { generateDataModel } from './topologyPackageDemo/generator';
import stylesComponentFactory from './stylesDemo/stylesComponentFactory';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';

const getModel = (layout: string): Model => {
  // create nodes from data
  const model = generateDataModel(200, 5, 20, 0);
  model.graph = {
    id: 'g1',
    type: 'graph',
    layout
  };

  return model;
};

const layoutStory = (model: Model): React.FunctionComponent => () => {
  useLayoutFactory(defaultLayoutFactory);
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(stylesComponentFactory);

  // support pan zoom and drag
  useComponentFactory(
    React.useCallback<ComponentFactory>((kind: string, type: string) => {
      if (kind === ModelKind.graph) {
        return withPanZoom()(GraphComponent);
      }
      if (type === 'group-hull') {
        return withDragNode()(GroupHull);
      }
      if (type === 'group') {
        return withDragNode()(Group);
      }
      if (kind === ModelKind.node) {
        return withDragNode()(DemoDefaultNode);
      }
      return undefined;
    }, [])
  );
  useModel(model);
  return null;
};

export const Force = withTopologySetup(layoutStory(getModel('Force')));
export const Dagre = withTopologySetup(layoutStory(getModel('Dagre')));
export const Cola = withTopologySetup(layoutStory(getModel('Cola')));

export const Layouts: React.FunctionComponent = () => {
  const [activeKey, setActiveKey] = React.useState<string | number>(0);

  const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveKey(tabIndex);
  };

  return (
    <div className="pf-ri__topology-demo">
      <Tabs unmountOnExit activeKey={activeKey} onSelect={handleTabClick}>
        <Tab eventKey={0} title={<TabTitleText>Force</TabTitleText>}>
          <Force />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Dagre</TabTitleText>}>
          <Dagre />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Cola</TabTitleText>}>
          <Cola />
        </Tab>
      </Tabs>
    </div>
  );
};
