import { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import ContextMenu from './ContextMenu';
import { ContextMenuItem } from './index';

jest.mock('../popper/Popper', () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div data-testid="mock-popper">{children}</div>
}));

describe('ContextMenu', () => {
  it('should render menu items inside the topology popper and close on select', () => {
    const onRequestClose = jest.fn();

    render(
      <ContextMenu reference={{ x: 120, y: 140 }} onRequestClose={onRequestClose}>
        <ContextMenuItem>First</ContextMenuItem>
      </ContextMenu>
    );

    expect(screen.getByTestId('mock-popper')).toBeInTheDocument();

    const menuItem = screen.getByRole('menuitem', { name: 'First' });
    fireEvent.click(menuItem);

    expect(onRequestClose).toHaveBeenCalledTimes(1);
  });
});
