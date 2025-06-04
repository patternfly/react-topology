import { useEffect } from 'react';
import { ComponentFactory } from '../types';
import useVisualizationController from './useVisualizationController';

const useComponentFactory = (factory: ComponentFactory): void => {
  const controller = useVisualizationController();
  useEffect(() => {
    controller.registerComponentFactory(factory);
    // TODO support unregister?
  }, [controller, factory]);
};

export default useComponentFactory;
