import { forwardRef } from 'react';
import RhUiEllipsisVerticalFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-ellipsis-vertical-fill-icon';
import { WithContextMenuProps } from '../../../behavior';
import LabelActionIcon from './LabelActionIcon';

type LabelContextMenuProps = {
  className?: string;
  x: number;
  y: number;
  height: number;
  paddingX: number;
  paddingY: number;
} & WithContextMenuProps;

const LabelContextMenu = forwardRef<SVGRectElement, LabelContextMenuProps>(
  ({ onContextMenu, className, x, y, paddingX, paddingY, height }, menuRef) => (
    <LabelActionIcon
      ref={menuRef}
      icon={<RhUiEllipsisVerticalFillIcon />}
      iconOffsetX={-6}
      className={className}
      onClick={onContextMenu}
      x={x}
      y={y}
      height={height}
      paddingX={paddingX}
      paddingY={paddingY}
    />
  )
);

export default LabelContextMenu;
