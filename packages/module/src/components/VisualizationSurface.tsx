import { FunctionComponent, MouseEvent as ReactMouseEvent, ReactNode, useRef, useCallback, useEffect } from 'react';
import { action } from 'mobx';
// https://github.com/mobxjs/mobx-react#observer-batching
import 'mobx-react/batchingForReactDom';
import { observer } from 'mobx-react';
import { debounce, getResizeObserver } from '@patternfly/react-core';
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
  children?: ReactNode;
}

const stopEvent = (e: ReactMouseEvent): void => {
  e.preventDefault();
  e.stopPropagation();
};

const VisualizationSurface: FunctionComponent<VisualizationSurfaceProps> = ({ state }: VisualizationSurfaceProps) => {
  const controller = useVisualizationController();
  const unObserver = useRef<() => void>(null);

  const measureRef = useCallback(
    (ref: HTMLDivElement) => {
      // Remove any previous observer
      if (unObserver.current) {
        unObserver.current();
      }

      if (!ref) {
        return;
      }

      const handleResize = action(() =>
        controller.getGraph().setDimensions(new Dimensions(ref.clientWidth, ref.clientHeight))
      );

      // Set size on initialization
      handleResize();

      const debounceResize = debounce(handleResize, 100);

      // Update graph size on resize events
      unObserver.current = getResizeObserver(ref, debounceResize);
    },
    [controller]
  );

  useEffect(() => {
    return () => {
      if (unObserver.current) {
        unObserver.current();
      }
    };
  }, []);

  useEffect(() => {
    state && controller.setState(state);
  }, [controller, state]);

  if (!controller.hasGraph()) {
    return null;
  }

  const graph = controller.getGraph();

  return (
    <div data-test-id="topology" className={css(styles.topologyVisualizationSurface)} ref={measureRef}>
      <svg className={css(styles.topologyVisualizationSurfaceSvg)} onContextMenu={stopEvent}>
        <SVGDefsProvider>
          <ElementWrapper element={graph} />
        </SVGDefsProvider>
      </svg>
    </div>
  );
};

export default observer(VisualizationSurface);
