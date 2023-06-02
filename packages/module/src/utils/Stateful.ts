import { action, observable, makeObservable } from 'mobx';
import { WithState, State } from '../types';

export default class Stateful implements WithState {
  private state: State = {};

  constructor() {
    makeObservable<Stateful, 'state' | 'setState'>(this, {
      state: observable.shallow,
      setState: action
    });
  }

  getState<S = {}>(): S {
    return this.state as S;
  }

  setState(state: State): void {
    if (state) {
      Object.assign(this.state, state);
    }
  }
}
