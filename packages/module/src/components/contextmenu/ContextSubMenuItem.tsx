import * as React from 'react';
import { Menu, DropdownItem } from '@patternfly/react-core';
import AngleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-right-icon';
import { css } from '@patternfly/react-styles';
import topologyStyles from '../../css/topology-components';
// FIXME fully qualified due to the effect of long build times on storybook
import Popper from '../popper/Popper';

interface ContextSubMenuItemProps {
  label: React.ReactNode;
  children: React.ReactNode[];
}

/**
 * Check if an event target implements the [DOM Node interface][1].
 * Needed to prevent runtime errors where the event target is not a DOM node,
 * but `contains` is still called on it.
 *
 * [1]: https://developer.mozilla.org/en-US/docs/Web/API/Node
 */
const implementsDOMNode = (node: any): node is Node => {
  return node && typeof node === 'object' && node.nodeType && node.nodeName;
};

const ContextSubMenuItem: React.FunctionComponent<ContextSubMenuItemProps> = ({ label, children, ...other }) => {
  const nodeRef = React.useRef<HTMLButtonElement>(null);
  const subMenuRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const referenceCb = React.useCallback(() => nodeRef.current || { x: 0, y: 0 }, []);

  return (
    <>
      <DropdownItem
        {...other}
        className={css(topologyStyles.topologyContextSubMenu)}
        ref={nodeRef}
        // prevent this DropdownItem from executing like a normal action item
        onClick={(e) => e.stopPropagation()}
        // mouse enter will open the sub menu
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={(e) => {
          // if the mouse leaves this item, close the sub menu only if the mouse did not enter the sub menu itself
          if (
            !subMenuRef.current ||
            (implementsDOMNode(e.relatedTarget) && !subMenuRef.current.contains(e.relatedTarget))
          ) {
            setOpen(false);
          }
        }}
        onKeyDown={(e) => {
          // open the sub menu on enter or right arrow
          if (e.key === 'ArrowRight' || e.key === 'Enter') {
            setOpen(true);
            e.stopPropagation();
          }
        }}
      >
        {label}
        <AngleRightIcon className={css(topologyStyles.topologyContextSubMenuArrow)} />
      </DropdownItem>
      <Popper
        open={open}
        placement="right-start"
        closeOnEsc
        closeOnOutsideClick
        onRequestClose={(e) => {
          // only close the sub menu if clicking anywhere outside the menu item that owns the sub menu
          if (!e || !nodeRef.current || (implementsDOMNode(e.target) && !nodeRef.current.contains(e.target))) {
            setOpen(false);
          }
        }}
        reference={referenceCb}
        container={nodeRef.current?.closest('.pf-v6-c-menu__content')}
        returnFocus
      >
        <Menu
          onMouseLeave={(e) => {
            // only close the sub menu if the mouse does not enter the item
            if (
              !nodeRef.current ||
              (implementsDOMNode(e.relatedTarget) && !nodeRef.current.contains(e.relatedTarget))
            ) {
              setOpen(false);
            }
          }}
          onKeyDown={(e) => {
            // close the sub menu on left arrow
            if (e.key === 'ArrowLeft') {
              setOpen(false);
              e.stopPropagation();
            }
          }}
          ref={subMenuRef}
          role="presentation"
          isNavFlyout
        >
          {children}
        </Menu>
      </Popper>
    </>
  );
};

export default ContextSubMenuItem;
