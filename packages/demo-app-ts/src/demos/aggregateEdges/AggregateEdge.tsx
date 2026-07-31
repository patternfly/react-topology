import { FunctionComponent } from 'react';
import { observer } from 'mobx-react';
import { AggregateEdgeRole, DefaultAggregatedEdge, GraphElement, WithSelectionProps } from '@patternfly/react-topology';
import { useAggregateEdgesDemo } from './DemoContext';

type AggregateEdgeProps = {
  element: GraphElement;
} & WithSelectionProps;

/**
 * Demo wrapper around DefaultAggregatedEdge: maps model data + demo toolbar
 * options into explicit props (apps can derive these differently).
 *
 * Intentionally omits `onSelect` from `withSelection` so path multi-select from
 * DefaultAggregatedEdge is not overwritten by single-id selection.
 */
const AggregateEdge: FunctionComponent<AggregateEdgeProps> = observer(({ element, selected }) => {
  const { snapGeneration, showEdgeLabels, showMetricTags } = useAggregateEdgesDemo();
  const data = element.getData() || {};
  const role = data.role as AggregateEdgeRole | undefined;
  const count = data.count as number | undefined;
  const bidirectional = data.bidirectional as boolean | undefined;
  const forwardEdgeIds = data.forwardEdgeIds as string[] | undefined;
  const reverseEdgeIds = data.reverseEdgeIds as string[] | undefined;

  const edgeLabel = showEdgeLabels ? element.getLabel() : undefined;
  const metricTag = showMetricTags ? (data.tag as string | undefined) : undefined;
  // Only override the default count tag when the demo toolbar opts into labels/metrics.
  const tag = edgeLabel || metricTag;

  return (
    <DefaultAggregatedEdge
      element={element}
      selected={selected}
      role={role}
      count={count}
      bidirectional={bidirectional}
      forwardEdgeIds={forwardEdgeIds}
      reverseEdgeIds={reverseEdgeIds}
      snapGeneration={snapGeneration}
      {...(tag ? { tag } : {})}
    />
  );
});

export default AggregateEdge;
