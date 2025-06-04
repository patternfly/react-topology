import { useCallback } from 'react';

const useCombineRefs = <RefType extends any>(...refs: (React.Ref<RefType> | undefined)[]) =>
  useCallback(
    (element: RefType | null): void =>
      refs.forEach((ref) => {
        if (ref) {
          if (typeof ref === 'function') {
            ref(element);
          } else {
            (ref as React.MutableRefObject<any>).current = element;
          }
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
export default useCombineRefs;
