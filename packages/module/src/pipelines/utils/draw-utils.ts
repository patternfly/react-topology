import { Point } from '../../geom';
import { DrawDesign, NODE_SEPARATION_HORIZONTAL } from '../const';

type SingleDraw = (p: Point) => string;
type DoubleDraw = (p1: Point, p2: Point, startIndentX?: number, junctionOffset?: number, verticalLayout?: boolean) => string;
type TripleDraw = (p1: Point, p2: Point, p3: Point, curveSize?: { x: number, y: number }) => string;
type DetermineDirection = (p1: Point, p2: Point) => boolean;

const join = (...segments: string[]) => segments.filter(seg => !!seg).join(' ');

const leftRight: DetermineDirection = (p1, p2) => p1.x < p2.x;
const topDown: DetermineDirection = (p1, p2) => p1.y < p2.y;
const bottomUp: DetermineDirection = (p1, p2) => p1.y > p2.y;

const point: SingleDraw = p => `${p.x},${p.y}`;
const moveTo: SingleDraw = p => `M ${point(p)}`;
const lineTo: SingleDraw = p => `L ${point(p)}`;
const quadTo: DoubleDraw = (corner, end) => `Q ${point(corner)} ${point(end)}`;

// TODO: Try to simplify
// x should not be greater than (NODE_SEPARATION_HORIZONTAL / 2)
const CURVE_SIZE = { x: 8, y: 10 };
const curve: TripleDraw = (fromPoint, cornerPoint, toPoint, curveSize = CURVE_SIZE) => {
  const topToBottom = topDown(fromPoint, toPoint);
  if (topToBottom) {
    const rightAndDown = leftRight(fromPoint, cornerPoint) && topDown(cornerPoint, toPoint);
    const downAndRight = topDown(fromPoint, cornerPoint) && leftRight(cornerPoint, toPoint);
    if (rightAndDown) {
      return join(
        lineTo(cornerPoint.clone().translate(-curveSize.x, 0)),
        quadTo(cornerPoint, cornerPoint.clone().translate(0, curveSize.y))
      );
    }
    if (downAndRight) {
      return join(
        lineTo(cornerPoint.clone().translate(0, -curveSize.y)),
        quadTo(cornerPoint, cornerPoint.clone().translate(curveSize.x, 0))
      );
    }
  } else {
    const rightAndUp = leftRight(fromPoint, cornerPoint) && bottomUp(cornerPoint, toPoint);
    const upAndRight = bottomUp(fromPoint, cornerPoint) && leftRight(cornerPoint, toPoint);
    if (rightAndUp) {
      return join(
        lineTo(cornerPoint.clone().translate(-curveSize.x, 0)),
        quadTo(cornerPoint, cornerPoint.clone().translate(0, -curveSize.y))
      );
    }
    if (upAndRight) {
      return join(
        lineTo(cornerPoint.clone().translate(0, curveSize.y)),
        quadTo(cornerPoint, cornerPoint.clone().translate(curveSize.x, 0))
      );
    }
  }

  return '';
};

const curveVertical: TripleDraw = (fromPoint, cornerPoint, toPoint, curveSize = CURVE_SIZE) => {
  const leftToRight = leftRight(fromPoint, toPoint);
  if (leftToRight) {
    const rightAndDown = leftRight(fromPoint, cornerPoint) && topDown(cornerPoint, toPoint);
    const downAndRight = topDown(fromPoint, cornerPoint) && leftRight(cornerPoint, toPoint);
    if (rightAndDown) {
      return join(
        lineTo(cornerPoint.clone().translate(-curveSize.x, 0)),
        quadTo(cornerPoint, cornerPoint.clone().translate(0, curveSize.y))
      );
    }
    if (downAndRight) {
      return join(
        lineTo(cornerPoint.clone().translate(0, -curveSize.y)),
        quadTo(cornerPoint, cornerPoint.clone().translate(curveSize.x, 0))
      );
    }
  } else {
    const leftAndDown = leftRight(toPoint, cornerPoint) && bottomUp(cornerPoint, fromPoint);
    const downAndLeft = bottomUp(toPoint, cornerPoint) && leftRight(cornerPoint, fromPoint);
    if (leftAndDown) {
      return join(
        lineTo(cornerPoint.clone().translate(0, -curveSize.y)),
        quadTo(cornerPoint, cornerPoint.clone().translate(-curveSize.x, 0))
      );
    }
    if (downAndLeft) {
      return join(
        lineTo(cornerPoint.clone().translate(curveSize.x, 0)),
        quadTo(cornerPoint, cornerPoint.clone().translate(0, curveSize.y))
      );
    }
  }

  return '';
};

export const straightPath: DoubleDraw = (start, finish) => join(moveTo(start), lineTo(finish));

export const integralShapePath: DoubleDraw = (
  start,
  finish,
  startIndentX = 0,
  nodeSeparation = NODE_SEPARATION_HORIZONTAL,
  verticalLayout = false
) => {
  // Integral shape: ∫
  let firstCurve: string = null;
  let secondCurve: string = null;

  if (verticalLayout) {
    if (start.x !== finish.x) {
      const cornerY = Math.floor(start.y + nodeSeparation / 2);
      const firstCorner = new Point(start.x, cornerY);
      const secondCorner = new Point(finish.x, cornerY);

      if (Math.abs(start.x - finish.x) > CURVE_SIZE.x) {
        firstCurve = curveVertical(start, firstCorner, secondCorner);
        secondCurve = curveVertical(firstCorner, secondCorner, finish);
      } else {
        firstCurve = curveVertical(start, firstCorner, finish, {
          x: Math.abs(start.x - finish.x),
          y: CURVE_SIZE.y
        });
      }
    }
  }
  else if (start.y !== finish.y) {
    const cornerX = Math.floor(start.x + nodeSeparation / 2);
    const firstCorner = new Point(cornerX, start.y);
    const secondCorner = new Point(cornerX, finish.y);

    if (Math.abs(start.y - finish.y) > CURVE_SIZE.y) {
      firstCurve = curve(start, firstCorner, secondCorner);
      secondCurve = curve(firstCorner, secondCorner, finish);
    } else {
      firstCurve = curve(start, firstCorner, finish, {x: CURVE_SIZE.x, y: Math.abs(start.y - finish.y)});
    }
  }

  const indentedStart = new Point(start.x - startIndentX, start.y);
  return join(moveTo(indentedStart), firstCurve, secondCurve, lineTo(finish));
};

export const path = (start: Point, finish: Point, drawDesign?: DrawDesign) => {
  switch (drawDesign) {
    case DrawDesign.INTEGRAL_SHAPE:
      return integralShapePath(start, finish);
    case DrawDesign.STRAIGHT:
    default:
      return straightPath(start, finish);
  }
};
