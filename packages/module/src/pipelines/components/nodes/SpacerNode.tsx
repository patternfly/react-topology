import * as React from 'react';
import { observer } from '../../../mobx-exports';
import { GraphElement } from '../../../types';

const SpacerNode: React.FC<{ element: GraphElement }> = () => <g />;

export default observer(SpacerNode);
