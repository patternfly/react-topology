import { useEffect } from 'react';
import { ElementFactory } from '../types';
import useVisualizationController from './useVisualizationController';

const useElementFactory = (factory: ElementFactory): void => {
  const controller = useVisualizationController();
  useEffect(() => {
    controller.registerElementFactory(factory);
    // TODO support unregister?
  }, [controller, factory]);
};

export default useElementFactory;
