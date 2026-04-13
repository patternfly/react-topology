import { ReactNode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { WithContextMenuProps, withContextMenu } from './withContextMenu';

let capturedReference: unknown;

jest.mock('../components/contextmenu/ContextMenu', () => ({
  __esModule: true,
  default: ({ children, reference }: { children: ReactNode; reference: unknown }) => {
    capturedReference = reference;
    return <div data-testid="context-menu">{children}</div>;
  }
}));

const WrappedComponent = ({ onContextMenu }: WithContextMenuProps) => (
  <div data-testid="wrapped-node" onContextMenu={onContextMenu}>
    Wrapped node
  </div>
);

describe('withContextMenu', () => {
  beforeEach(() => {
    capturedReference = undefined;
  });

  it('should use viewport coordinates for point-based context menus', async () => {
    const ComponentWithContextMenu = withContextMenu(() => [<div key="action">Action</div>])(WrappedComponent);

    render(<ComponentWithContextMenu />);

    await act(async () => {
      fireEvent.contextMenu(screen.getByTestId('wrapped-node'), {
        clientX: 120,
        clientY: 140,
        pageX: 420,
        pageY: 540
      });
    });

    expect(await screen.findByTestId('context-menu')).toBeInTheDocument();
    expect(capturedReference).toEqual({ x: 120, y: 140 });
  });
});
