import { AbstractAnchor } from '../../../anchors';
import { Node } from '../../../types';
import { Point } from '../../../geom';

export default class TaskGroupTargetAnchor extends AbstractAnchor {
  private vertical = false;
  private anchorOffset = 0;

  constructor(owner: Node, vertical = false, offset: number = 0) {
    super(owner);
    this.vertical = vertical;
    this.anchorOffset = offset;
  }

  getLocation(): Point {
    return this.getReferencePoint();
  }

  getReferencePoint(): Point {
    const bounds = this.owner.getBounds();

    if (this.vertical) {
      return new Point(bounds.x + bounds.width / 2, bounds.y - this.anchorOffset);
    }
    return new Point(bounds.x - this.anchorOffset, bounds.y + bounds.height / 2);
  }
}
