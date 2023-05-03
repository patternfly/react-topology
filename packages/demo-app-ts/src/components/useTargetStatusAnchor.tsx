import * as React from 'react';
import { action, observable } from 'mobx';
import {
  AbstractAnchor,
  AnchorEnd,
  ElementContext,
  isNode, Node,
  Point,
} from '@patternfly/react-topology';

export type SvgAnchorRef = (node: SVGElement | null) => void;

class TargetStatusAnchor<E extends Node = Node> extends AbstractAnchor {
  @observable.ref
  private svgElement?: SVGElement;

  private centerOffset: number = 0;

  constructor(owner: E, offset: number = 0) {
    super(owner);
    this.centerOffset = offset;
  }

  setSVGElement(svgElement: SVGElement) {
    this.svgElement = svgElement;
  }

  getReferencePoint(): Point {
    const circle = this.svgElement as SVGCircleElement;
    const center: Point = new Point(circle.cx.baseVal.value, circle.cy.baseVal.value);
    this.owner.translateToParent(center);
    const radius = circle.r.baseVal.value;

    return new Point(center.x - radius, center.y + this.centerOffset);
  }

  getLocation(): Point {
    return this.getReferencePoint();
  }
}

export const useTargetStatusAnchor = (
  end: AnchorEnd = AnchorEnd.both,
  type: string = '',
  offset: number = 0

): ((node: SVGElement | null) => void) => {
  const element = React.useContext(ElementContext);
  if (!isNode(element)) {
    throw new Error('useSvgAnchor must be used within the scope of a Node');
  }

  return React.useCallback<SvgAnchorRef>((node: SVGElement | null) => {
    const actionFn = action((node: SVGElement | null) => {
      if (node) {
        const anchor = new TargetStatusAnchor(element, offset);
        anchor.setSVGElement(node);
        element.setAnchor(anchor, end, type);
      }
    });
    actionFn(node);
  },[element, offset, end, type]);
};