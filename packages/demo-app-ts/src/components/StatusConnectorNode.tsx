import * as React from 'react';
import { observer } from 'mobx-react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-topology/dist/esm/css/topology-components';
import {
  AnchorEnd,
  GraphElement,
  Node,
  Rectangle,
  useCombineRefs,
  useSize,
} from '@patternfly/react-topology';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { useSourceStatusAnchor } from './useSourceStatusAnchor';
import { useTargetStatusAnchor } from './useTargetStatusAnchor';

const paddingX = 8;
const paddingY = 8;
const STATUS_RADIUS = 8;
const STATUS_PADDING = 2;

interface StatusConnectorNodeProps {
  element: GraphElement;
}

const StatusConnectorNode: React.FunctionComponent<StatusConnectorNodeProps> = ({ element }) => {
  const nodeElement = element as Node;
  const label = element.getLabel();
  const [textSize, textRef] = useSize([label]);
  const [secondarySize, secondaryRef] = useSize([label]);
  const successTargetRef = useTargetStatusAnchor(AnchorEnd.target, 'success-edge', -2);
  const failedTargetRef = useTargetStatusAnchor(AnchorEnd.target, 'failed-edge', 2);
  const targetRef = useCombineRefs(successTargetRef, failedTargetRef);
  const successRef = useSourceStatusAnchor(AnchorEnd.source, 'success-edge');
  const failedRef = useSourceStatusAnchor(AnchorEnd.source, 'failed-edge');

  const textWidth = textSize?.width ?? 0;
  const textHeight = textSize?.height ?? 0;
  const secondaryWidth = secondarySize?.width ?? 0;
  const secondaryHeight = secondarySize?.height ?? 0;

  const {
    height,
    textStartX,
    width,
  } = React.useMemo(() => {
    if (!textSize) {
      return {
        height: 0,
        textStartX: 0,
        width: 0,
      };
    }
    const textStartX = paddingX;

    const textSpace = Math.max(textWidth, secondaryWidth);

    const width = paddingX + textSpace + paddingX * 2;
    const secondaryStartY = paddingY + textHeight + paddingY / 2;

    const height: number = secondaryStartY + secondaryHeight + paddingY;
    return {
      height,
      textStartX,
      width,
    };
  }, [textSize, textWidth, secondaryWidth, textHeight, secondaryHeight]);

  const nameLabel = (
    <text ref={textRef} dominantBaseline="middle">
      {label}
    </text>
  );

  const secondaryLabel = (
    <text ref={secondaryRef} transform={`translate(0, ${textHeight + paddingY / 2})`} className={css(styles.modifiers.secondary)} dominantBaseline="middle">
      {element.getData().secondaryLabel}
    </text>
  );

  const iconRadius = STATUS_RADIUS - STATUS_PADDING;

  const targetDecorator = (
    <g className={styles.topologyNodeDecorator}>
      <circle
        cx={0}
        cy={height / 2}
        r={STATUS_RADIUS}
        ref={targetRef}
        className={css(styles.topologyNodeDecoratorBg)}
      />
    </g>
  );
  const successDecorator = (
    <g className={styles.topologyNodeDecorator}>
      <circle
        cx={width}
        cy={height / 3}
        r={STATUS_RADIUS}
        ref={successRef}
        className={css(styles.topologyNodeDecoratorBg)}
      />
      <g
        transform={`translate(${width -iconRadius}, ${height / 3 - iconRadius})`}
        className={css(styles.topologyNodeDecoratorIcon)}
        style={{ fontSize: `${iconRadius * 2}px` }}
      >
        <g className={css(styles.topologyNodeDecoratorStatus)}>
          <CheckCircleIcon className="pf-m-success" />
        </g>
      </g>
    </g>
  );
  const failedDecorator = (
    <g className={styles.topologyNodeDecorator}>
      <circle
        cx={width}
        cy={height - height / 3}
        r={STATUS_RADIUS}
        ref={failedRef}
        className={css(styles.topologyNodeDecoratorBg)}
      />
      <g
        transform={`translate(${width -iconRadius}, ${height - height / 3 - iconRadius})`}
        className={css(styles.topologyNodeDecoratorIcon)}
        style={{ fontSize: `${iconRadius * 2}px` }}
      >
        <g className={css(styles.topologyNodeDecoratorStatus)}>
          <ExclamationCircleIcon className="pf-m-danger" />
        </g>
      </g>
    </g>
  );
  return (
    <g className={styles.topologyNode}>
      <Rectangle
        className={styles.topologyNodeBackground}
        element={nodeElement}
        width={width}
        height={height}
      />
      <g transform={`translate(${textStartX}, ${paddingY + textHeight / 2 + 1})`} className={styles.topologyNodeLabel}>
        {nameLabel}
        {secondaryLabel}
      </g>
      {targetDecorator}
      {successDecorator}
      {failedDecorator}
    </g>
  );
};

export default observer(StatusConnectorNode);
