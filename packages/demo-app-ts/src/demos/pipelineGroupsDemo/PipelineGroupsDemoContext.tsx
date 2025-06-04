import { createContext } from 'react';
import { makeObservable, observable, action } from 'mobx';

export class PipelineGroupsDemoModel {
  protected verticalLayoutP: boolean = true;

  constructor() {
    makeObservable<PipelineGroupsDemoModel, 'verticalLayoutP'>(this, {
      verticalLayoutP: observable,
      setVerticalLayout: action
    });
  }

  public get verticalLayout(): boolean {
    return this.verticalLayoutP;
  }
  public setVerticalLayout = (show: boolean): void => {
    this.verticalLayoutP = show;
  };
}

export const PipelineGroupsDemoContext = createContext<PipelineGroupsDemoModel>(new PipelineGroupsDemoModel());
