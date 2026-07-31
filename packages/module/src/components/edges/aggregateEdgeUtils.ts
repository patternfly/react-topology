import { action } from 'mobx';
import { AnchorEnd, Edge, EdgeTerminalType, isNode, Node, NodeStyle } from '../../types';
import { SELECTION_EVENT, SELECTION_STATE } from '../../behavior';
import Point from '../../geom/Point';

interface XY {
  x: number;
  y: number;
}

export const AGGREGATE_MOVE_SNAP_THRESHOLD = 3;
export const AGGREGATE_HULL_SNAP_THRESHOLD = 2;
export const AGGREGATE_HULL_SETTLE_MS = 100;

export const MUTED_TERMINAL_CLASS = 'pf-m-muted';

export const findRelatedBridge = (stub: Edge): Edge | undefined => {
  if (!stub.hasController()) {
    return undefined;
  }

  const bridgeId = stub.getData()?.bridgeId as string | undefined;
  if (bridgeId) {
    try {
      return stub.getController().getEdgeById(bridgeId);
    } catch {
      return undefined;
    }
  }

  const bridgeKey = stub.getData()?.bridgeKey as string | undefined;
  if (!bridgeKey) {
    return undefined;
  }

  return stub
    .getGraph()
    .getEdges()
    .find((e) => e.getData()?.role === 'bridge' && e.getData()?.bridgeKey === bridgeKey);
};

const readGroupPadding = (group: Node): number => {
  const padding = group.getStyle<NodeStyle>()?.padding;
  if (typeof padding === 'number') {
    return padding;
  }
  if (padding && typeof padding === 'object') {
    const box = padding as { top?: number; right?: number; bottom?: number; left?: number };
    return Math.max(box.top ?? 0, box.right ?? 0, box.bottom ?? 0, box.left ?? 0);
  }
  return 17;
};

const ellipseOnBounds = (group: Node, toward: Node): XY => {
  const b = group.getBounds();
  const cx = b.x + b.width / 2;
  const cy = b.y + b.height / 2;
  const reference = toward.getBounds().getCenter();
  const extra = Math.max(10, readGroupPadding(group) * 0.5);
  const width = b.width + extra * 2;
  const height = b.height + extra * 2;

  if (width === 0 || height === 0 || (cx === reference.x && cy === reference.y)) {
    return { x: cx, y: cy };
  }

  const dispX = (cx - reference.x) / (width / 2);
  const dispY = (cy - reference.y) / (height / 2);
  const len = Math.sqrt(dispX * dispX + dispY * dispY);
  if (len === 0) {
    return { x: cx, y: cy };
  }
  const lenProportion = (len - 1) / len;
  return {
    x: (cx - reference.x) * lenProportion + reference.x,
    y: (cy - reference.y) * lenProportion + reference.y
  };
};

interface AnchorWithSvg {
  svgElement?: SVGElement;
  getLocation: (reference: Point) => Point;
}

const getAnchorSvg = (group: Node, end: AnchorEnd): SVGElement | undefined => {
  const anchor = group.getAnchor(end) as AnchorWithSvg | undefined;
  return anchor?.svgElement;
};

/** Motion-time outline snap: coarse hull path sample, or O(1) for rect/ellipse. */
const approxBorderFacing = (group: Node, toward: Node, end: AnchorEnd = AnchorEnd.both): XY => {
  const reference = toward.getBounds().getCenter();
  const svg = getAnchorSvg(group, end);

  if (svg instanceof SVGRectElement || svg instanceof SVGEllipseElement || svg instanceof SVGCircleElement) {
    const loc = group.getAnchor(end).getLocation(reference);
    return { x: loc.x, y: loc.y };
  }

  if (svg instanceof SVGPathElement && svg.viewportElement) {
    try {
      const localRef = reference.clone();
      group.translateFromParent(localRef);

      const pathLength = svg.getTotalLength();
      if (pathLength > 0) {
        const box = svg.getBBox();
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;
        const vx = localRef.x - cx;
        const vy = localRef.y - cy;
        const vLen = Math.hypot(vx, vy) || 1;

        const samples = 16;
        let best: XY | undefined;
        let bestScore = Infinity;
        for (let i = 0; i < samples; i++) {
          const p = svg.getPointAtLength((pathLength * i) / samples);
          const wx = p.x - cx;
          const wy = p.y - cy;
          const dot = vx * wx + vy * wy;
          if (dot <= 0) {
            continue;
          }
          const cross = Math.abs(vx * wy - vy * wx) / vLen;
          if (cross < bestScore) {
            bestScore = cross;
            best = { x: p.x, y: p.y };
          }
        }

        if (best) {
          const pt = new Point(best.x, best.y);
          group.translateToParent(pt);
          return { x: pt.x, y: pt.y };
        }
      }
    } catch {
      // fall through
    }
  }

  return ellipseOnBounds(group, toward);
};

const hullBorderFacing = (group: Node, toward: Node, end: AnchorEnd = AnchorEnd.both): XY => {
  const reference = toward.getBounds().getCenter();
  const anchor = group.getAnchor(end);
  if (anchor) {
    const loc = anchor.getLocation(reference);
    return { x: loc.x, y: loc.y };
  }
  return approxBorderFacing(group, toward, end);
};

const getPathPeer = (stub: Edge, role: 'exit' | 'entry', bridge: Edge): Node | undefined => {
  const bridgeSource = bridge.getSource();
  const bridgeTarget = bridge.getTarget();
  if (!isNode(bridgeSource) || !isNode(bridgeTarget)) {
    return undefined;
  }

  const endIds = new Set([stub.getSource().getId(), stub.getTarget().getId()]);
  if (endIds.has(bridgeSource.getId())) {
    return bridgeTarget;
  }
  if (endIds.has(bridgeTarget.getId())) {
    return bridgeSource;
  }

  const groupNode = role === 'exit' ? stub.getTarget() : stub.getSource();
  if (!isNode(groupNode)) {
    return undefined;
  }
  const center = groupNode.getBounds().getCenter();
  const sc = bridgeSource.getBounds().getCenter();
  const tc = bridgeTarget.getBounds().getCenter();
  const dSource = (sc.x - center.x) ** 2 + (sc.y - center.y) ** 2;
  const dTarget = (tc.x - center.x) ** 2 + (tc.y - center.y) ** 2;
  return dSource <= dTarget ? bridgeTarget : bridgeSource;
};

const getRelatedSegmentIds = (edge: Edge): string[] => {
  const leafIds = (edge.getData()?.aggregatedEdgeIds as string[] | undefined) || [];
  if (!leafIds.length) {
    return [edge.getId()];
  }

  const leafSet = new Set(leafIds);
  return edge
    .getGraph()
    .getEdges()
    .filter((e) => {
      const ids = (e.getData()?.aggregatedEdgeIds as string[] | undefined) || [];
      return ids.some((id) => leafSet.has(id));
    })
    .map((e) => e.getId());
};

/**
 * Leaves that define the selected *flow* through a bridge. Prefer exit/entry stub
 * leaves so co-selecting a bidirectional bridge does not pull in the opposite
 * direction's arrowhead.
 */
export const getSelectionFocusLeaves = (edge: Edge, selectedIds: string[]): Set<string> => {
  const stubLeaves = new Set<string>();
  selectedIds.forEach((id) => {
    try {
      const selected = edge.getController().getEdgeById(id);
      const role = selected.getData()?.role as string | undefined;
      if (role !== 'exit' && role !== 'entry') {
        return;
      }
      ((selected.getData()?.aggregatedEdgeIds as string[]) || []).forEach((leafId) => stubLeaves.add(leafId));
    } catch {
      // Edge may have been removed during model rebuild.
    }
  });
  if (stubLeaves.size > 0) {
    return stubLeaves;
  }
  return new Set((edge.getData()?.aggregatedEdgeIds as string[]) || []);
};

export const getBridgeTerminalPresentation = (
  options: {
    bidirectional?: boolean;
    forwardEdgeIds?: string[];
    reverseEdgeIds?: string[];
  },
  selected: boolean | undefined,
  focusLeaves: Set<string>
): {
  start: EdgeTerminalType;
  end: EdgeTerminalType;
  muteStart: boolean;
  muteEnd: boolean;
} => {
  const bidirectional = !!options.bidirectional;
  if (!bidirectional) {
    return {
      start: EdgeTerminalType.none,
      end: EdgeTerminalType.directional,
      muteStart: false,
      muteEnd: false
    };
  }

  const both = {
    start: EdgeTerminalType.directional,
    end: EdgeTerminalType.directional,
    muteStart: false,
    muteEnd: false
  };

  if (!selected) {
    return both;
  }

  const forwardIds = options.forwardEdgeIds || [];
  const reverseIds = options.reverseEdgeIds || [];
  const hasForward = forwardIds.some((id) => focusLeaves.has(id));
  const hasReverse = reverseIds.some((id) => focusLeaves.has(id));

  if ((hasForward && hasReverse) || (!hasForward && !hasReverse)) {
    return both;
  }

  return {
    start: EdgeTerminalType.directional,
    end: EdgeTerminalType.directional,
    muteStart: hasForward && !hasReverse,
    muteEnd: hasReverse && !hasForward
  };
};

const significantlyMoved = (a: Point, x: number, y: number, threshold: number): boolean =>
  Math.abs(a.x - x) > threshold || Math.abs(a.y - y) > threshold;

export const boundsKey = (node: Node): string => {
  const b = node.getBounds();
  return `${Math.round(b.x)},${Math.round(b.y)},${Math.round(b.width)},${Math.round(b.height)}`;
};

interface SnapPlan {
  start: XY | null;
  end: XY | null;
}

const applySnapPlan = (edge: Edge, plan: SnapPlan, threshold: number): void => {
  action(() => {
    const startFixed = plan.start !== null;
    const endFixed = plan.end !== null;
    if (!startFixed && !endFixed) {
      return;
    }
    const startMoved = startFixed
      ? significantlyMoved(edge.getStartPoint(), plan.start.x, plan.start.y, threshold)
      : false;
    const endMoved = endFixed ? significantlyMoved(edge.getEndPoint(), plan.end.x, plan.end.y, threshold) : false;
    if (!startMoved && !endMoved) {
      return;
    }
    if (startFixed) {
      edge.setStartPoint(Math.round(plan.start.x), Math.round(plan.start.y));
    } else {
      edge.setStartPoint();
    }
    if (endFixed) {
      edge.setEndPoint(Math.round(plan.end.x), Math.round(plan.end.y));
    } else {
      edge.setEndPoint();
    }
  })();
};

const computeSnapPlan = (edge: Edge, role: string | undefined, precise: boolean): SnapPlan | undefined => {
  const sourceNode = edge.getSource();
  const targetNode = edge.getTarget();
  if (!isNode(sourceNode) || !isNode(targetNode)) {
    return undefined;
  }

  const borderFacing = precise
    ? (group: Node, toward: Node, end?: AnchorEnd) => hullBorderFacing(group, toward, end)
    : (group: Node, toward: Node, end?: AnchorEnd) => approxBorderFacing(group, toward, end ?? AnchorEnd.both);

  if (role === 'bridge') {
    return {
      start: borderFacing(sourceNode, targetNode, AnchorEnd.source),
      end: borderFacing(targetNode, sourceNode, AnchorEnd.target)
    };
  }

  if (role === 'exit' || role === 'entry') {
    const bridge = findRelatedBridge(edge);
    if (!bridge) {
      return undefined;
    }
    const peer = getPathPeer(edge, role, bridge);
    if (!peer) {
      return undefined;
    }
    const plan: SnapPlan = {
      start: null,
      end: null
    };
    if (sourceNode.isGroup()) {
      plan.start = borderFacing(sourceNode, peer, AnchorEnd.source);
    }
    if (targetNode.isGroup()) {
      plan.end = borderFacing(targetNode, peer, AnchorEnd.target);
    }
    return plan;
  }

  return undefined;
};

/** Compute and apply a snap plan for an aggregate edge segment. */
export const snapAggregateEdge = (edge: Edge, role: string | undefined, precise: boolean, threshold: number): void => {
  if (!edge.hasController()) {
    return;
  }
  const plan = computeSnapPlan(edge, role, precise);
  if (plan) {
    applySnapPlan(edge, plan, threshold);
  }
};

/** Select/deselect this aggregate segment and every related exit/bridge/entry sharing its leaves. */
export const selectRelatedAggregateSegments = (edge: Edge): string[] => {
  const relatedIds = getRelatedSegmentIds(edge);
  const ordered = [edge.getId(), ...relatedIds.filter((id) => id !== edge.getId())];
  const state = edge.getController().getState<{ [SELECTION_STATE]?: string[] }>();
  const allSelected = ordered.every((id) => state[SELECTION_STATE]?.includes(id));
  const selectedIds = allSelected ? [] : ordered;
  // App listeners (e.g. VisualizationSurface via SELECTION_EVENT) own controller state updates.
  edge.getController().fireEvent(SELECTION_EVENT, selectedIds);
  return selectedIds;
};
