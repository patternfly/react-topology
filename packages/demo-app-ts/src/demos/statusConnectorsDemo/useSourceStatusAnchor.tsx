import * as React from 'react';
import { action, observable } from 'mobx';
import {
  isNode,
  AnchorEnd,
  ElementContext,
  Point,
  AbstractAnchor,
} from '@patternfly/react-topology';

export type SvgAnchorRef = (node: SVGElement | null) => void;

class SourceStatusAnchor extends AbstractAnchor {
  @observable.ref
  private svgElement?: SVGElement;

  setSVGElement(svgElement: SVGElement) {
    this.svgElement = svgElement;
  }

  getReferencePoint(): Point {
    const circle = this.svgElement as SVGCircleElement;
    const center: Point = new Point(circle.cx.baseVal.value, circle.cy.baseVal.value);
    this.owner.translateToParent(center);
    const radius = circle.r.baseVal.value;

    return new Point(center.x + radius, center.y);
  }

  getLocation(): Point {
    return this.getReferencePoint();
  }
}

export const useSourceStatusAnchor = (
  end: AnchorEnd = AnchorEnd.both,
  type: string = ''

): ((node: SVGElement | null) => void) => {
  const element = React.useContext(ElementContext);
  if (!isNode(element)) {
    throw new Error('useSvgAnchor must be used within the scope of a Node');
  }

  return React.useCallback<SvgAnchorRef>((node: SVGElement | null) => {
    const actionFn = action((node: SVGElement | null) => {
      if (node) {
        const anchor = new SourceStatusAnchor(element);
        anchor.setSVGElement(node);
        element.setAnchor(anchor, end, type);
      }
    });
    actionFn(node);
  },[element, type, end]);
};
