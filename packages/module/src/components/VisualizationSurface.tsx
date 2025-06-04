import { useRef, useCallback, useEffect, useMemo } from 'react';
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
  const timerId = useRef<NodeJS.Timeout>(null);

  const debounceMeasure = useCallback((func: (contentRect: ContentRect) => void, delay?: number) => {
    return (contentRect: ContentRect) => {
      if (!timerId.current) {
        func(contentRect);
      }
      clearTimeout(timerId.current);

      timerId.current = setTimeout(() => func(contentRect), delay);
    };
  }, []);

  useEffect(() => {
    state && controller.setState(state);
  }, [controller, state]);

  const onMeasure = useMemo(
    () =>
      debounceMeasure(
        action((contentRect: ContentRect) => {
          controller.getGraph().setDimensions(new Dimensions(contentRect.client.width, contentRect.client.height));
        }),
        100
      ),
    [controller, debounceMeasure]
  );

  // dispose of onMeasure
  useEffect(() => () => clearTimeout(timerId.current), [onMeasure]);

  if (!controller.hasGraph()) {
    return null;
  }

  const graph = controller.getGraph();

  // TODO: We need to replace react-measure as it doesn't support React 19. The following
  // casting helps to get topology to build with React 19 versions
  const Wrapper = ReactMeasure as any;

  return (
    <Wrapper client onResize={onMeasure}>
      {({ measureRef }: { measureRef: React.LegacyRef<any> }) => (
        <div data-test-id="topology" className={css(styles.topologyVisualizationSurface)} ref={measureRef}>
          {/* render an outer div because react-measure doesn't seem to fire events properly on svg resize */}
          <svg className={css(styles.topologyVisualizationSurfaceSvg)} onContextMenu={stopEvent}>
            <SVGDefsProvider>
              <ElementWrapper element={graph} />
            </SVGDefsProvider>
          </svg>
        </div>
      )}
    </Wrapper>
  );
};

export default observer(VisualizationSurface);
