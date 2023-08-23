import React from 'react';
import * as _ from 'lodash';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  Split,
  SplitItem,
  TextInput,
  ToolbarItem,
  Tooltip
} from '@patternfly/react-core';
import { DefaultEdgeOptions, DefaultNodeOptions, GeneratorEdgeOptions, GeneratorNodeOptions } from '../data/generator';
import { EDGE_ANIMATION_SPEEDS, EDGE_STYLES, EDGE_TERMINAL_TYPES, NODE_SHAPES, NODE_STATUSES } from './styleUtils';
import { Controller, Model, NodeShape } from '@patternfly/react-topology';

const GRAPH_LAYOUT_OPTIONS = ['x', 'y', 'visible', 'style', 'layout', 'scale', 'scaleExtent', 'layers'];
const NODE_LAYOUT_OPTIONS = ['x', 'y', 'visible', 'style', 'collapsed', 'width', 'height', 'shape'];

export const useTopologyOptions = (
  controller: Controller
): {
  layout: string;
  nodeOptions: GeneratorNodeOptions;
  edgeOptions: GeneratorEdgeOptions;
  nestedLevel: number;
  creationCounts: { numNodes: number; numEdges: number; numGroups: number };
  medScale: number;
  lowScale: number;
  contextToolbar: React.ReactNode;
  viewToolbar: React.ReactNode;
} => {
  const [layoutDropdownOpen, setLayoutDropdownOpen] = React.useState(false);
  const [layout, setLayout] = React.useState<string>('ColaNoForce');
  const [nodeOptionsOpen, setNodeOptionsOpen] = React.useState<boolean>(false);
  const [nodeShapesOpen, setNodeShapesOpen] = React.useState<boolean>(false);
  const [nodeOptions, setNodeOptions] = React.useState<GeneratorNodeOptions>(DefaultNodeOptions);
  const [edgeOptionsOpen, setEdgeOptionsOpen] = React.useState<boolean>(false);
  const [edgeOptions, setEdgeOptions] = React.useState<GeneratorEdgeOptions>(DefaultEdgeOptions);
  const [savedModel, setSavedModel] = React.useState<Model>();
  const [modelSaved, setModelSaved] = React.useState<boolean>(false);
  const newNodeCount = React.useRef(0);
  const [numNodes, setNumNodes] = React.useState<number>(6);
  const [numEdges, setNumEdges] = React.useState<number>(2);
  const [numGroups, setNumGroups] = React.useState<number>(1);
  const [nestedLevel, setNestedLevel] = React.useState<number>(0);
  const [medScale, setMedScale] = React.useState<number>(0.5);
  const [lowScale, setLowScale] = React.useState<number>(0.3);
  const [creationCounts, setCreationCounts] = React.useState<{ numNodes: number; numEdges: number; numGroups: number }>(
    { numNodes, numEdges, numGroups }
  );
  const updateLayout = (newLayout: string) => {
    setLayout(newLayout);
    setLayoutDropdownOpen(false);
  };

  const layoutDropdown = (
    <Split>
      <SplitItem>
        <label className="pf-v5-u-display-inline-block pf-v5-u-mr-md pf-v5-u-mt-sm">Layout</label>
      </SplitItem>
      <SplitItem>
        <Dropdown
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle ref={toggleRef} onClick={() => setLayoutDropdownOpen(!layoutDropdownOpen)}>
              {layout}
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

  const renderNodeOptionsDropdown = () => {
    const selectContent = (
      <SelectList>
        <SelectOption
          hasCheckbox
          value="Labels"
          isSelected={nodeOptions.nodeLabels}
          onClick={() => setNodeOptions((prev) => ({ ...prev, nodeLabels: !prev.nodeLabels }))}
        >
          Labels
        </SelectOption>
        <SelectOption
          hasCheckbox
          value="Secondary Labels"
          isSelected={nodeOptions.nodeSecondaryLabels}
          onClick={() => setNodeOptions((prev) => ({ ...prev, nodeSecondaryLabels: !prev.nodeSecondaryLabels }))}
        >
          Secondary Labels
        </SelectOption>
        <SelectOption
          hasCheckbox
          value="Status"
          isSelected={nodeOptions.statuses.length > 1}
          onClick={() =>
            setNodeOptions((prev) => ({
              ...prev,
              statuses: prev.statuses.length > 1 ? DefaultNodeOptions.statuses : NODE_STATUSES
            }))
          }
        >
          Status
        </SelectOption>
        <SelectOption
          hasCheckbox
          value="Decorators"
          isSelected={nodeOptions.statusDecorators}
          onClick={() =>
            setNodeOptions((prev) => ({
              ...prev,
              statusDecorators: !prev.statusDecorators,
              showDecorators: !prev.showDecorators
            }))
          }
        >
          Decorators
        </SelectOption>
        <SelectOption
          hasCheckbox
          value="Badges"
          isSelected={nodeOptions.nodeBadges}
          onClick={() => setNodeOptions((prev) => ({ ...prev, nodeBadges: !prev.nodeBadges }))}
        >
          Badges
        </SelectOption>
        <SelectOption
          hasCheckbox
          value="Icons"
          isSelected={nodeOptions.nodeIcons}
          onClick={() => setNodeOptions((prev) => ({ ...prev, nodeIcons: !prev.nodeIcons }))}
        >
          Icons
        </SelectOption>
        <SelectOption
          hasCheckbox
          value="Context Menus"
          isSelected={nodeOptions.contextMenus}
          onClick={() => setNodeOptions((prev) => ({ ...prev, contextMenus: !prev.contextMenus }))}
        >
          Context Menus
        </SelectOption>
      </SelectList>
    );

    const nodeOptionsToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
      <MenuToggle
        ref={toggleRef}
        onClick={() => setNodeOptionsOpen((prev) => !prev)}
        isExpanded={nodeOptionsOpen}
        style={
          {
            width: '250px'
          } as React.CSSProperties
        }
      >
        Node options
      </MenuToggle>
    );

    return (
      <Select
        onOpenChange={(isOpen) => setNodeOptionsOpen(isOpen)}
        onSelect={() => {}}
        isOpen={nodeOptionsOpen}
        placeholder="Node options"
        toggle={nodeOptionsToggle}
      >
        {selectContent}
      </Select>
    );
  };

  const toggleNodeShape = (shape: NodeShape): void => {
    const index = nodeOptions.shapes.indexOf(shape);
    if (index >= 0) {
      setNodeOptions((prev) => ({
        ...prev,
        shapes: [...prev.shapes.slice(0, index), ...prev.shapes.slice(index + 1)]
      }));
    } else {
      setNodeOptions((prev) => ({
        ...prev,
        shapes: [...prev.shapes, shape]
      }));
    }
  };

  const renderNodeShapesDropdown = () => {
    const selectContent = (
      <SelectList>
        {NODE_SHAPES.map((shape) => (
          <SelectOption
            key={shape}
            value={shape}
            hasCheckbox
            isSelected={nodeOptions.shapes.includes(shape)}
            onClick={() => toggleNodeShape(shape)}
          >
            {shape}
          </SelectOption>
        ))}
      </SelectList>
    );

    const nodeShapesToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
      <MenuToggle
        ref={toggleRef}
        onClick={() => setNodeShapesOpen((prev) => !prev)}
        isExpanded={nodeShapesOpen}
        style={
          {
            width: '250px'
          } as React.CSSProperties
        }
      >
        Node shapes
      </MenuToggle>
    );

    return (
      <Select
        onOpenChange={(isOpen) => setNodeShapesOpen(isOpen)}
        onSelect={() => {}}
        isOpen={nodeShapesOpen}
        toggle={nodeShapesToggle}
      >
        {selectContent}
      </Select>
    );
  };

  const renderEdgeOptionsDropdown = () => {
    const selectContent = (
      <SelectList>
        <SelectOption
          value="Status"
          hasCheckbox
          isSelected={edgeOptions.edgeStatuses.length > 1}
          onClick={() =>
            setEdgeOptions((prev) => ({
              ...prev,
              edgeStatuses: prev.edgeStatuses.length > 1 ? DefaultEdgeOptions.edgeStatuses : NODE_STATUSES
            }))
          }
        >
          Status
        </SelectOption>
        <SelectOption
          value="Styles"
          hasCheckbox
          isSelected={edgeOptions.edgeStyles.length > 1}
          onClick={() =>
            setEdgeOptions((prev) => ({
              ...prev,
              edgeStyles: prev.edgeStyles.length > 1 ? DefaultEdgeOptions.edgeStyles : EDGE_STYLES
            }))
          }
        >
          Styles
        </SelectOption>
        <SelectOption
          value="Animations"
          hasCheckbox
          isSelected={edgeOptions.edgeAnimations.length > 1}
          onClick={() =>
            setEdgeOptions((prev) => ({
              ...prev,
              edgeAnimations: prev.edgeAnimations.length > 1 ? DefaultEdgeOptions.edgeAnimations : EDGE_ANIMATION_SPEEDS
            }))
          }
        >
          Animations
        </SelectOption>
        <SelectOption
          value="Terminal types"
          hasCheckbox
          isSelected={edgeOptions.terminalTypes.length > 1}
          onClick={() =>
            setEdgeOptions((prev) => ({
              ...prev,
              terminalTypes: prev.terminalTypes.length > 1 ? DefaultEdgeOptions.terminalTypes : EDGE_TERMINAL_TYPES
            }))
          }
        >
          Terminal type
        </SelectOption>
        <SelectOption
          value="Tags"
          hasCheckbox
          isSelected={edgeOptions.edgeTags}
          onClick={() => setEdgeOptions((prev) => ({ ...prev, edgeTags: !prev.edgeTags }))}
        >
          Tags
        </SelectOption>
      </SelectList>
    );
    const edgeOptionsToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
      <MenuToggle
        ref={toggleRef}
        onClick={() => setEdgeOptionsOpen((prev) => !prev)}
        isExpanded={edgeOptionsOpen}
        style={
          {
            width: '250px'
          } as React.CSSProperties
        }
      >
        Edge options
      </MenuToggle>
    );

    return (
      <Select
        onOpenChange={(isOpen) => setEdgeOptionsOpen(isOpen)}
        onSelect={() => {}}
        isOpen={edgeOptionsOpen}
        toggle={edgeOptionsToggle}
      >
        {selectContent}
      </Select>
    );
  };

  const saveModel = () => {
    setSavedModel(controller.toModel());
    setModelSaved(true);
    window.setTimeout(() => {
      setModelSaved(false);
    }, 2000);
  };

  const restoreLayout = () => {
    if (savedModel) {
      const currentModel = controller.toModel();
      currentModel.graph = {
        ...currentModel.graph,
        ..._.pick(savedModel.graph, GRAPH_LAYOUT_OPTIONS)
      };
      currentModel.nodes = currentModel.nodes.map((n) => {
        const savedNode = savedModel.nodes.find((sn) => sn.id === n.id);
        if (!savedNode) {
          return n;
        }
        return {
          ...n,
          ..._.pick(savedNode, NODE_LAYOUT_OPTIONS)
        };
      });
      controller.fromModel(currentModel, false);

      if (savedModel.graph.layout !== layout) {
        setLayout(savedModel.graph.layout);
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

  const updateValue = (value: number, min: number, max: number, setter: any): void => {
    if (value >= min && value <= max) {
      setter(value);
    }
  };

  const contextToolbar = (
    <>
      <ToolbarItem>
        <Flex wrap="no-wrap">
          <span>Nodes:</span>
          <TextInput
            aria-label="nodes"
            type="number"
            value={numNodes || ''}
            onChange={(_event, val: string) =>
              val ? updateValue(parseInt(val), 0, 9999, setNumNodes) : setNumNodes(null)
            }
          />
          <span>Edges:</span>
          <TextInput
            aria-label="edges"
            type="number"
            value={numEdges === null ? '' : numEdges}
            onChange={(_event, val: string) =>
              val ? updateValue(parseInt(val), 0, 200, setNumEdges) : setNumEdges(null)
            }
          />
          <span>Groups:</span>
          <TextInput
            aria-label="groups"
            type="number"
            value={numGroups === null ? '' : numGroups}
            onChange={(_event, val: string) =>
              val ? updateValue(parseInt(val), 0, 100, setNumGroups) : setNumGroups(null)
            }
          />
          <span>Nesting Depth:</span>
          <TextInput
            aria-label="nesting depth"
            type="number"
            value={nestedLevel === null ? '' : nestedLevel}
            onChange={(_event, val: string) =>
              val ? updateValue(parseInt(val), 0, 5, setNestedLevel) : setNestedLevel(null)
            }
          />
          <Button
            variant="link"
            isDisabled={numNodes === undefined || numNodes < 1 || numEdges === undefined || numGroups === undefined}
            onClick={() => setCreationCounts({ numNodes, numEdges, numGroups })}
          >
            Apply
          </Button>
        </Flex>
      </ToolbarItem>
      <ToolbarItem>{renderNodeOptionsDropdown()}</ToolbarItem>
      <ToolbarItem>{renderNodeShapesDropdown()}</ToolbarItem>
      <ToolbarItem>{renderEdgeOptionsDropdown()}</ToolbarItem>
    </>
  );

  const viewToolbar = (
    <>
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
      <ToolbarItem>
        <Flex wrap="no-wrap">
          <span id="med-scale">Medium Scale:</span>
          <TextInput
            aria-labelledby="med-scale"
            max={1.0}
            min={lowScale}
            step={0.01}
            value={medScale}
            type="number"
            onChange={(_event, val) => {
              const newValue = parseFloat(val);
              if (!Number.isNaN(newValue) && newValue > lowScale && newValue >= 0.01 && newValue <= 1.0) {
                setMedScale(parseFloat(val));
              }
            }}
          />
          <span id="low-scale">Low Scale:</span>
          <TextInput
            aria-labelledby="low-scale"
            max={medScale}
            min={0.01}
            step={0.01}
            value={lowScale}
            type="number"
            onChange={(_event, val) => {
              const newValue = parseFloat(val);
              if (!Number.isNaN(newValue) && newValue < medScale && newValue >= 0.01 && newValue <= 1.0) {
                setLowScale(parseFloat(val));
              }
            }}
          />
        </Flex>
      </ToolbarItem>
    </>
  );

  return {
    layout,
    nodeOptions,
    edgeOptions,
    nestedLevel,
    creationCounts,
    medScale,
    lowScale,
    contextToolbar,
    viewToolbar
  };
};
