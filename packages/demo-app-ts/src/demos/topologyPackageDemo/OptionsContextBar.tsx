import React from 'react';
import {
  Button,
  Flex,
  FlexItem,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectOption,
  SelectList,
  TextInput,
  ToolbarItem
} from '@patternfly/react-core';
import { observer } from '@patternfly/react-topology';
import { DemoContext } from './DemoContext';

const OptionsContextBar: React.FC = observer(() => {
  const options = React.useContext(DemoContext);
  const [nodeOptionsOpen, setNodeOptionsOpen] = React.useState<boolean>(false);
  const [edgeOptionsOpen, setEdgeOptionsOpen] = React.useState<boolean>(false);
  const [numNodes, setNumNodes] = React.useState<number>(options.creationCounts.numNodes);
  const [numEdges, setNumEdges] = React.useState<number>(options.creationCounts.numEdges);
  const [numGroups, setNumGroups] = React.useState<number>(options.creationCounts.numGroups);
  const [nestedLevel, setNestedLevel] = React.useState<number>(options.creationCounts.nestedLevel);

  const renderNodeOptionsDropdown = () => {
    const nodeOptionsToggle = (toggleRef: React.Ref<MenuToggleElement>) => (
      <MenuToggle
        ref={toggleRef}
        onClick={() => setNodeOptionsOpen((prev) => !prev)}
        isExpanded={nodeOptionsOpen}
        style={
          {
            width: '180px'
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
        <SelectList>
          <SelectOption
            hasCheckbox
            value="Labels"
            isSelected={options.nodeOptions.labels}
            onClick={() => options.setNodeOptions({ ...options.nodeOptions, labels: !options.nodeOptions.labels })}
          >
            Labels
          </SelectOption>
          <SelectOption
            hasCheckbox
            value="Secondary Labels"
            isSelected={options.nodeOptions.secondaryLabels}
            onClick={() =>
              options.setNodeOptions({ ...options.nodeOptions, secondaryLabels: !options.nodeOptions.secondaryLabels })
            }
          >
            Secondary Labels
          </SelectOption>
          <SelectOption
            hasCheckbox
            value="Status"
            isSelected={options.nodeOptions.showStatus}
            onClick={() =>
              options.setNodeOptions({ ...options.nodeOptions, showStatus: !options.nodeOptions.showStatus })
            }
          >
            Status
          </SelectOption>
          <SelectOption
            hasCheckbox
            value="Decorators"
            isSelected={options.nodeOptions.showDecorators}
            onClick={() =>
              options.setNodeOptions({
                ...options.nodeOptions,
                showDecorators: !options.nodeOptions.showDecorators
              })
            }
          >
            Decorators
          </SelectOption>
          <SelectOption
            hasCheckbox
            value="Badges"
            isSelected={options.nodeOptions.badges}
            onClick={() => options.setNodeOptions({ ...options.nodeOptions, badges: !options.nodeOptions.badges })}
          >
            Badges
          </SelectOption>
          <SelectOption
            hasCheckbox
            value="Icons"
            isSelected={options.nodeOptions.icons}
            onClick={() => options.setNodeOptions({ ...options.nodeOptions, icons: !options.nodeOptions.icons })}
          >
            Icons
          </SelectOption>
          <SelectOption
            hasCheckbox
            value="Shapes"
            isSelected={options.nodeOptions.showShapes}
            onClick={() =>
              options.setNodeOptions({ ...options.nodeOptions, showShapes: !options.nodeOptions.showShapes })
            }
          >
            Shapes
          </SelectOption>
          <SelectOption
            hasCheckbox
            value="Context Menus"
            isSelected={options.nodeOptions.contextMenus}
            onClick={() =>
              options.setNodeOptions({ ...options.nodeOptions, contextMenus: !options.nodeOptions.contextMenus })
            }
          >
            Context Menus
          </SelectOption>
          <SelectOption
            hasCheckbox
            value="Hide context kebab menu"
            isSelected={options.nodeOptions.hideKebabMenu}
            isDisabled={!options.nodeOptions.contextMenus}
            onClick={() =>
              options.setNodeOptions({ ...options.nodeOptions, hideKebabMenu: !options.nodeOptions.hideKebabMenu })
            }
          >
            Hide kebab for context menu
          </SelectOption>
          <SelectOption
            hasCheckbox
            value="Rectangle Groups"
            isSelected={!options.nodeOptions.hulledOutline}
            onClick={() =>
              options.setNodeOptions({ ...options.nodeOptions, hulledOutline: !options.nodeOptions.hulledOutline })
            }
          >
            Rectangle Groups
          </SelectOption>
        </SelectList>
      </Select>
    );
  };

  const renderEdgeOptionsDropdown = () => {
    const selectContent = (
      <SelectList>
        <SelectOption
          value="Status"
          hasCheckbox
          isSelected={options.edgeOptions.showStatus}
          onClick={() =>
            options.setEdgeOptions({ ...options.edgeOptions, showStatus: !options.edgeOptions.showStatus })
          }
        >
          Status
        </SelectOption>
        <SelectOption
          value="Styles"
          hasCheckbox
          isSelected={options.edgeOptions.showStyles}
          onClick={() =>
            options.setEdgeOptions({ ...options.edgeOptions, showStyles: !options.edgeOptions.showStyles })
          }
        >
          Styles
        </SelectOption>
        <SelectOption
          value="Animations"
          hasCheckbox
          isSelected={options.edgeOptions.showAnimations}
          onClick={() =>
            options.setEdgeOptions({ ...options.edgeOptions, showAnimations: !options.edgeOptions.showAnimations })
          }
        >
          Animations
        </SelectOption>
        <SelectOption
          value="Terminal types"
          hasCheckbox
          isSelected={options.edgeOptions.terminalTypes}
          onClick={() =>
            options.setEdgeOptions({ ...options.edgeOptions, terminalTypes: !options.edgeOptions.terminalTypes })
          }
        >
          Terminal type
        </SelectOption>
        <SelectOption
          value="Tags"
          hasCheckbox
          isSelected={options.edgeOptions.showTags}
          onClick={() => options.setEdgeOptions({ ...options.edgeOptions, showTags: !options.edgeOptions.showTags })}
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
            width: '180px'
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

  const updateValue = (value: number, min: number, max: number, setter: any): void => {
    if (value >= min && value <= max) {
      setter(value);
    }
  };

  return (
    <Flex>
      <ToolbarItem>
        <Flex flexWrap={{ default: 'wrap' }} gap={{ default: 'gapMd' }}>
          <FlexItem>
            <Flex flexWrap={{ default: 'nowrap' }} gap={{ default: 'gapXs' }}>
              <span>Nodes:</span>
              <TextInput
                aria-label="nodes"
                type="number"
                value={numNodes || ''}
                onChange={(_event, val: string) =>
                  val ? updateValue(parseInt(val), 0, 9999, setNumNodes) : setNumNodes(null)
                }
              />
            </Flex>
          </FlexItem>
          <FlexItem>
            <Flex flexWrap={{ default: 'nowrap' }} gap={{ default: 'gapXs' }}>
              <span>Edges:</span>
              <TextInput
                aria-label="edges"
                type="number"
                value={numEdges === null ? '' : numEdges}
                onChange={(_event, val: string) =>
                  val ? updateValue(parseInt(val), 0, 200, setNumEdges) : setNumEdges(null)
                }
              />
            </Flex>
          </FlexItem>
          <FlexItem>
            <Flex flexWrap={{ default: 'nowrap' }} gap={{ default: 'gapXs' }}>
              <span>Groups:</span>
              <TextInput
                aria-label="groups"
                type="number"
                value={numGroups === null ? '' : numGroups}
                onChange={(_event, val: string) =>
                  val ? updateValue(parseInt(val), 0, 100, setNumGroups) : setNumGroups(null)
                }
              />
            </Flex>
          </FlexItem>
          <FlexItem>
            <Flex flexWrap={{ default: 'nowrap' }} gap={{ default: 'gapXs' }}>
              <span>Nesting Depth:</span>
              <TextInput
                aria-label="nesting depth"
                type="number"
                value={nestedLevel === null ? '' : nestedLevel}
                onChange={(_event, val: string) =>
                  val ? updateValue(parseInt(val), 0, 5, setNestedLevel) : setNestedLevel(null)
                }
              />
            </Flex>
          </FlexItem>
          <FlexItem>
            <Button
              variant="link"
              isDisabled={numNodes === undefined || numNodes < 1 || numEdges === undefined || numGroups === undefined}
              onClick={() => options.setCreationCounts({ numNodes, numEdges, numGroups, nestedLevel })}
            >
              Apply
            </Button>
          </FlexItem>
        </Flex>
      </ToolbarItem>
      <ToolbarItem>
        <Flex gap={{ default: 'gapMd' }}>
          {renderNodeOptionsDropdown()}
          {renderEdgeOptionsDropdown()}
        </Flex>
      </ToolbarItem>
    </Flex>
  );
});

export default OptionsContextBar;
