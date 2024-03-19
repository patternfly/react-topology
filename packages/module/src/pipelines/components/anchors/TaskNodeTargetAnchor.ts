import { Point } from '../../../geom';
import { AbstractAnchor } from '../../../anchors';
import { Node, ScaleDetailsLevel } from '../../../types';

export default class TaskNodeTargetAnchor<E extends Node = Node> extends AbstractAnchor {
  private whenOffset = 0;
  private detailsLevel: ScaleDetailsLevel;
  private lowDetailsStatusIconSize = 0;
  private vertical = false;

  constructor(owner: E, whenOffset: number, detailsLevel = ScaleDetailsLevel.high, lowDetailsStatusIconSize = 0, vertical = false) {
    super(owner);
    this.whenOffset = whenOffset;
    this.detailsLevel = detailsLevel;
    this.lowDetailsStatusIconSize = lowDetailsStatusIconSize;
    this.vertical = vertical;
  }

  getLocation(): Point {
    return this.getReferencePoint();
  }

  getReferencePoint(): Point {
    const bounds = this.owner.getBounds();

    if (this.vertical) {
      if (this.detailsLevel !== ScaleDetailsLevel.high) {
        const scale = this.owner.getGraph().getScale();
        return new Point(bounds.x + (this.lowDetailsStatusIconSize / 2 + 2) * (1 / scale), bounds.y);
      }
      return new Point(bounds.x + bounds.width / 2, bounds.y - this.whenOffset);
    }
    return new Point(bounds.x, bounds.y + bounds.height / 2);
  }
}
