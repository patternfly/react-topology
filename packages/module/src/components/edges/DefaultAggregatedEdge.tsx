import { FunctionComponent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import {
  Edge,
  EdgeTerminalType,
  GRAPH_LAYOUT_END_EVENT,
  GraphLayoutEndEventListener,
  isEdge,
  isNode
} from '../../types';
import { AggregateEdgeRole } from '../../utils/createAggregateEdges';
import { SELECTION_STATE } from '../../behavior';
import { useEventListener } from '../../hooks';
import DefaultEdge, { DefaultEdgeProps } from './DefaultEdge';
import {
  AGGREGATE_HULL_SETTLE_MS,
  AGGREGATE_HULL_SNAP_THRESHOLD,
  AGGREGATE_MOVE_SNAP_THRESHOLD,
  boundsKey,
  findRelatedBridge,
  getBridgeTerminalPresentation,
  getSelectionFocusLeaves,
  MUTED_TERMINAL_CLASS,
  selectRelatedAggregateSegments,
  snapAggregateEdge
} from './aggregateEdgeUtils';

export interface DefaultAggregatedEdgeProps extends DefaultEdgeProps {
  /**
   * Segment role (`exit` / `bridge` / `entry`). Typically from `createAggregateEdges`
   * edge data, but apps may supply an equivalent.
   */
  role?: AggregateEdgeRole | string;
  /**
   * Number of leaf edges folded into this segment. Used for the default bridge tag
   * when {@link DefaultAggregatedEdgeProps.tag} is omitted.
   */
  count?: number;
  /** When true, the bridge shows terminals on both ends. */
  bidirectional?: boolean;
  /** Leaf edge ids flowing in the bridge's stored orientation. */
  forwardEdgeIds?: string[];
  /** Leaf edge ids flowing opposite the bridge orientation. */
  reverseEdgeIds?: string[];
  /**
   * Bump after structural changes (e.g. group collapse / model rebuild) that leave
   * fixed endpoints stale without enough bound change to re-trigger snap.
   * Layout end is handled internally via {@link GRAPH_LAYOUT_END_EVENT}.
   */
  snapGeneration?: number;
}

/**
 * Default renderer for edges produced by {@link createAggregateEdges} with
 * `groupEdges` (exit / bridge / entry roles).
 *
 * Handles:
 * - Snapping endpoints to group outlines while layout moves, then refining after settle
 * - Force-resnap after layout end (and optionally via {@link DefaultAggregatedEdgeProps.snapGeneration})
 * - Multi-segment path selection by shared `aggregatedEdgeIds`
 * - Bidirectional bridge terminals, muting the opposite arrow when selection is one-way
 *
 * Aggregate metadata (`role`, `count`, `bidirectional`, …) is passed as props so apps
 * can derive or override them instead of reading a fixed `element.getData()` shape.
 *
 * Extends {@link DefaultEdgeProps} and forwards remaining props to {@link DefaultEdge}.
 *
 * **Selection:** path click fires `SELECTION_EVENT` with all related segment ids
 * (it does not write controller selection state). Wire that event into controlled
 * selection — e.g. `VisualizationSurface state={{ selectedIds }}` — and do **not**
 * forward `withSelection`'s `onSelect` into this component (it would collapse the
 * path selection back to the clicked edge id). Optional `onSelect` still runs after
 * path select for app-specific side effects.
 */
const DefaultAggregatedEdge: FunctionComponent<DefaultAggregatedEdgeProps> = observer(
  ({
    element,
    selected,
    onSelect,
    role,
    count,
    bidirectional,
    forwardEdgeIds,
    reverseEdgeIds,
    snapGeneration = 0,
    tag: tagProp,
    startTerminalType: startTerminalTypeProp,
    endTerminalType: endTerminalTypeProp,
    startTerminalClass: startTerminalClassProp,
    endTerminalClass: endTerminalClassProp,
    ...rest
  }) => {
    const edge = isEdge(element) ? (element as Edge) : null;
    const [layoutSnapGeneration, setLayoutSnapGeneration] = useState(0);

    const onLayoutEnd = useCallback<GraphLayoutEndEventListener>(() => {
      if (!edge?.hasController()) {
        return;
      }
      action(() => {
        edge.setStartPoint();
        edge.setEndPoint();
      })();
      setLayoutSnapGeneration((g) => g + 1);
    }, [edge]);

    // Clear this edge's fixed endpoints and force-resnap when Cola (etc.) finishes.
    // Mid-layout snaps often leave stubs/bridges pointing at stale hulls.
    useEventListener(GRAPH_LAYOUT_END_EVENT, onLayoutEnd);

    const sourceNode = edge?.getSource();
    const targetNode = edge?.getTarget();

    let geoKey = '';
    if (edge && sourceNode && targetNode && isNode(sourceNode) && isNode(targetNode)) {
      geoKey = `${boundsKey(sourceNode)}|${boundsKey(targetNode)}`;
      if (role === 'exit' || role === 'entry') {
        const bridge = findRelatedBridge(edge);
        if (bridge) {
          geoKey += `|${boundsKey(bridge.getSource())}|${boundsKey(bridge.getTarget())}`;
        }
      }
    }

    const effectiveSnapGeneration = snapGeneration + layoutSnapGeneration;
    const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rafRef = useRef(0);
    const lastSnapGenerationRef = useRef(effectiveSnapGeneration);

    useEffect(() => {
      if (!edge?.hasController()) {
        return undefined;
      }
      if (role !== 'bridge' && role !== 'exit' && role !== 'entry') {
        return undefined;
      }

      const forceSnap = lastSnapGenerationRef.current !== effectiveSnapGeneration;
      lastSnapGenerationRef.current = effectiveSnapGeneration;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
      }

      // Two-phase snap while geometry is moving:
      // 1) rAF — cheap approx outline (keeps stubs attached during Cola ticks)
      // 2) settle timeout — precise hull after motion stops
      // On forceSnap (layout end / collapse), skip approx and do one precise snap on rAF
      // so we do not race two delay-0 callbacks (timeout can otherwise run before rAF).
      if (forceSnap) {
        rafRef.current = requestAnimationFrame(() => {
          snapAggregateEdge(edge, role, true, 0);
        });
      } else {
        rafRef.current = requestAnimationFrame(() => {
          snapAggregateEdge(edge, role, false, AGGREGATE_MOVE_SNAP_THRESHOLD);
        });
        settleTimerRef.current = setTimeout(() => {
          snapAggregateEdge(edge, role, true, AGGREGATE_HULL_SNAP_THRESHOLD);
        }, AGGREGATE_HULL_SETTLE_MS);
      }

      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
        if (settleTimerRef.current) {
          clearTimeout(settleTimerRef.current);
        }
      };
    }, [edge, role, geoKey, effectiveSnapGeneration]);

    if (!edge?.hasController()) {
      return null;
    }

    const handleSelect = (e: MouseEvent) => {
      e.stopPropagation();
      if (!edge.hasController()) {
        return;
      }
      selectRelatedAggregateSegments(edge);
      onSelect?.(e);
    };

    let startTerminalType = EdgeTerminalType.none;
    let endTerminalType = EdgeTerminalType.none;
    let startTerminalClass: string | undefined;
    let endTerminalClass: string | undefined;
    if (role === 'bridge') {
      const selectionState = edge.getController().getState<{ [SELECTION_STATE]?: string[] }>();
      const selectedIds = selectionState[SELECTION_STATE] || [];
      const focusLeaves = getSelectionFocusLeaves(edge, selectedIds);
      const terminals = getBridgeTerminalPresentation(
        { bidirectional, forwardEdgeIds, reverseEdgeIds },
        selected,
        focusLeaves
      );
      startTerminalType = terminals.start;
      endTerminalType = terminals.end;
      if (terminals.muteStart) {
        startTerminalClass = MUTED_TERMINAL_CLASS;
      }
      if (terminals.muteEnd) {
        endTerminalClass = MUTED_TERMINAL_CLASS;
      }
    } else if (role === 'entry' && isNode(targetNode) && !targetNode.isGroup()) {
      endTerminalType = EdgeTerminalType.directional;
    }

    let tag = tagProp;
    if (tag === undefined && role === 'bridge' && count && count > 1) {
      tag = String(count);
    }

    return (
      <DefaultEdge
        {...rest}
        element={element}
        selected={selected}
        onSelect={handleSelect}
        tag={tag}
        startTerminalType={startTerminalTypeProp ?? startTerminalType}
        endTerminalType={endTerminalTypeProp ?? endTerminalType}
        startTerminalClass={startTerminalClassProp ?? startTerminalClass}
        endTerminalClass={endTerminalClassProp ?? endTerminalClass}
      />
    );
  }
);

export default DefaultAggregatedEdge;
