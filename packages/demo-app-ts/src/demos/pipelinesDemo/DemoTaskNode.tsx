import * as React from 'react';
import { observer } from 'mobx-react';
import {
  DEFAULT_LAYER,
  DEFAULT_WHEN_OFFSET,
  DEFAULT_WHEN_SIZE,
  GraphElement,
  Layer,
  Node,
  ScaleDetailsLevel,
  TaskNode,
  TOP_LAYER,
  useHover,
  WhenDecorator,
  WithContextMenuProps,
  WithSelectionProps
} from '@patternfly/react-topology';
import { PopoverProps } from '@patternfly/react-core';
import { CubeIcon } from '@patternfly/react-icons/dist/esm/icons/cube-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { logos } from '../../utils/logos';
import { PipelineDemoContext } from './PipelineDemoContext';

type DemoTaskNodeProps = {
  element: GraphElement;
} & WithContextMenuProps &
  WithSelectionProps;

const DEMO_TIP_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id feugiat augue, nec fringilla turpis.';

const getLeadIcon = (taskJobType: string) => {
  switch (taskJobType) {
    case 'cubes':
      return <CubeIcon width={16} height={16} />;
    case 'link':
      return <ExternalLinkAltIcon width={16} height={16} />;
    default:
      return null;
  }
};

const DemoTaskNode: React.FunctionComponent<DemoTaskNodeProps> = ({
  element,
  onContextMenu,
  contextMenuOpen,
  ...rest
}) => {
  const pipelineOptions = React.useContext(PipelineDemoContext);
  const nodeElement = element as Node;
  const data = element.getData();
  const [hover, hoverRef] = useHover();
  const detailsLevel = element.getGraph().getDetailsLevel();

  const whenDecorator = data.whenStatus ? (
    <WhenDecorator
      element={element}
      status={data.whenStatus}
      leftOffset={
        pipelineOptions.showIcons
          ? DEFAULT_WHEN_OFFSET + (nodeElement.getBounds().height - 4) * 0.75
          : DEFAULT_WHEN_OFFSET
      }
    />
  ) : null;

  // Set the badgePopoverParams, but if the node has badgeTooltips, this will be ignored
  const badgePopoverParams: PopoverProps = {
    headerContent: 'Popover header',
    bodyContent: DEMO_TIP_TEXT,
    footerContent: 'Popover footer'
  };

  return (
    <Layer id={detailsLevel !== ScaleDetailsLevel.high && (hover || contextMenuOpen) ? TOP_LAYER : DEFAULT_LAYER}>
      <g ref={hoverRef}>
        <TaskNode
          element={element}
          onContextMenu={pipelineOptions.showContextMenus ? onContextMenu : undefined}
          contextMenuOpen={contextMenuOpen}
          scaleNode={(hover || contextMenuOpen) && detailsLevel !== ScaleDetailsLevel.high}
          status={data.status}
          hideDetailsAtMedium
          leadIcon={getLeadIcon(data.taskJobType)}
          customStatusIcon={data.customStatusIcon}
          taskIconClass={pipelineOptions.showIcons ? logos.get('icon-java') : undefined}
          taskIconTooltip={pipelineOptions.showIcons ? 'Environment' : undefined}
          badge={pipelineOptions.showBadges ? data.taskProgress : undefined}
          badgePopoverParams={pipelineOptions.showBadgeTooltips ? undefined : badgePopoverParams}
          badgeTooltip={pipelineOptions.showBadgeTooltips ? DEMO_TIP_TEXT : undefined}
          whenOffset={data.whenStatus ? DEFAULT_WHEN_OFFSET : 0}
          whenSize={data.whenStatus ? DEFAULT_WHEN_SIZE : 0}
          {...rest}
        >
          {whenDecorator}
        </TaskNode>
      </g>
    </Layer>
  );
};

export default observer(DemoTaskNode);
