import * as React from 'react';
import { action } from 'mobx';
// https://github.com/mobxjs/mobx-react#observer-batching
import 'mobx-react/batchingForReactDom';
import { observer } from 'mobx-react';
import ReactMeasure, { ContentRect } from 'react-measure';
import { css } from '@patternfly/react-styles';
import styles from '../css/topology-components';
import { State } from '../types';
import SVGDefsProvider from './defs/SVGDefsProvider';
import ElementWrapper from './ElementWrapper';
import Dimensions from '../geom/Dimensions';
import useVisualizationController from '../hooks/useVisualizationController';

interface VisualizationSurfaceProps {
  /** State to be passed to the controller */
  state?: State;
  /** Additional content rendered inside the surface */
  children?: React.ReactNode;
}

const stopEvent = (e: React.MouseEvent): void => {
  e.preventDefault();
  e.stopPropagation();
};

const VisualizationSurface: React.FunctionComponent<VisualizationSurfaceProps> = ({
  state
}: VisualizationSurfaceProps) => {
  const controller = useVisualizationController();
  const timerId = React.useRef<NodeJS.Timer>();

  const debounceMeasure = React.useCallback((func: (contentRect: ContentRect) => void, delay?: number) => {
    return (contentRect: ContentRect) => {
      if (!timerId.current) {
        func(contentRect)
      }
      clearTimeout(timerId.current)

      timerId.current = setTimeout(() => func(contentRect), delay)
    }
  }, []);

  React.useEffect(() => {
    state && controller.setState(state);
  }, [controller, state]);

  const onMeasure = React.useMemo(
    () =>
      debounceMeasure(
        action((contentRect: ContentRect) => {
          controller.getGraph().setDimensions(new Dimensions(contentRect.client.width, contentRect.client.height));
        }),
        100,
      ),
    [controller, debounceMeasure]
  );

  // dispose of onMeasure
  React.useEffect(() => () => clearTimeout(timerId.current), [onMeasure]);

  if (!controller.hasGraph()) {
    return null;
  }

  const graph = controller.getGraph();

  return (
    <ReactMeasure client onResize={onMeasure}>
      {({ measureRef }: { measureRef: React.LegacyRef<any> }) => (
        // render an outer div because react-measure doesn't seem to fire events properly on svg resize
        <div data-test-id="topology" className={css(styles.topologyVisualizationSurface)} ref={measureRef}>
          <svg className={css(styles.topologyVisualizationSurfaceSvg)} onContextMenu={stopEvent}>
            <SVGDefsProvider>
              <ElementWrapper element={graph} />
            </SVGDefsProvider>
          </svg>
        </div>
      )}
    </ReactMeasure>
  );
};

export default observer(VisualizationSurface);
