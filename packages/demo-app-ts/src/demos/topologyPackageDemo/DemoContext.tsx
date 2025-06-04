import { createContext } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { LabelPosition } from '@patternfly/react-topology';
import { GeneratorEdgeOptions, GeneratorNodeOptions } from './generator';

export class DemoModel {
  protected nodeOptionsP: GeneratorNodeOptions = {
    showStatus: false,
    showShapes: false,
    showDecorators: false,
    labels: true,
    secondaryLabels: false,
    labelPosition: LabelPosition.bottom,
    badges: false,
    icons: false,
    contextMenus: false,
    hulledOutline: true
  };
  protected edgeOptionsP: GeneratorEdgeOptions = {
    showStyles: false,
    showStatus: false,
    showAnimations: false,
    showTags: false,
    terminalTypes: false
  };
  protected creationCountsP: { numNodes: number; numEdges: number; numGroups: number; nestedLevel: number } = {
    numNodes: 6,
    numEdges: 2,
    numGroups: 1,
    nestedLevel: 0
  };
  protected layoutP: string = 'ColaNoForce';
  protected medScaleP: number = 0.5;
  protected lowScaleP: number = 0.3;

  constructor() {
    makeObservable<
      DemoModel,
      | 'nodeOptionsP'
      | 'edgeOptionsP'
      | 'creationCountsP'
      | 'layoutP'
      | 'medScaleP'
      | 'lowScaleP'
      | 'setNodeOptions'
      | 'setEdgeOptions'
      | 'setCreationCounts'
      | 'setLayout'
      | 'setMedScale'
      | 'setLowScale'
    >(this, {
      nodeOptionsP: observable.ref,
      edgeOptionsP: observable.shallow,
      creationCountsP: observable.shallow,
      layoutP: observable,
      medScaleP: observable,
      lowScaleP: observable,
      setNodeOptions: action,
      setEdgeOptions: action,
      setCreationCounts: action,
      setLayout: action,
      setMedScale: action,
      setLowScale: action
    });
  }

  public get nodeOptions(): GeneratorNodeOptions {
    return this.nodeOptionsP;
  }
  public setNodeOptions = (options: GeneratorNodeOptions): void => {
    this.nodeOptionsP = options;
  };

  public get edgeOptions(): GeneratorEdgeOptions {
    return this.edgeOptionsP;
  }
  public setEdgeOptions = (options: GeneratorEdgeOptions): void => {
    this.edgeOptionsP = options;
  };

  public get creationCounts(): { numNodes: number; numEdges: number; numGroups: number; nestedLevel: number } {
    return this.creationCountsP;
  }

  public setCreationCounts = (counts: {
    numNodes: number;
    numEdges: number;
    numGroups: number;
    nestedLevel: number;
  }): void => {
    this.creationCountsP = counts;
  };

  public get layout(): string {
    return this.layoutP;
  }
  public setLayout = (newLayout: string): void => {
    this.layoutP = newLayout;
  };

  public get medScale(): number {
    return this.medScaleP;
  }
  public setMedScale = (scale: number): void => {
    this.medScaleP = scale;
  };

  public get lowScale(): number {
    return this.lowScaleP;
  }
  public setLowScale = (scale: number): void => {
    this.lowScaleP = scale;
  };
}

export const DemoContext = createContext<DemoModel>(new DemoModel());
