import { Controller, EventListener, isNode, Node } from '@patternfly/react-topology';

let positionTimer: NodeJS.Timer;

export const graphPositionChangeListener: EventListener = ({ graph }): void => {
  const scale = graph.getScale();
  const position = graph.getPosition();
  const scaleExtent = graph.getScaleExtent();

  // eslint-disable-next-line no-console
  console.log(`Graph Position Change:\n  Position: ${Math.round(position.x)},${Math.round(position.y)}\n  Scale: ${scale}\n  Scale Extent: max: ${scaleExtent[0]} max: ${scaleExtent[1]}`);

  // After an interval, check that what we got was the final value.
  if (positionTimer) {
    clearTimeout(positionTimer);
  }

  positionTimer = setTimeout(() => {
    const newScale = graph.getScale();
    const newPosition = graph.getPosition();
    const newScaleExtent = graph.getScaleExtent();

    // Output an error if any of the graph position values differ from when the last event was fired
    if (newScale !== scale) {
      // eslint-disable-next-line no-console
      console.error(`Scale Changed: ${scale} => ${newScale}`);
    }
    if (newPosition.x !== position.x || newPosition.y !== position.y) {
      // eslint-disable-next-line no-console
      console.error(`Graph Position Changed: ${Math.round(position.x)},${Math.round(position.y)} => ${Math.round(newPosition.x)},${Math.round(newPosition.y)}`);
    }
    if (newScaleExtent !== scaleExtent) {
      // eslint-disable-next-line no-console
      console.error(`Scale Extent Changed: ${scaleExtent} => ${scaleExtent}`);
    }
  }, 1000);
};

export const layoutEndListener: EventListener = ({ graph }): void => {
  const controller: Controller = graph.getController();
  const positions = controller.getElements().filter(e => isNode(e)).map((node) => `Node: ${node.getLabel()}: ${Math.round((node as Node).getPosition().x)},${Math.round((node as Node).getPosition().y)}`);

  // eslint-disable-next-line no-console
  console.log(`Layout Complete:\n${positions.join('\n')}`);
};
