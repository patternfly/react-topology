import { VisualizationProvider, VisualizationSurface } from '@patternfly/react-topology';

const withTopologySetup = (WrappedComponent: React.ComponentType) => () =>
  (
    <VisualizationProvider>
      <WrappedComponent />
      <VisualizationSurface />
    </VisualizationProvider>
  );

export default withTopologySetup;
