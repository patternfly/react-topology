import { useContext, useState, useRef } from 'react';
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  MenuToggle,
  MenuToggleElement,
  TextInput,
  ToolbarItem,
  Tooltip
} from '@patternfly/react-core';
import { Controller, Model, observer } from '@patternfly/react-topology';
import { DemoContext } from './DemoContext';
import { LayoutType } from '../../layouts/defaultLayoutFactory';

const LayoutTitles: Record<string, string> = {
  [LayoutType.BreadthFirst]: 'Breadth First',
  [LayoutType.Cola]: 'Cola',
  [LayoutType.ColaGroups]: 'Cola Groups',
  [LayoutType.ColaNoForce]: 'Cola No Force',
  [LayoutType.Concentric]: 'Concentric',
  [LayoutType.Dagre]: 'Dagre',
  [LayoutType.DagreHorizontal]: 'Dagre Horizontal',
  [LayoutType.Force]: 'Force',
  [LayoutType.Grid]: 'Grid'
};

const OptionsContextBar: React.FC<{ controller: Controller }> = observer(({ controller }) => {
  const options = useContext(DemoContext);
  const [layoutDropdownOpen, setLayoutDropdownOpen] = useState(false);
  const [savedModel, setSavedModel] = useState<Model>();
  const [modelSaved, setModelSaved] = useState<boolean>(false);
  const newNodeCount = useRef(0);

  const updateLayout = (newLayout: string) => {
    options.setLayout(newLayout);
    setLayoutDropdownOpen(false);
  };

  const layoutDropdown = (
    <Flex flexWrap={{ default: 'nowrap' }} gap={{ default: 'gapSm' }} alignItems={{ default: 'alignItemsCenter' }}>
      <FlexItem>
        <label className="pf-v6-u-display-inline-block pf-v6-u-mr-md pf-v6-u-mt-sm">Layout:</label>
      </FlexItem>
      <FlexItem>
        <Dropdown
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle ref={toggleRef} onClick={() => setLayoutDropdownOpen(!layoutDropdownOpen)}>
              {LayoutTitles[options.layout]}
            </MenuToggle>
          )}
          isOpen={layoutDropdownOpen}
          onOpenChange={(isOpen) => setLayoutDropdownOpen(isOpen)}
        >
          <DropdownList>
            <DropdownItem key={1} onClick={() => updateLayout(LayoutType.Force)}>
              {LayoutTitles[LayoutType.Force]}
            </DropdownItem>
            <DropdownItem key={2} onClick={() => updateLayout(LayoutType.Dagre)}>
              {LayoutTitles[LayoutType.Dagre]}
            </DropdownItem>
            <DropdownItem key={9} onClick={() => updateLayout(LayoutType.DagreHorizontal)}>
              {LayoutTitles[LayoutType.DagreHorizontal]}
            </DropdownItem>
            <DropdownItem key={3} onClick={() => updateLayout(LayoutType.Cola)}>
              {LayoutTitles[LayoutType.Cola]}
            </DropdownItem>
            <DropdownItem key={8} onClick={() => updateLayout(LayoutType.ColaGroups)}>
              {LayoutTitles[LayoutType.ColaGroups]}
            </DropdownItem>
            <DropdownItem key={4} onClick={() => updateLayout(LayoutType.ColaNoForce)}>
              {LayoutTitles[LayoutType.ColaNoForce]}
            </DropdownItem>
            <DropdownItem key={5} onClick={() => updateLayout(LayoutType.Grid)}>
              {LayoutTitles[LayoutType.Grid]}
            </DropdownItem>
            <DropdownItem key={6} onClick={() => updateLayout(LayoutType.Concentric)}>
              {LayoutTitles[LayoutType.Concentric]}
            </DropdownItem>
            <DropdownItem key={7} onClick={() => updateLayout(LayoutType.BreadthFirst)}>
              {LayoutTitles[LayoutType.BreadthFirst]}
            </DropdownItem>
          </DropdownList>
        </Dropdown>
      </FlexItem>
    </Flex>
  );

  const saveModel = () => {
    setSavedModel(controller.toModel());
    setModelSaved(true);
    setTimeout(() => {
      setModelSaved(false);
    }, 2000);
  };

  const restoreLayout = () => {
    if (savedModel) {
      const currentModel = controller.toModel();
      currentModel.graph = {
        ...currentModel.graph,
        x: savedModel.graph.x,
        y: savedModel.graph.y,
        visible: savedModel.graph.visible,
        style: savedModel.graph.style,
        layout: savedModel.graph.layout,
        scale: savedModel.graph.scale,
        scaleExtent: savedModel.graph.scaleExtent,
        layers: savedModel.graph.layers
      };
      currentModel.nodes = currentModel.nodes.map((n) => {
        const savedNode = savedModel.nodes.find((sn) => sn.id === n.id);
        if (!savedNode) {
          return n;
        }
        return {
          ...n,
          x: savedNode.x,
          y: savedNode.y,
          visible: savedNode.visible,
          style: savedNode.style,
          collapsed: savedNode.collapsed,
          width: savedNode.width,
          height: savedNode.height,
          shape: savedNode.shape
        };
      });
      controller.fromModel(currentModel, false);

      if (savedModel.graph.layout !== options.layout) {
        options.setLayout(savedModel.graph.layout);
      }
    }
  };

  const addNode = () => {
    const newNode = {
      id: `new-node-${newNodeCount.current++}`,
      type: 'node',
      width: 100,
      height: 100,
      data: {}
    };
    const currentModel = controller.toModel();
    currentModel.nodes.push(newNode);
    controller.fromModel(currentModel);
  };

  return (
    <Flex flexWrap={{ default: 'wrap' }} gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsCenter' }}>
      <Flex>
        <ToolbarItem>{layoutDropdown}</ToolbarItem>
        <ToolbarItem>
          <Tooltip content="Layout info saved" trigger="manual" isVisible={modelSaved}>
            <Button variant="secondary" onClick={saveModel}>
              Save Layout Info
            </Button>
          </Tooltip>
        </ToolbarItem>
        <ToolbarItem>
          <Button variant="secondary" onClick={restoreLayout}>
            Restore Layout Info
          </Button>
        </ToolbarItem>
        <ToolbarItem>
          <Button variant="secondary" onClick={addNode}>
            Add Node
          </Button>
        </ToolbarItem>
      </Flex>
      <ToolbarItem>
        <Flex flexWrap={{ default: 'nowrap' }} gap={{ default: 'gapMd' }}>
          <Flex flexWrap={{ default: 'nowrap' }} gap={{ default: 'gapXs' }}>
            <span id="med-scale">Medium Scale:</span>
            <TextInput
              aria-labelledby="med-scale"
              max={1.0}
              min={options.lowScale}
              step={0.01}
              value={options.medScale}
              type="number"
              onChange={(_event, val) => {
                const newValue = parseFloat(val);
                if (!Number.isNaN(newValue) && newValue > options.lowScale && newValue >= 0.01 && newValue <= 1.0) {
                  options.setMedScale(parseFloat(val));
                }
              }}
            />
          </Flex>
          <Flex flexWrap={{ default: 'nowrap' }} gap={{ default: 'gapXs' }}>
            <span id="low-scale">Low Scale:</span>
            <TextInput
              aria-labelledby="low-scale"
              max={options.medScale}
              min={0.01}
              step={0.01}
              value={options.lowScale}
              type="number"
              onChange={(_event, val) => {
                const newValue = parseFloat(val);
                if (!Number.isNaN(newValue) && newValue < options.medScale && newValue >= 0.01 && newValue <= 1.0) {
                  options.setLowScale(parseFloat(val));
                }
              }}
            />
          </Flex>
        </Flex>
      </ToolbarItem>
      <ToolbarItem>
        <Checkbox
          id="log-switch"
          isChecked={options.logEvents}
          onChange={(_event, checked) => options.setLogEvents(checked)}
          label="Log events"
        />
      </ToolbarItem>
    </Flex>
  );
});

export default OptionsContextBar;
