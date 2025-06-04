import { useContext } from 'react';
import { Radio, Content, ToolbarItem } from '@patternfly/react-core';
import { observer } from '@patternfly/react-topology';
import { PipelineGroupsDemoContext } from './PipelineGroupsDemoContext';

const OptionsBar: React.FC = observer(() => {
  const pipelineOptions = useContext(PipelineGroupsDemoContext);

  return (
    <>
      <ToolbarItem>
        <Content className="pf-u-mr-sm">Layout:</Content>
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
