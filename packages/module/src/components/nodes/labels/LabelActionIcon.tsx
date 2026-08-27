import { forwardRef, useRef } from 'react';
import { useSize } from '../../../utils';
import { css } from '@patternfly/react-styles';
import styles from '../../../css/topology-components';
import { handleKeyboardSelection } from '../../../utils/accessibility-utils';

interface LabelActionIconProps {
  className?: string;
  icon: React.ReactElement;
  'aria-label'?: string;
  tabIndex?: number;
  onClick: (e: React.MouseEvent) => void;
  iconOffsetX?: number;
  iconOffsetY?: number;
  x: number;
  y: number;
  height: number;
  paddingX: number;
  paddingY: number;
}

const LabelActionIcon = forwardRef<SVGRectElement, LabelActionIconProps>(
  (
    {
      icon,
      onClick,
      'aria-label': ariaLabel,
      tabIndex = 0,
      className,
      x,
      y,
      paddingX,
      height,
      iconOffsetX = 0,
      iconOffsetY = 0
    },
    actionRef
  ) => {
    const [iconSize, iconRef] = useSize([icon, paddingX]);
    const clickRef = useRef(null);
    const iconWidth = iconSize?.width ?? 0;
    const iconHeight = iconSize?.height ?? 0;
    const iconY = (height - iconHeight) / 2;

    const classes = css(styles.topologyNodeActionIcon, className);

    const handleClick = (e: React.MouseEvent) => {
      if (onClick) {
        e.stopPropagation();
        onClick(e);
      }
    };

    return (
      <g className={classes} onClick={handleClick} ref={clickRef}>
        {iconSize && (
          <rect
            ref={actionRef}
            className={css(styles.topologyNodeActionIconBackground)}
            x={x}
            y={y}
            width={iconWidth + paddingX * 2}
            height={height}
            tabIndex={ariaLabel ? tabIndex : undefined}
            aria-label={ariaLabel}
            onKeyDown={handleKeyboardSelection(clickRef)}
            data-id="context-icon"
          />
        )}
        <g
          className={css(styles.topologyNodeActionIconIcon)}
          transform={`translate(${x + paddingX + iconOffsetX}, ${y + iconY + iconOffsetY})`}
          ref={iconRef}
        >
          {icon}
        </g>
      </g>
    );
  }
);

export default LabelActionIcon;
