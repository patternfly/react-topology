import { AbstractAnchor } from '../../../anchors';
import { Point } from '../../../geom';
import { Node } from '../../../types';

export default class TaskGroupSourceAnchor extends AbstractAnchor {
  private vertical = false;

  constructor(owner: Node, vertical: boolean = true) {
    super(owner);
    this.vertical = vertical;
  }

  getLocation(): Point {
    return this.getReferencePoint();
  }

  getReferencePoint(): Point {
    const bounds = this.owner.getBounds();
    if (this.vertical) {
      return new Point(bounds.x + bounds.width / 2, bounds.bottom());
    }
    return new Point(bounds.right(), bounds.y + bounds.height / 2);
  }
}
