import React from 'react';
import { Radio, Text, ToolbarItem } from '@patternfly/react-core';
import { observer } from '@patternfly/react-topology';
import { PipelineGroupsDemoContext } from './PipelineGroupsDemoContext';

const OptionsBar: React.FC = observer(() => {
  const pipelineOptions = React.useContext(PipelineGroupsDemoContext);

  return (
    <>
      <ToolbarItem>
        <Text className="pf-u-mr-sm">Layout:</Text>
      </ToolbarItem>
      <ToolbarItem>
        <Radio
          id="vertical-layout-radio"
          name="verticalLayout"
          isChecked={pipelineOptions.verticalLayout}
          onChange={() => pipelineOptions.setVerticalLayout(true)}
          label="Vertical"
        />
      </ToolbarItem>
      <ToolbarItem>
        <Radio
          id="horizontal-layout-radio"
          name="horizontalLayout"
          isChecked={!pipelineOptions.verticalLayout}
          onChange={() => pipelineOptions.setVerticalLayout(false)}
          label="Horizontal"
        />
      </ToolbarItem>
    </>
  );
});

export default OptionsBar;
