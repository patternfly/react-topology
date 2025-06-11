import { useState, useRef, useCallback } from 'react';

interface Size {
  width: number;
  height: number;
}

const EMPTY: any[] = [];

export const useSize = (dependencies: any[] = EMPTY): [Size | undefined, (node: SVGGraphicsElement) => void] => {
  const [size, setSize] = useState<Size>();
  const sizeRef = useRef<Size | undefined>(undefined);
  sizeRef.current = size;

  const callbackRef = useCallback((node: SVGGraphicsElement): void => {
    if (node != null) {
      const bb = node.getBBox();
      if (!sizeRef.current || sizeRef.current.width !== bb.width || sizeRef.current.height !== bb.height) {
        setSize({ width: bb.width, height: bb.height });
      }
    }
    // dynamic dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
  return [size, callbackRef];
};
