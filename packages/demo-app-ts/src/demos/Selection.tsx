import { useCallback, useState } from 'react';
import {
  Model,
  ModelKind,
  NodeModel,
  withSelection,
  SELECTION_EVENT,
  SelectionEventListener,
  useComponentFactory,
  ComponentFactory,
  useModel,
  useEventListener,
  useVisualizationState,
  SELECTION_STATE
} from '@patternfly/react-topology';
import defaultComponentFactory from '../components/defaultComponentFactory';
import withTopologySetup from '../utils/withTopologySetup';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';

const twoNodeModel: Model = {
  graph: {
    id: 'g1',
    type: 'graph'
  },
  nodes: [
    {
      id: 'gr1',
      type: 'group',
      group: true,
      children: ['n1', 'n2'],
      style: {
        padding: 10
      }
    },
    {
      id: 'n1',
      type: 'node',
      x: 30,
      y: 30,
      width: 20,
      height: 20
    },
    {
      id: 'n2',
      type: 'node',
      x: 100,
      y: 30,
      width: 20,
      height: 20
    }
  ]
};

export const UncontrolledSelection: React.FunctionComponent = withTopologySetup(() => {
  useComponentFactory(
    useCallback<ComponentFactory>((kind, type) => {
      const widget = defaultComponentFactory(kind, type);
      if (kind === ModelKind.node || kind === ModelKind.graph) {
        // TODO fix any type
        return withSelection({ multiSelect: false, controlled: false })(widget as any);
      }
      return widget;
    }, [])
  );
  useEventListener(
    SELECTION_EVENT,
    useCallback<SelectionEventListener>(([id]) => {
      // eslint-disable-next-line no-console
      console.log(`Selection event`, id);
    }, [])
  );
  useModel(twoNodeModel);
  return null;
});
UncontrolledSelection.displayName = 'UncontrolledSelection';

export const ControlledSelection = withTopologySetup(() => {
  const [, setSelectedIds] = useVisualizationState(SELECTION_STATE);
  useComponentFactory(
    useCallback<ComponentFactory>((kind, type) => {
      const widget = defaultComponentFactory(kind, type);
      if (kind === ModelKind.node || kind === ModelKind.graph) {
        // TODO fix any type
        return withSelection({ multiSelect: false, controlled: true })(widget as any);
      }
      return widget;
    }, [])
  );
  useEventListener(
    SELECTION_EVENT,
    useCallback<SelectionEventListener>(
      (ids) => {
        // eslint-disable-next-line no-console
        console.log(`Selection event`, ids);
        setSelectedIds(ids);
      },
      [setSelectedIds]
    )
  );
  useModel(twoNodeModel);
  return null;
});

export const MultiSelect: React.FunctionComponent = withTopologySetup(() => {
  useModel(twoNodeModel);
  useComponentFactory(
    useCallback<ComponentFactory>((kind, type) => {
      const widget = defaultComponentFactory(kind, type);
      if (kind === ModelKind.node || kind === ModelKind.graph) {
        // TODO fix any type
        return withSelection({ multiSelect: true, controlled: false })(widget as any);
      }
      return widget;
    }, [])
  );
  useEventListener(
    SELECTION_EVENT,
    useCallback<SelectionEventListener>((ids) => {
      // eslint-disable-next-line no-console
      console.log(`Selection event`, ids);
    }, [])
  );
  return null;
});
MultiSelect.displayName = 'MultiSelect';

const perfModel: Model = {
  graph: {
    id: 'g1',
    type: 'graph'
  },
  nodes: []
};
for (let i = 1; i <= 100; i++) {
  for (let j = 1; j <= 100; j++) {
    const node: NodeModel = {
      id: `${i}-${j}`,
      type: 'node',
      x: j * 20,
      y: i * 20,
      width: 10,
      height: 10
    };
    perfModel.nodes.push(node);
  }
}

export const Performance: React.FunctionComponent = withTopologySetup(() => {
  useModel(perfModel);
  useComponentFactory(
    useCallback<ComponentFactory>((kind, type) => {
      const widget = defaultComponentFactory(kind, type);
      if (kind === ModelKind.node || kind === ModelKind.graph) {
        // TODO fix any type
        return withSelection({ multiSelect: true, controlled: false, raiseOnSelect: false })(widget as any);
      }
      return widget;
    }, [])
  );
  return null;
});
Performance.displayName = 'Performance';

export const Selection: React.FunctionComponent = () => {
  const [activeKey, setActiveKey] = useState<string | number>(0);

  const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveKey(tabIndex);
  };

  return (
    <div className="pf-ri__topology-demo">
      <Tabs unmountOnExit activeKey={activeKey} onSelect={handleTabClick}>
        <Tab eventKey={0} title={<TabTitleText>Uncontrolled</TabTitleText>}>
          <UncontrolledSelection />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Controlled</TabTitleText>}>
          <ControlledSelection />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Multi Select</TabTitleText>}>
          <MultiSelect />
        </Tab>
        <Tab eventKey={3} title={<TabTitleText>Performance</TabTitleText>}>
          <Performance />
        </Tab>
      </Tabs>
    </div>
  );
};
