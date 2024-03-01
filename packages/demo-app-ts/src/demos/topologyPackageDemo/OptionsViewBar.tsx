import React from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  MenuToggle,
  MenuToggleElement,
  Split,
  SplitItem,
  TextInput,
  ToolbarItem,
  Tooltip,
} from '@patternfly/react-core';
import { Controller, Model, observer } from '@patternfly/react-topology';
import { DemoContext } from './DemoContext';

const OptionsContextBar: React.FC<{ controller: Controller }> = observer(({ controller }) => {
  const options = React.useContext(DemoContext);
  const [layoutDropdownOpen, setLayoutDropdownOpen] = React.useState(false);
  const [savedModel, setSavedModel] = React.useState<Model>();
  const [modelSaved, setModelSaved] = React.useState<boolean>(false);
  const newNodeCount = React.useRef(0);

  const updateLayout = (newLayout: string) => {
    options.setLayout(newLayout);
    setLayoutDropdownOpen(false);
  };

  const layoutDropdown = (
    <Split>
      <SplitItem>
        <label className="pf-v5-u-display-inline-block pf-v5-u-mr-md pf-v5-u-mt-sm">Layout:</label>
      </SplitItem>
      <SplitItem>
        <Dropdown
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle ref={toggleRef} onClick={() => setLayoutDropdownOpen(!layoutDropdownOpen)}>
              {options.layout}
            </MenuToggle>
          )}
          isOpen={layoutDropdownOpen}
          onOpenChange={(isOpen) => setLayoutDropdownOpen(isOpen)}
        >
          <DropdownList>
            <DropdownItem key={1} onClick={() => updateLayout('Force')}>
              Force
            </DropdownItem>
            <DropdownItem key={2} onClick={() => updateLayout('Dagre')}>
              Dagre
            </DropdownItem>
            <DropdownItem key={3} onClick={() => updateLayout('Cola')}>
              Cola
            </DropdownItem>
            <DropdownItem key={8} onClick={() => updateLayout('ColaGroups')}>
              ColaGroups
            </DropdownItem>
            <DropdownItem key={4} onClick={() => updateLayout('ColaNoForce')}>
              ColaNoForce
            </DropdownItem>
            <DropdownItem key={5} onClick={() => updateLayout('Grid')}>
              Grid
            </DropdownItem>
            <DropdownItem key={6} onClick={() => updateLayout('Concentric')}>
              Concentric
            </DropdownItem>
            <DropdownItem key={7} onClick={() => updateLayout('BreadthFirst')}>
              BreadthFirst
            </DropdownItem>
          </DropdownList>
        </Dropdown>
      </SplitItem>
    </Split>
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
        layers: savedModel.graph.layers,
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
          shape: savedNode.shape,
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
    <Flex flexWrap={{ default: 'wrap' }} gap={{ default: 'gapMd'}}>
      <Flex >
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
        <Flex flexWrap={{ default: 'nowrap' }} gap={{ default: 'gapMd'}}>
          <Flex flexWrap={{ default: 'nowrap' }} gap={{ default: 'gapXs'}}>
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
          <Flex flexWrap={{ default: 'nowrap' }} gap={{ default: 'gapXs'}}>
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
    </Flex>
  );
});

export default OptionsContextBar;
