import React from 'react';
import { Checkbox, ToolbarItem } from '@patternfly/react-core';
import { observer } from '@patternfly/react-topology';
import { PipelineDemoContext } from './PipelineDemoContext';

const PipelineOptionsBar: React.FC<{ isLayout?: boolean }> = observer(({ isLayout = false }) => {
  const pipelineOptions = React.useContext(PipelineDemoContext);

  return (
    <>
      <ToolbarItem>
        <Checkbox
          id="icons-switch"
          isChecked={pipelineOptions.showIcons}
          onChange={(_event, checked) => pipelineOptions.setShowIcons(checked)}
          label="Show icons"
        />
      </ToolbarItem>
      <ToolbarItem>
        <Checkbox
          id="badges-switch"
          isChecked={pipelineOptions.showBadges}
          onChange={(_event, checked) => pipelineOptions.setShowBadges(checked)}
          label="Show badges"
        />
      </ToolbarItem>
      <ToolbarItem>
        <Checkbox
          id="tooltips-switch"
          isChecked={pipelineOptions.showBadgeTooltips}
          onChange={(_event, checked) => pipelineOptions.setShowBadgeTooltips(checked)}
          label="Badge tooltips"
        />
      </ToolbarItem>
      <ToolbarItem>
        <Checkbox
          id="menus-switch"
          isChecked={pipelineOptions.showContextMenus}
          onChange={(_event, checked) => pipelineOptions.setShowContextMenus(checked)}
          label="Context menus"
        />
      </ToolbarItem>
      <ToolbarItem>
        <Checkbox
          id="terminal-switch"
          isChecked={pipelineOptions.showTerminalType}
          onChange={(_event, checked) => pipelineOptions.setShowTerminalType(checked)}
          label="Directional edges"
        />
      </ToolbarItem>
      {isLayout ? (
        <>
          <ToolbarItem>
            <Checkbox
              id="groups-switch"
              isChecked={pipelineOptions.showGroups}
              onChange={(_event, checked) => pipelineOptions.setShowGroups(checked)}
              label="Show groups"
            />
          </ToolbarItem>
          <ToolbarItem>
            <Checkbox
              id="vertical-switch"
              isChecked={pipelineOptions.verticalLayout}
              onChange={(_event, checked) => pipelineOptions.setVerticalLayout(checked)}
              label="Vertical layout"
            />
          </ToolbarItem>
        </>
      ) : null}
    </>
  );
});

export default PipelineOptionsBar;
