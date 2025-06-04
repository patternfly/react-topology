import { Fragment, PureComponent } from 'react';
import { DefsState, DefsMap } from './SVGDefsProvider';
export class Defs extends PureComponent<{}, DefsState> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }
  public setDefs(defs: DefsMap) {
    // setting the state will re-render this component
    this.setState({ defs: { ...defs } });
  }
  render() {
    const { defs } = this.state;
    return defs ? (
      <defs>
        {Object.keys(defs).map((id) => (
          <Fragment key={id}>{defs[id].node}</Fragment>
        ))}
      </defs>
    ) : null;
  }
}
