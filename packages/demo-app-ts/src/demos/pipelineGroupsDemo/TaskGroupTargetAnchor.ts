import { AbstractAnchor, Point, Node } from '@patternfly/react-topology';

export default class TaskGroupTargetAnchor<E extends Node = Node> extends AbstractAnchor {
  private vertical = false;

  constructor(owner: E, vertical = false) {
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
