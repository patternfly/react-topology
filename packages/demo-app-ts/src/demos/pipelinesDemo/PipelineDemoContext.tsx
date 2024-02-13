import * as React from 'react';
import { makeObservable, observable, action } from 'mobx';

export class PipelineDemoModel {
  protected showIconsP: boolean = false;
  protected showBadgesP: boolean = false;
  protected showBadgeTooltipsP: boolean = false;
  protected showContextMenusP: boolean = false;
  protected showGroupsP: boolean = false;
  protected verticalLayoutP: boolean = false;

  constructor() {
    makeObservable<
      PipelineDemoModel,
      | 'showIconsP'
      | 'showBadgesP'
      | 'showBadgeTooltipsP'
      | 'showContextMenusP'
      | 'showGroupsP'
      | 'verticalLayoutP'
      >(this, {
      showIconsP: observable,
      showBadgesP: observable,
      showBadgeTooltipsP: observable,
      showContextMenusP: observable,
      showGroupsP: observable,
      verticalLayoutP: observable,
      setShowIcons: action,
      setShowBadges: action,
      setShowBadgeTooltips: action,
      setShowContextMenus: action,
      setShowGroups: action,
      setVerticalLayout: action,
    });
  }

  public get showIcons(): boolean {
    return this.showIconsP;
  }
  public setShowIcons = (show: boolean): void => {
    this.showIconsP = show;
  }

  public get showBadges(): boolean {
    return this.showBadgesP;
  }
  public setShowBadges = (show: boolean): void => {
    this.showBadgesP = show;
  }

  public get showBadgeTooltips(): boolean {
    return this.showBadgeTooltipsP;
  }
  public setShowBadgeTooltips = (show: boolean): void => {
    this.showBadgeTooltipsP = show;
  }

  public get showContextMenus(): boolean {
    return this.showContextMenusP;
  }
  public setShowContextMenus = (show: boolean): void => {
    this.showContextMenusP = show;
  }

  public get showGroups(): boolean {
    return this.showGroupsP;
  }
  public setShowGroups = (show: boolean): void => {
    this.showGroupsP = show;
  }

  public get verticalLayout(): boolean {
    return this.verticalLayoutP;
  }
  public setVerticalLayout = (show: boolean): void => {
    this.verticalLayoutP = show;
  }
}

export const PipelineDemoContext = React.createContext<PipelineDemoModel>(new PipelineDemoModel());