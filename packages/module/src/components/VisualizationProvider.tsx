import { useRef } from 'react';
import ControllerContext from '../utils/ControllerContext';
import { Controller } from '../types';
import { Visualization } from '../Visualization';

interface VisualizationProviderProps {
  /** The graph controller to store in context */
  controller?: Controller;
  /** Content rendered inside the surface */
  children?: React.ReactNode;
}

const VisualizationProvider: React.FunctionComponent<VisualizationProviderProps> = ({
  controller,
  children
}: VisualizationProviderProps) => {
  const controllerRef = useRef<Controller>(null);
  if (controller && controllerRef.current !== controller) {
    controllerRef.current = controller;
  } else if (!controllerRef.current) {
    controllerRef.current = new Visualization();
  }

  return <ControllerContext.Provider value={controllerRef.current}>{children}</ControllerContext.Provider>;
};

export default VisualizationProvider;
