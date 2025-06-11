import { useRef, useState, useCallback, useEffect } from 'react';
import PopperJS, { PopperOptions } from 'popper.js';
import useCombineRefs from '../../utils/useCombineRefs';
import Portal from './Portal';

// alignment with PopperJS reference API
interface PopperJSReference {
  getBoundingClientRect: PopperJS['reference']['getBoundingClientRect'];
  clientWidth: number;
  clientHeight: number;
}

interface ClientRectProp {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

type Reference = Element | PopperJSReference | ClientRectProp;

class VirtualReference implements PopperJSReference {
  private rect: ClientRect;

  constructor({ height = 0, width = 0, x, y }: ClientRectProp) {
    this.rect = {
      bottom: y + height,
      height,
      left: x,
      right: x + width,
      top: y,
      width,
      x,
      y,
      toJSON: () => {}
    };
  }

  getBoundingClientRect(): ClientRect {
    return this.rect;
  }

  get clientWidth(): number {
    return this.rect.width || 0;
  }

  get clientHeight(): number {
    return this.rect.height || 0;
  }
}

const getReference = (reference: Reference): PopperJSReference =>
  'getBoundingClientRect' in reference ? reference : new VirtualReference(reference);

interface PopperProps {
  children?: React.ReactNode;
  closeOnEsc?: boolean;
  closeOnOutsideClick?: boolean;
  container?: React.ComponentProps<typeof Portal>['container'];
  className?: string;
  open?: boolean;
  onRequestClose?: (e?: Event) => void;
  placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top';
  popperOptions?: PopperOptions;
  popperRef?: React.Ref<PopperJS>;
  reference: Reference | (() => Reference);
  zIndex?: number;
  returnFocus?: boolean;
}

const DEFAULT_POPPER_OPTIONS: PopperOptions = {};

const Popper: React.FunctionComponent<PopperProps> = ({
  children,
  container,
  className,
  open,
  placement = 'bottom-start',
  reference,
  popperOptions = DEFAULT_POPPER_OPTIONS,
  closeOnEsc,
  closeOnOutsideClick,
  onRequestClose,
  popperRef: popperRefIn,
  zIndex = 9999,
  returnFocus
}) => {
  const controlled = typeof open === 'boolean';
  const openProp = controlled ? open || false : true;
  const nodeRef = useRef<Element>(null);
  const popperRef = useRef<PopperJS>(null);
  const popperRefs = useCombineRefs<PopperJS>(popperRef, popperRefIn);
  const [isOpen, setOpenState] = useState(openProp);
  const focusRef = useRef<Element | null>(null);
  const onRequestCloseRef = useRef(onRequestClose);
  onRequestCloseRef.current = onRequestClose;

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (returnFocus && newOpen !== isOpen) {
        if (newOpen) {
          if (document.activeElement) {
            focusRef.current = document.activeElement;
          }
        } else if (focusRef.current instanceof HTMLElement && focusRef.current.ownerDocument) {
          focusRef.current.focus();
        }
      }
      setOpenState(newOpen);
    },
    [returnFocus, isOpen]
  );

  useEffect(() => {
    setOpen(openProp);
  }, [openProp, setOpen]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        controlled ? onRequestCloseRef.current && onRequestCloseRef.current() : setOpen(false);
      }
    },
    [controlled, setOpen]
  );

  const onClickOutside = useCallback(
    (e: Event) => {
      if (!nodeRef.current || (e.target instanceof Node && !nodeRef.current.contains(e.target))) {
        controlled ? onRequestCloseRef.current && onRequestCloseRef.current(e) : setOpen(false);
      }
    },
    [controlled, setOpen]
  );

  const destroy = useCallback(() => {
    if (popperRef.current) {
      popperRef.current.destroy();
      popperRefs(null);
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('mousedown', onClickOutside, true);
      document.removeEventListener('touchstart', onClickOutside, true);
    }
  }, [onClickOutside, onKeyDown, popperRefs]);

  const initialize = useCallback(() => {
    if (!nodeRef.current || !reference || !isOpen) {
      return;
    }

    destroy();

    popperRefs(
      new PopperJS(getReference(typeof reference === 'function' ? reference() : reference), nodeRef.current, {
        placement,
        ...popperOptions,
        modifiers: {
          preventOverflow: {
            boundariesElement: 'viewport'
          },
          ...popperOptions.modifiers
        }
      })
    );

    // init document listenerrs
    if (closeOnEsc) {
      document.addEventListener('keydown', onKeyDown, true);
    }
    if (closeOnOutsideClick) {
      document.addEventListener('mousedown', onClickOutside, true);
      document.addEventListener('touchstart', onClickOutside, true);
    }
  }, [
    popperRefs,
    reference,
    isOpen,
    destroy,
    placement,
    popperOptions,
    closeOnEsc,
    closeOnOutsideClick,
    onKeyDown,
    onClickOutside
  ]);

  const nodeRefCallback = useCallback<React.RefCallback<HTMLDivElement>>(
    (node) => {
      nodeRef.current = node;
      initialize();
    },
    [initialize]
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(
    () => () => {
      destroy();
    },
    [destroy]
  );

  useEffect(() => {
    if (!isOpen) {
      destroy();
    }
  }, [destroy, isOpen]);

  return isOpen ? (
    <Portal container={container}>
      <div ref={nodeRefCallback} className={className} style={{ zIndex }}>
        {children}
      </div>
    </Portal>
  ) : null;
};

export default Popper;
