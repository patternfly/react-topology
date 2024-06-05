import { AbstractAnchor } from '../../../anchors';
import { Point } from '../../../geom';
import { Node } from '../../../types';

export default class TaskGroupSourceAnchor extends AbstractAnchor {
  private vertical = false;
  private anchorOffset = 0;

  constructor(owner: Node, vertical: boolean = true, offset: number = 0) {
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
      return new Point(bounds.x + bounds.width / 2, bounds.bottom() + this.anchorOffset);
    }
    return new Point(bounds.right() + this.anchorOffset, bounds.y + bounds.height / 2);
  }
}
