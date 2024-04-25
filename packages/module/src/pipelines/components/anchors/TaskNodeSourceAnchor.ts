import { Point } from '../../../geom';
import { AbstractAnchor } from '../../../anchors';
import { Node, ScaleDetailsLevel } from '../../../types';

export default class TaskNodeSourceAnchor<E extends Node = Node> extends AbstractAnchor {
  private detailsLevel: ScaleDetailsLevel;
  private lowDetailsStatusIconSize = 0;
  private vertical = false;

  constructor(owner: E, detailsLevel: ScaleDetailsLevel, lowDetailsStatusIconSize: number, vertical: boolean = false) {
    super(owner);
    this.detailsLevel = detailsLevel;
    this.lowDetailsStatusIconSize = lowDetailsStatusIconSize;
    this.vertical = vertical;
  }

  getLocation(): Point {
    return this.getReferencePoint();
  }

  getReferencePoint(): Point {
    const bounds = this.owner.getBounds();
    if (this.detailsLevel !== ScaleDetailsLevel.high) {
      const scale = this.owner.getGraph().getScale();
      if (this.vertical) {
        return new Point(bounds.x + (this.lowDetailsStatusIconSize / 2 + 2) * (1 / scale), bounds.bottom());
      }
      return new Point(bounds.x + this.lowDetailsStatusIconSize * (1 / scale), bounds.y + bounds.height / 2);
    }
    if (this.vertical) {
      return new Point(bounds.x + bounds.width / 2, bounds.bottom());
    }
    return new Point(bounds.right(), bounds.y + bounds.height / 2);
  }
}
