import { ElementFactory, GraphElement, ModelKind } from '../../types';
import BasePipelineNode from './BasePipelineNode';

const pipelineElementFactory: ElementFactory = (kind: ModelKind): GraphElement | undefined => {
  switch (kind) {
    case ModelKind.node:
      return new BasePipelineNode();
    default:
      return undefined;
  }
};

export default pipelineElementFactory;
