export { default as ContextMenu } from './ContextMenu';
export { default as ContextSubMenuItem } from './ContextSubMenuItem';

// re-export dropdown components as context menu components
export {
  Divider as ContextMenuSeparator,
  DropdownItem as ContextMenuItem
} from '@patternfly/react-core';
