import { useEffect } from 'react';
import useVisualizationController from './useVisualizationController';
import { Model } from '../types';

const useModel = (model: Model): void => {
  const controller = useVisualizationController();

  useEffect(() => {
    controller.fromModel(model);
  }, [controller, model]);
};

export default useModel;
