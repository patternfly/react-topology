import { useRef, useState, useCallback, useEffect } from 'react';
import { reaction } from 'mobx';
import useVisualizationController from './useVisualizationController';

const useVisualizationState = <S extends any>(key: string, initialState?: S): [S, (value: S) => void] => {
  const keyRef = useRef(key);
  if (keyRef.current !== key) {
    throw new Error(`State key change disallowed: ${keyRef.current} => ${key}`);
  }

  const [state, setState] = useState<S>(initialState);
  const controller = useVisualizationController();

  const setControllerState = useCallback(
    (value?: S): void => {
      controller.setState({ [keyRef.current]: value });
    },
    [controller]
  );

  useEffect(() => {
    // init the controller state
    setControllerState(initialState);

    // sync controller state and react state such that the component is re-rendered when controller state changes
    return reaction(
      () => controller.getState()[keyRef.current],
      (value: S) => {
        setState(value);
      }
    );

    // we only want to set the initial state once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller]);

  return [state, setControllerState];
};

export default useVisualizationState;
