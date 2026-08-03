import { createContext, useContext } from 'react';
import { action, makeObservable, observable } from 'mobx';

export class AggregateEdgesDemoModel {
  private groupEdgesP: boolean = false;
  protected showEdgeLabelsP: boolean = false;
  protected showMetricTagsP: boolean = false;
  protected snapGenerationP: number = 0;
  protected onCollapseChangeP: () => void;

  constructor() {
    makeObservable<
      AggregateEdgesDemoModel,
      'groupEdgesP' | 'showEdgeLabelsP' | 'showMetricTagsP' | 'snapGenerationP' | 'onCollapseChangeP'
    >(this, {
      groupEdgesP: observable,
      showEdgeLabelsP: observable,
      showMetricTagsP: observable,
      onCollapseChangeP: observable,
      snapGenerationP: observable,
      setGroupEdges: action,
      setShowEdgeLabels: action,
      setShowMetricTags: action,
      bumpSnapGeneration: action,
      setOnCollapseChange: action
    });
  }

  public get groupEdges(): boolean {
    return this.groupEdgesP;
  }
  public setGroupEdges = (grouped: boolean): void => {
    this.groupEdgesP = grouped;
  };
  public get showEdgeLabels(): boolean {
    return this.showEdgeLabelsP;
  }
  public setShowEdgeLabels = (show: boolean): void => {
    this.showEdgeLabelsP = show;
  };
  public get showMetricTags(): boolean {
    return this.showMetricTagsP;
  }
  public setShowMetricTags = (show: boolean): void => {
    this.showMetricTagsP = show;
  };
  public get snapGeneration(): number {
    return this.snapGenerationP;
  }
  public bumpSnapGeneration = (): void => {
    this.snapGenerationP = this.snapGenerationP + 1;
  };
  public get onCollapseChange(): () => void {
    return this.onCollapseChangeP;
  }
  public setOnCollapseChange = (onChange: () => void): void => {
    this.onCollapseChangeP = onChange;
  };
}
export const AggregateEdgesDemoContext = createContext<AggregateEdgesDemoModel>(new AggregateEdgesDemoModel());

export const AggregateEdgesDemoProvider = AggregateEdgesDemoContext.Provider;

export const useAggregateEdgesDemo = (): AggregateEdgesDemoModel => useContext(AggregateEdgesDemoContext);
