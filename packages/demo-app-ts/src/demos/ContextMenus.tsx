import * as React from 'react';
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  Model,
  ModelKind,
  withDragNode,
  withPanZoom,
  GraphComponent,
  withContextMenu,
  useModel,
  useComponentFactory,
  ComponentFactory
} from '@patternfly/react-topology';
import defaultComponentFactory from '../components/defaultComponentFactory';
import DemoDefaultNode from '../components/DemoDefaultNode';
import withTopologySetup from '../utils/withTopologySetup';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';

const contextMenuItem = (label: string, i: number): React.ReactElement => {
  if (label === '-') {
    return <ContextMenuSeparator component="li" key={`separator:${i.toString()}`} />;
  }
  return (
    // eslint-disable-next-line no-alert
    <ContextMenuItem key={label} onClick={() => alert(`Selected: ${label}`)}>
      {label}
    </ContextMenuItem>
  );
};

const createContextMenuItems = (...labels: string[]): React.ReactElement[] => labels.map(contextMenuItem);

const defaultMenu = createContextMenuItems('First', 'Second', 'Third', '-', 'Fourth');

export const UncontrolledContextMenu = () => (
  <>
    <p>Dismiss the context menu by pressing `ESC` or clicking away.</p>
    <ContextMenu reference={{ x: 350, y: 250 }}>{defaultMenu}</ContextMenu>
  </>
);

export const ControlledContextMenu = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} style={{ marginTop: 20 }}>
        Show Context Menu
      </button>
      <ContextMenu reference={{ x: 350, y: 250 }} open={open} onRequestClose={() => setOpen(false)}>
        {defaultMenu}
      </ContextMenu>
    </>
  );
};

export const ContextMenuOnNode = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(
    React.useCallback<ComponentFactory>(kind => {
      if (kind === ModelKind.graph) {
        return withPanZoom()(GraphComponent);
      }
      if (kind === ModelKind.node) {
        return withDragNode()(withContextMenu(() => defaultMenu)(DemoDefaultNode));
      }
      return undefined;
    }, [])
  );
  useModel(
    React.useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: [
          {
            id: 'n1',
            type: 'node',
            x: 50,
            y: 50,
            width: 20,
            height: 20
          }
        ]
      }),
      []
    )
  );
  return null;
});

const createDelayedMenu = (): Promise<React.ReactElement[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(defaultMenu);
    }, 2000);
  });
}
export const ContextMenuPromise = withTopologySetup(() => {
  useComponentFactory(defaultComponentFactory);
  useComponentFactory(
    React.useCallback<ComponentFactory>(kind => {
      if (kind === ModelKind.graph) {
        return withPanZoom()(GraphComponent);
      }
      if (kind === ModelKind.node) {
        return withDragNode()(withContextMenu(createDelayedMenu)(DemoDefaultNode));
      }
      return undefined;
    }, [])
  );
  useModel(
    React.useMemo(
      (): Model => ({
        graph: {
          id: 'g1',
          type: 'graph'
        },
        nodes: [
          {
            id: 'n1',
            type: 'node',
            x: 50,
            y: 50,
            width: 20,
            height: 20
          }
        ]
      }),
      []
    )
  );
  return null;
});

export const ContextMenus: React.FunctionComponent = () => {
  const [activeKey, setActiveKey] = React.useState<string | number>(0);

  const handleTabClick = (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveKey(tabIndex);
  };

  return (
    <div className="pf-ri__topology-demo">
      <Tabs unmountOnExit activeKey={activeKey} onSelect={handleTabClick}>
        <Tab eventKey={0} title={<TabTitleText>Controlled Context Menu</TabTitleText>}>
          <ControlledContextMenu />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Uncontrolled Context Menu</TabTitleText>}>
          <UncontrolledContextMenu />
        </Tab>
        <Tab eventKey={2} title={<TabTitleText>Context Menu on Node</TabTitleText>}>
          <ContextMenuOnNode />
        </Tab>
        <Tab eventKey={3} title={<TabTitleText>Promise Context Menu on Node</TabTitleText>}>
          <ContextMenuPromise />
        </Tab>
      </Tabs>
    </div>
  );
};
