import { useContext, useState, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react';
import { Spinner } from '@patternfly/react-core';
import { GraphElement as TopologyElement } from '../types';
import ElementContext from '../utils/ElementContext';
import ContextMenu from '../components/contextmenu/ContextMenu';

type Reference = React.ComponentProps<typeof ContextMenu>['reference'];

export interface WithContextMenuProps {
  onContextMenu?: (e: React.MouseEvent) => void;
  contextMenuOpen?: boolean;
}

export const withContextMenu =
  <E extends TopologyElement>(
    actions: (element: E) => React.ReactElement[] | Promise<React.ReactElement[]>,
    container?: Element | null | undefined | (() => Element),
    className?: string,
    atPoint: boolean = true,
    waitElement: React.ReactElement = <Spinner className="pf-v6-u-mx-md" size="md" />
  ) =>
  <P extends WithContextMenuProps>(WrappedComponent: React.ComponentType<P>) => {
    const Component: React.FunctionComponent<Omit<P, keyof WithContextMenuProps>> = (props) => {
      const element = useContext(ElementContext);
      const [reference, setReference] = useState<Reference | null>(null);
      const [elementActions, setElementActions] = useState<React.ReactElement[] | null>(null);
      const onContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setReference(
          atPoint
            ? {
                x: e.pageX,
                y: e.pageY
              }
            : e.currentTarget
        );
      }, []);

      useEffect(() => {
        if (reference) {
          const actionsElements = actions(element as E);
          Promise.resolve(actionsElements).then((resultActions) => {
            setElementActions(resultActions);
          });
        } else {
          setElementActions(null);
        }
      }, [element, reference]);

      return (
        <>
          <WrappedComponent {...(props as any)} onContextMenu={onContextMenu} contextMenuOpen={!!reference} />
          {reference ? (
            <ContextMenu
              reference={reference}
              container={container}
              className={className}
              open
              onRequestClose={() => setReference(null)}
            >
              {elementActions || waitElement}
            </ContextMenu>
          ) : null}
        </>
      );
    };
    Component.displayName = `withContextMenu(${WrappedComponent.displayName || WrappedComponent.name})`;
    return observer(Component);
  };
