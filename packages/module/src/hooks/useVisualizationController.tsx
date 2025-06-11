import { useContext } from 'react';
import { ControllerContext } from '../utils';
import { Controller } from '../types';

const useVisualizationController = (): Controller => useContext(ControllerContext);

export default useVisualizationController;
