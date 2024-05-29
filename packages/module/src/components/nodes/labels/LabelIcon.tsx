import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '../../../css/topology-components';

interface LabelIconProps {
  className?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  padding?: number;
  iconClass?: string;
  icon?: React.ReactNode;
  innerRef?: React.Ref<SVGGElement>;
}

const LabelIcon = React.forwardRef<SVGCircleElement, LabelIconProps>(
  ({ className, x, y, width, height, iconClass, icon, padding = 4, innerRef }, circleRef) => {
    const radius = width / 2;
    const cx = x - radius;
    const cy = y + height / 2;
    const innerX = x - width + padding + 1;
    const innerY = y + padding + 1;
    const innerWidth = width - padding * 2 - 2; // -2 for 1px border on each side
    const innerHeight = height - padding * 2 - 2; // -2 for 1px border on each side

    return (
      <g className={css(styles.topologyNodeLabelIcon, className)} ref={innerRef}>
        <circle className={css(styles.topologyNodeLabelIconBackground)} ref={circleRef} cx={cx} cy={cy} r={radius} />
        {icon ? (
          <foreignObject
            className={css(styles.topologyNodeLabelIcon)}
            x={innerX}
            y={innerY}
            width={Math.max(innerWidth, 0)}
            height={Math.max(innerHeight, 0)}
          >
            {icon}
          </foreignObject>
        ) : (
          <image
            x={innerX}
            y={innerY}
            width={Math.max(innerWidth, 0)}
            height={Math.max(innerHeight, 0)}
            xlinkHref={iconClass}
          />
        )}
      </g>
    );
  }
);

export default LabelIcon;
