import { useState, useCallback, useEffect } from 'react';
import { Dropdown } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import topologyStyles from '../../css/topology-components';
// FIXME fully qualified due to the effect of long build times on storybook
import Popper from '../popper/Popper';

type ContextMenuProps = Pick<
  React.ComponentProps<typeof Popper>,
  'children' | 'container' | 'className' | 'open' | 'reference' | 'onRequestClose'
>;

const ContextMenu: React.FunctionComponent<ContextMenuProps> = ({
  children,
  open = true,
  onRequestClose,
  ...other
}) => {
  const [isOpen, setOpen] = useState(!!open);
  useEffect(() => {
    setOpen(open);
  }, [open]);

  const handleOnRequestClose = useCallback(() => {
    onRequestClose ? onRequestClose() : setOpen(false);
  }, [onRequestClose]);

  useEffect(() => {
    if (isOpen) {
      setOpen(false);
      requestAnimationFrame(() => setOpen(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  return (
    <Popper {...other} closeOnEsc closeOnOutsideClick open={isOpen} onRequestClose={handleOnRequestClose}>
      <Dropdown
        onSelect={handleOnRequestClose}
        toggle={() => <></>}
        className={css(topologyStyles.topologyContextMenuCDropdownMenu)}
        popperProps={{ appendTo: 'inline' }}
      >
        {children}
      </Dropdown>
    </Popper>
  );
};

export default ContextMenu;
