import { computed, makeObservable, observable } from 'mobx';
import Rect from '../geom/Rect';
import Point from '../geom/Point';
import Dimensions from '../geom/Dimensions';
import { DEFAULT_LAYERS } from '../const';
import {
  Edge,
  Graph,
  GRAPH_POSITION_CHANGE_EVENT,
  GraphModel,
  isEdge,
  isNode,
  Layout,
  ModelKind,
  Node,
  NodeModel,
  ScaleExtent,
  ScaleDetailsLevel,
  ScaleDetailsThresholds
} from '../types';
import BaseElement from './BaseElement';
import { LayoutOptions } from '../layouts';

export default class BaseGraph<E extends GraphModel = GraphModel, D = any>
  extends BaseElement<E, D>
  implements Graph<E, D>
{
  private layers = DEFAULT_LAYERS;

  private scale = 1;

  private layoutType?: string = undefined;

  private dimensions = new Dimensions();

  private position = new Point();

  private currentLayout?: Layout = undefined;

  private layoutOptions?: LayoutOptions = undefined;

  private scaleExtent: ScaleExtent = [0.25, 4];

  constructor() {
    super();

    makeObservable<
      BaseGraph,
      | 'layers'
      | 'scale'
      | 'layoutType'
      | 'layoutOptions'
      | 'dimensions'
      | 'position'
      | 'scaleExtent'
      | 'detailsLevel'
      | 'edges'
      | 'nodes'
      | 'scaleDetailsThresholds'
    >(this, {
      layers: observable.ref,
      scale: observable,
      layoutType: observable,
      layoutOptions: observable.deep,
      dimensions: observable.ref,
      position: observable.ref,
      scaleExtent: observable.ref,
      detailsLevel: computed,
      edges: computed,
      nodes: computed,
      scaleDetailsThresholds: observable.ref
    });
  }

  private get detailsLevel(): ScaleDetailsLevel {
    if (!this.scaleDetailsThresholds) {
      return ScaleDetailsLevel.high;
    }
    if (this.scale <= this.scaleDetailsThresholds.low) {
      return ScaleDetailsLevel.low;
    } else if (this.scale <= this.scaleDetailsThresholds.medium) {
      return ScaleDetailsLevel.medium;
    }
    return ScaleDetailsLevel.high;
  }

  private get edges(): Edge[] {
    return this.getChildren().filter(isEdge);
  }

  private get nodes(): Node[] {
    return this.getChildren().filter(isNode);
  }

  private scaleDetailsThresholds: ScaleDetailsThresholds = {
    low: 0.3,
    medium: 0.5
  };

  getKind(): ModelKind {
    return ModelKind.graph;
  }

  getLayers(): string[] {
    return this.layers;
  }

  setLayers(layers: string[]): void {
    this.layers = layers;
  }

  getScaleExtent(): ScaleExtent {
    return this.scaleExtent;
  }

  setScaleExtent(scaleExtent: ScaleExtent): void {
    this.scaleExtent = scaleExtent;
    if (this.hasController()) {
      this.getController().fireEvent(GRAPH_POSITION_CHANGE_EVENT, { graph: this });
    }
  }

  getDetailsLevelThresholds(): ScaleDetailsThresholds | undefined {
    return this.scaleDetailsThresholds;
  }

  setDetailsLevelThresholds(settings: ScaleDetailsThresholds | undefined): void {
    this.scaleDetailsThresholds = settings;
  }

  getDetailsLevel(): ScaleDetailsLevel {
    return this.detailsLevel;
  }

  getBounds(): Rect {
    const {
      position: { x, y },
      dimensions: { width, height }
    } = this;
    return new Rect(x, y, width, height);
  }

  setBounds(bounds: Rect): void {
    const { width, height } = this.dimensions;
    if (bounds.width !== width || bounds.height !== height) {
      this.dimensions = new Dimensions(bounds.width, bounds.height);
    }
    const { x, y } = this.position;
    if (bounds.x !== x || bounds.y !== y) {
      this.setPosition(new Point(bounds.x, bounds.y));
    }
  }

  getPosition(): Point {
    return this.position;
  }

  setPosition(point: Point): void {
    this.position = point;
    if (this.hasController()) {
      this.getController().fireEvent(GRAPH_POSITION_CHANGE_EVENT, { graph: this });
    }
  }

  getDimensions(): Dimensions {
    return this.dimensions;
  }

  setDimensions(dimensions: Dimensions): void {
    this.dimensions = dimensions;
  }

  getNodes(): Node[] {
    return this.nodes;
  }

  getEdges(): Edge[] {
    return this.edges;
  }

  getLayout(): string | undefined {
    return this.layoutType;
  }

  getLayoutOptions(): LayoutOptions | undefined {
    return this.layoutOptions;
  }

  setLayout(layout: string | undefined): void {
    if (layout === this.layoutType) {
      return;
    }

    if (this.currentLayout) {
      this.currentLayout.destroy();
      this.layoutOptions = undefined;
    }

    this.layoutType = layout;
    this.currentLayout = layout ? this.getController().getLayout(layout) : undefined;
    this.layoutOptions = this.currentLayout?.getLayoutOptions?.();
  }

  layout(): void {
    if (this.currentLayout) {
      this.currentLayout.layout();
    }
  }

  getScale(): number {
    return this.scale;
  }

  setScale(scale: number): void {
    this.scale = scale;
    if (this.hasController()) {
      this.getController().fireEvent(GRAPH_POSITION_CHANGE_EVENT, { graph: this });
    }
  }

  reset(): void {
    if (this.currentLayout) {
      this.currentLayout.stop();
    }
    this.setScale(1);
    this.setPosition(new Point(0, 0));
  }

  setAllChildrenCollapsedState(parent: Node, collapsed: boolean): void {
    parent.getAllNodeChildren(false).forEach((node) => {
      if (node.isGroup()) {
        node.setCollapsed(collapsed);
      }
    });
  }

  expandAll(): void {
    this.getNodes().forEach((node) => {
      if (node.isGroup()) {
        node.setCollapsed(false);
        this.setAllChildrenCollapsedState(node, false);
      }
    });
  }

  collapseAll(): void {
    this.getNodes().forEach((node) => {
      if (node.isGroup()) {
        node.setCollapsed(true);
        this.setAllChildrenCollapsedState(node, true);
      }
    });
  }

  scaleBy(scale: number, location?: Point): void {
    const b = this.getBounds();
    let { x, y } = b;
    const c = location || b.getCenter().translate(-x, -y);
    x = (c.x - x) / this.scale;
    y = (c.y - y) / this.scale;
    const newScale = Math.max(Math.min(this.scale * scale, this.scaleExtent[1]), this.scaleExtent[0]);
    this.setScale(newScale);
    x = c.x - x * this.scale;
    y = c.y - y * this.scale;
    this.setPosition(new Point(x, y));
  }

  fit(padding = 0, node?: Node): void {
    let rect: Rect | undefined;
    if (node) {
      rect = node.getBounds();
    } else {
      this.getNodes().forEach((c) => {
        const b = c.getBounds();
        if (!rect) {
          rect = b.clone();
        } else {
          rect.union(b);
        }
      });
    }

    if (!rect) {
      return;
    }

    const { width, height } = rect;

    if (width === 0 || height === 0) {
      return;
    }

    const { width: fullWidth, height: fullHeight } = this.getDimensions();
    const midX = rect.x + width / 2;
    const midY = rect.y + height / 2;

    // set the max scale to be the current zoom level or 1
    const maxScale = Math.max(this.getScale(), 1);

    // compute the scale
    const scale = Math.min(
      1 / Math.max(width / Math.max(1, fullWidth - padding), height / Math.max(1, fullHeight - padding)),
      maxScale
    );

    // translate to center
    const tx = fullWidth / 2 - midX * scale;
    const ty = fullHeight / 2 - midY * scale;

    // TODO should scale and bound be kept in a single geom Transform object instead of separately?
    this.setScale(scale);
    this.setPosition(new Point(tx, ty));
  }

  centerInView = (nodeElement: Node): void => {
    if (!nodeElement) {
      return;
    }
    const { x: viewX, y: viewY, width: viewWidth, height: viewHeight } = this.getBounds();
    const boundingBox = nodeElement.getBounds().clone().scale(this.scale).translate(viewX, viewY);
    const { x, y, width, height } = boundingBox;

    const newLocation = {
      x: viewX - (x + width / 2) + viewWidth / 2,
      y: viewY - (y + height / 2) + viewHeight / 2
    };

    this.setBounds(new Rect(newLocation.x, newLocation.y, viewWidth, viewHeight));
  };

  panIntoView = (
    nodeElement: Node,
    { offset = 0, minimumVisible = 0 }: { offset?: number; minimumVisible?: number } = {}
  ): void => {
    if (!nodeElement) {
      return;
    }
    const { x: viewX, y: viewY, width: viewWidth, height: viewHeight } = this.getBounds();
    const boundingBox = nodeElement.getBounds().clone().scale(this.scale).translate(viewX, viewY);
    const { x, y, width, height } = boundingBox;
    let move = false;
    const panOffset = offset * this.scale;
    const minVisibleSize = minimumVisible * this.scale;

    const newLocation = {
      x: viewX,
      y: viewY
    };

    if (x + width - minVisibleSize < 0) {
      newLocation.x -= x - panOffset;
      move = true;
    }
    if (x + minVisibleSize > viewWidth) {
      newLocation.x -= x + width - viewWidth + panOffset;
      move = true;
    }
    if (y + height - minVisibleSize < 0) {
      newLocation.y -= y - panOffset;
      move = true;
    }
    if (y + minVisibleSize > viewHeight) {
      newLocation.y -= y + height - viewHeight + panOffset;
      move = true;
    }

    if (move) {
      this.setBounds(new Rect(newLocation.x, newLocation.y, viewWidth, viewHeight));
    }
  };

  isNodeInView(element: Node<NodeModel, any>, { padding = 0 }): boolean {
    const graph = element.getGraph();
    const { x: viewX, y: viewY, width: viewWidth, height: viewHeight } = graph.getBounds();
    const { x, y, width, height } = element.getBounds().clone().scale(this.scale).translate(viewX, viewY);

    return x + width > -padding && x < viewWidth + padding && y + height > -padding && y < viewHeight + padding;
  }

  setModel(model: E): void {
    super.setModel(model);

    if ('layers' in model && model.layers) {
      this.setLayers(model.layers);
    }
    if ('layout' in model) {
      this.setLayout(model.layout);
    }
    if (model.scaleExtent && model.scaleExtent.length === 2) {
      this.setScaleExtent(model.scaleExtent);
    }
    if ('scale' in model && typeof model.scale === 'number') {
      this.setScale(+model.scale);
    }
    let p: Point | undefined;
    if ('x' in model && model.x != null) {
      if (!p) {
        p = this.position.clone();
      }
      p.x = model.x;
    }
    if ('y' in model && model.y != null) {
      if (!p) {
        p = this.position.clone();
      }
      p.y = model.y;
    }
    if (p) {
      this.setPosition(p);
    }
  }

  toModel(): GraphModel {
    return {
      ...super.toModel(),
      layout: this.getLayout(),
      x: this.getPosition().x,
      y: this.getPosition().y,
      scale: this.getScale(),
      scaleExtent: this.getScaleExtent(),
      layers: this.getLayers()
    };
  }

  translateToAbsolute(): void {
    // do nothing
  }

  translateFromAbsolute(): void {
    // do nothing
  }

  destroy(): void {
    if (this.currentLayout) {
      this.currentLayout.destroy();
    }
  }
}
