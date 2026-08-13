import type { OnSelect } from '../behavior';
import { RunStatus } from '../pipelines';
import { action } from '../mobx-exports';
import { MutableRefObject } from 'react';

export const onSelectAndReFocus = (onSelect: OnSelect | undefined, e: React.MouseEvent, focusId: string): void => {
  if (onSelect) {
    onSelect(e);
    requestAnimationFrame(() => {
      const element = document.getElementById(focusId);
      if (element) {
        element.focus();
      }
    });
  }
};

export const handleKeyboardSelection = (
  clickTarget?: MutableRefObject<SVGElement> | MutableRefObject<SVGGElement> | MutableRefObject<Element>
) =>
  action((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();

      const mouseEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });

      if (clickTarget?.current) {
        clickTarget.current.dispatchEvent(mouseEvent);
      } else {
        e.currentTarget.dispatchEvent(mouseEvent);
      }
    }
  });

export const runStatusText = (status?: RunStatus) => {
  switch (status) {
    case RunStatus.Succeeded:
      return 'succeeded';
    case RunStatus.Failed:
      return 'failed';
    case RunStatus.Running:
      return 'running';
    case RunStatus.InProgress:
      return 'in progress';
    case RunStatus.FailedToStart:
      return 'failed to start';
    case RunStatus.Skipped:
      return 'skipped';
    case RunStatus.Cancelled:
      return 'cancelled';
    case RunStatus.Pending:
      return 'pending';
    case RunStatus.Idle:
      return 'idle';
    default:
      return '';
  }
};

export const generateTaskAriaLabel = (label: string, status?: RunStatus) =>
  status ? `${label} (${runStatusText(status)})` : label;
