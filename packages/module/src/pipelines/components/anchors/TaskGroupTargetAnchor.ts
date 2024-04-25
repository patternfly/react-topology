import { AbstractAnchor } from '../../../anchors';
import { Node } from '../../../types';
import { Point } from '../../../geom';

export default class TaskGroupTargetAnchor extends AbstractAnchor {
  private vertical = false;

  constructor(owner: Node, vertical = false) {
    super(owner);
    this.vertical = vertical;
  }

  getLocation(): Point {
    return this.getReferencePoint();
  }

  getReferencePoint(): Point {
    const bounds = this.owner.getBounds();

    if (this.vertical) {
      return new Point(bounds.x + bounds.width / 2, bounds.y);
    }
    return new Point(bounds.x, bounds.y + bounds.height / 2);
  }
}
