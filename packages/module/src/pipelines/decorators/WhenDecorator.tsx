import * as React from 'react';
import { Tooltip } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import styles from '../../css/topology-pipelines';
import topologyStyles from '../../css/topology-components';
import { observer } from '../../mobx-exports';
import { GraphElement, Node } from '../../types';
import { WhenStatus } from '../types';
import { OnSelect } from '../../behavior';
import { getWhenStatusModifier } from '../utils';
import { DagreLayoutOptions, TOP_TO_BOTTOM } from '../../layouts';

export const DEFAULT_WHEN_SIZE = 12;
export const DEFAULT_WHEN_OFFSET = 12;

interface WhenDecoratorProps {
  /** Additional classes added to the node */
  className?: string;
  /** The graph node element to represent */
  element: GraphElement;
  /** Offset distance from the start of the node area  (horizontal layout only) */
  leftOffset?: number;
  /** Offset distance from the start of the node area  (vertical layout only) */
  topOffset?: number;
  /** Length of the edge between the when decorator and the node */
  edgeLength?: number;
  /** Width of the when decorator */
  width?: number;
  /** Height of the when decorator */
  height?: number;
  /** @deprecated Additional classes added to the label */
  nameLabelClass?: string;
  /** WhenStatus to depict */
  status?: WhenStatus;
  /** Flag indicating the status indicator */
  showStatusState?: boolean;
  /** Flag if the tooltip is disabled */
  disableTooltip?: boolean;
  /** Tooltip to show on decorator hover */
  toolTip?: React.ReactNode;
  /** Flag if the element selected. Part of WithSelectionProps */
  selected?: boolean;
  /** Function to call when the element should become selected (or deselected). Part of WithSelectionProps */
  onSelect?: OnSelect;
}

export const WhenDecorator: React.FC<WhenDecoratorProps> = observer(({
  element,
  width = DEFAULT_WHEN_SIZE,
  height = DEFAULT_WHEN_SIZE,
  className,
  status,
  leftOffset = DEFAULT_WHEN_OFFSET,
  topOffset = DEFAULT_WHEN_OFFSET,
  edgeLength = DEFAULT_WHEN_OFFSET,
  toolTip,
  disableTooltip = false
}: WhenDecoratorProps) => {
  const nodeElement = element as Node;
  const diamondNodeRef = React.useRef();
  const { height: taskHeight, width: taskWidth } = nodeElement.getBounds();
  const verticalLayout = (element.getGraph().getLayoutOptions?.() as DagreLayoutOptions)?.rankdir === TOP_TO_BOTTOM;

  const points = React.useMemo(() => {
    if (verticalLayout) {
      const y = -topOffset;
      const startX = taskWidth / 2;

      return `
        ${startX} ${y}
        ${startX - width / 2} ${y - height / 2}
        ${startX} ${y - height}
        ${startX + width / 2} ${y - height / 2}
      `;
    }
    const y = taskHeight / 2 - height / 2;
    const startX = -width - leftOffset;

    return `
      ${startX + width / 2} ${y}
      ${startX + width} ${y + height / 2}
      ${startX + width / 2} ${y + height}
      ${startX} ${y + height / 2}
    `;
  }, [height, leftOffset, taskHeight, taskWidth, topOffset, verticalLayout, width]);

  const linePoints = verticalLayout ? {
    x1: taskWidth / 2,
    y1: -topOffset,
    x2: taskWidth / 2,
    y2: -topOffset + edgeLength,
  } : {
    x1: -leftOffset,
    y1: taskHeight / 2,
    x2: -leftOffset + edgeLength,
    y2: taskHeight / 2
  };
  const diamondNode = (
    <g className={className} ref={diamondNodeRef}>
      <line
        className={css(topologyStyles.topologyEdgeBackground)}
        {...linePoints}
      />
      <line
        className={css(topologyStyles.topologyEdge, styles.topologyPipelinesWhenExpressionEdge)}
        {...linePoints}
      />
      <polygon
        data-test="diamond-decorator"
        className={css(styles.topologyPipelinesWhenExpressionBackground, getWhenStatusModifier(status))}
        points={points}
      />
    </g>
  );

  return toolTip && !disableTooltip ? (
    <Tooltip triggerRef={diamondNodeRef} position="bottom" enableFlip={false} content={<div data-test="when-expression-tooltip">{toolTip}</div>}>
      {diamondNode}
    </Tooltip>
  ) : (
    diamondNode
  );
});
WhenDecorator.displayName = 'WhenDecorator';

export default WhenDecorator;
