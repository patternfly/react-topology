import { GraphElement, Node, isNode, isGraph, NodeStyle } from '../types';
import Rect from '../geom/Rect';
import { Dimensions } from '../geom';

const groupNodeElements = (nodes: GraphElement[]): Node[] => {
  if (!nodes.length) {
    return [];
  }
  const groupNodes: Node[] = [];
  nodes.forEach(nextNode => {
    if (isNode(nextNode) && nextNode.isGroup() && !nextNode.isCollapsed()) {
      groupNodes.push(nextNode);
      groupNodes.push(...groupNodeElements(nextNode.getChildren()));
    }
  });
  return groupNodes;
};

const leafNodeElements = (nodeElements: Node | Node[] | null): Node[] => {
  const nodes: Node[] = [];

  if (!nodeElements) {
    return nodes;
  }

  if (Array.isArray(nodeElements)) {
    nodeElements.forEach((nodeElement: Node) => {
      nodes.push(...leafNodeElements(nodeElement));
    });
    return nodes;
  }

  if (nodeElements.isGroup() && !nodeElements.isCollapsed()) {
    const leafNodes: Node[] = [];
    const children: GraphElement[] = nodeElements.getChildren().filter(e => isNode(e));
    children.forEach(element => leafNodes.push(...leafNodeElements(element as Node)));
    return leafNodes;
  }

  return [nodeElements];
};

const getTopCollapsedParent = (node: Node): Node => {
  let returnNode: Node = node;
  try {
    let parent = !isGraph(node) && node.getParent();
    while (parent && !isGraph(parent)) {
      if ((parent as Node).isCollapsed()) {
        returnNode = parent as Node;
      }
      parent = parent.getParent();
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return returnNode;
};

const getClosestVisibleParent = (node: Node): Node | null => {
  if (!node) {
    return null;
  }

  let returnNode = null;
  try {
    let parent = node.getParent();
    while (parent) {
      if (!parent.isVisible()) {
        // parent isn't visible so no descendant could be visible
        returnNode = null;
      } else if ((parent as Node).isCollapsed() || !returnNode) {
        // parent is collapsed, no descendant is visible, but parent is
        returnNode = parent as Node;
      }
      parent = parent.getParent();
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
  return returnNode;
};

const getElementPadding = (element: GraphElement): number => {
  const stylePadding = element.getStyle<NodeStyle>().padding;
  if (!stylePadding) {
    return 0;
  }

  if (Array.isArray(stylePadding)) {
    // For a padding that is not consistent on all sides, use the max padding
    return stylePadding.reduce((val, current) => Math.max(val, current), 0);
  }

  return stylePadding as number;
};

const getGroupPadding = (element: GraphElement, padding = 0): number => {
  if (isGraph(element)) {
    return padding;
  }
  let newPadding = padding;
  if (isNode(element) && element.isGroup() && !element.isCollapsed()) {
    newPadding += getElementPadding(element);
  }
  if (element.getParent()) {
    return getGroupPadding(element.getParent(), newPadding);
  }
  return newPadding;
};

const getGroupChildrenDimensions = (group: Node): Dimensions => {
  const children = group.getChildren()
    .filter(isNode)
    .filter(n => n.isVisible());
  if (!children.length) {
    return new Dimensions(0, 0);
  }

  let rect: Rect | undefined;
  children.forEach(c => {
    if (isNode(c)) {
      const { padding } = c.getStyle<NodeStyle>();
      const b = c.getBounds();
      // Currently non-group nodes do not include their padding in the bounds
      if (!c.isGroup() && padding) {
        b.padding(c.getStyle<NodeStyle>().padding);
      }
      if (!rect) {
        rect = b.clone();
      } else {
        rect.union(b);
      }
    }
  });

  if (!rect) {
    rect = new Rect();
  }

  const { padding } = group.getStyle<NodeStyle>();
  const paddedRect = rect.padding(padding);

  return new Dimensions(paddedRect.width, paddedRect.height);
};

export {
  groupNodeElements,
  leafNodeElements,
  getTopCollapsedParent,
  getClosestVisibleParent,
  getElementPadding,
  getGroupPadding,
  getGroupChildrenDimensions
};
