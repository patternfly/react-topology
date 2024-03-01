import * as React from 'react';
import {
  DefaultGroup,
  GraphElement,
  Node,
  observer,
  ScaleDetailsLevel,
  WithContextMenuProps,
  WithDragNodeProps,
  WithSelectionProps
} from '@patternfly/react-topology';
import AlternateIcon from '@patternfly/react-icons/dist/esm/icons/regions-icon';
import DefaultIcon from '@patternfly/react-icons/dist/esm/icons/builder-image-icon';
import { DemoContext } from './DemoContext';
import { DataTypes, DEFAULT_NODE_SIZE } from './generator';

const ICON_PADDING = 20;

type DemoGroupProps = {
  element: GraphElement;
} & WithContextMenuProps &
  WithDragNodeProps &
  WithSelectionProps;

const DemoGroup: React.FunctionComponent<DemoGroupProps> = ({
  element,
  onContextMenu,
  ...rest
}) => {
  const options = React.useContext(DemoContext).nodeOptions;
  const groupElement = element as Node;
  const data = element.getData();
  const detailsLevel = element.getGraph().getDetailsLevel();

  const getTypeIcon = (dataType?: DataTypes): any => {
    switch (dataType) {
      case DataTypes.Alternate:
        return AlternateIcon;
      default:
        return DefaultIcon;
    }
  };

  const renderIcon = (): React.ReactNode => {
    const iconSize = Math.min(DEFAULT_NODE_SIZE, DEFAULT_NODE_SIZE) - ICON_PADDING * 2;
    const Component = getTypeIcon(data.dataType);

    return (
      <g transform={`translate(${(DEFAULT_NODE_SIZE - iconSize) / 2}, ${(DEFAULT_NODE_SIZE - iconSize) / 2})`}>
        <Component style={{ color: '#393F44' }} width={iconSize} height={iconSize} />
      </g>
    );
  };

   return (
    <DefaultGroup
      {...rest}
      onContextMenu={data.showContextMenu ? onContextMenu : undefined}
      element={element}
      collapsible
      collapsedWidth={DEFAULT_NODE_SIZE}
      collapsedHeight={DEFAULT_NODE_SIZE}
      showLabel={detailsLevel === ScaleDetailsLevel.high}
      hulledOutline={options.hulledOutline}
    >
      {groupElement.isCollapsed() ? renderIcon() : null}
    </DefaultGroup>
  );
};

export default observer(DemoGroup);
