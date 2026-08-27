import {
  DefaultTaskGroup,
  GraphElement,
  LabelPosition,
  observer,
  WithContextMenuProps,
  WithDragNodeProps,
  WithSelectionProps
} from '@patternfly/react-topology';
import { DEFAULT_TASK_HEIGHT, DEFAULT_TASK_WIDTH } from './useDemoPipelineNodes';

type DemoPipelinesGroupProps = {
  element: GraphElement;
} & WithContextMenuProps &
  WithDragNodeProps &
  WithSelectionProps;

const DemoPipelinesGroup: React.FunctionComponent<DemoPipelinesGroupProps> = ({ element, ...rest }) => {
  const data = element.getData();

  return (
    <DefaultTaskGroup
      element={element}
      tabIndex={data?.tabIndex}
      collapsible
      collapsedWidth={DEFAULT_TASK_WIDTH}
      collapsedHeight={DEFAULT_TASK_HEIGHT}
      labelPosition={LabelPosition.top}
      showLabelOnHover
      hideDetailsAtMedium
      badge={data?.badge}
      {...rest}
    />
  );
};

export default observer(DemoPipelinesGroup);
