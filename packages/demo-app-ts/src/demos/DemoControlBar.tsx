import {
  createTopologyControlButtons,
  defaultControlButtonsOptions,
  TopologyControlBar,
  useVisualizationController,
  action
} from '@patternfly/react-topology';

const DemoControlBar: React.FC<{ collapseAllCallback?: (collapseAll: boolean) => void }> = ({
  collapseAllCallback
}) => {
  const controller = useVisualizationController();

  return (
    <TopologyControlBar
      controlButtons={createTopologyControlButtons({
        ...defaultControlButtonsOptions,
        expandAll: !!collapseAllCallback,
        collapseAll: !!collapseAllCallback,
        zoomInCallback: action(() => {
          controller.getGraph().scaleBy(4 / 3);
        }),
        zoomOutCallback: action(() => {
          controller.getGraph().scaleBy(0.75);
        }),
        fitToScreenCallback: action(() => {
          controller.getGraph().fit(80);
        }),
        resetViewCallback: action(() => {
          controller.getGraph().reset();
          controller.getGraph().layout();
        }),
        expandAllCallback: action(() => {
          collapseAllCallback(false);
        }),
        collapseAllCallback: action(() => {
          collapseAllCallback(true);
        }),
        legend: false
      })}
    />
  );
};

export default DemoControlBar;
