import * as React from 'react';
import {
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  GenerateId,
  Tooltip
} from '@patternfly/react-core';
import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-icon';
import ExpandArrowsAltIcon from '@patternfly/react-icons/dist/esm/icons/expand-arrows-alt-icon';
import SearchPlusIcon from '@patternfly/react-icons/dist/esm/icons/search-plus-icon';
import SearchMinusIcon from '@patternfly/react-icons/dist/esm/icons/search-minus-icon';
import CollapseIcon from '@patternfly/react-icons/dist/esm/icons/compress-alt-icon';
import ExpandAltIcon from '@patternfly/react-icons/dist/esm/icons/expand-alt-icon';

import '../../css/topology-controlbar';

/* ID's for common control buttons */
export const ZOOM_IN = 'zoom-in';
export const ZOOM_OUT = 'zoom-out';
export const FIT_TO_SCREEN = 'fit-to-screen';
export const RESET_VIEW = 'reset-view';
export const EXPAND_ALL = 'expand-all';
export const COLLAPSE_ALL = 'collapse-all';
export const LEGEND = 'legend';

/* Data needed for each control button */
export interface TopologyControlButton {
  id: any;
  icon: React.ReactNode;
  tooltip?: React.ReactNode;
  ariaLabel?: string;
  callback?: (id: any) => void;
  disabled?: boolean;
  hidden?: boolean;
}

/* Options for creating the control buttons */
export interface TopologyControlButtonsOptions {
  zoomIn: boolean;
  zoomInIcon: React.ReactNode;
  zoomInTip: React.ReactNode;
  zoomInAriaLabel: string;
  zoomInCallback: (id: any) => void;
  zoomInDisabled: boolean;
  zoomInHidden: boolean;

  zoomOut: boolean;
  zoomOutIcon: React.ReactNode;
  zoomOutTip: React.ReactNode;
  zoomOutAriaLabel: string;
  zoomOutCallback: (id: any) => void;
  zoomOutDisabled: boolean;
  zoomOutHidden: boolean;

  fitToScreen: boolean;
  fitToScreenIcon: React.ReactNode;
  fitToScreenTip: React.ReactNode;
  fitToScreenAriaLabel: string;
  fitToScreenCallback: (id: any) => void;
  fitToScreenDisabled: boolean;
  fitToScreenHidden: boolean;

  resetView: boolean;
  resetViewIcon: React.ReactNode;
  resetViewTip: React.ReactNode;
  resetViewAriaLabel: string;
  resetViewCallback: (id: any) => void;
  resetViewDisabled: boolean;
  resetViewHidden: boolean;

  expandAll: boolean;
  expandAllIcon: React.ReactNode;
  expandAllTip: React.ReactNode;
  expandAllAriaLabel: string;
  expandAllCallback: (id: any) => void;
  expandAllDisabled: boolean;
  expandAllHidden: boolean;

  collapseAll: boolean;
  collapseAllIcon: React.ReactNode;
  collapseAllTip: React.ReactNode;
  collapseAllAriaLabel: string;
  collapseAllCallback: (id: any) => void;
  collapseAllDisabled: boolean;
  collapseAllHidden: boolean;

  legend: boolean;
  legendIcon: React.ReactNode;
  legendTip: string;
  legendAriaLabel: string;
  legendCallback: (id: any) => void;
  legendDisabled: boolean;
  legendHidden: boolean;

  customButtons: TopologyControlButton[];
}

/* Default options for creating control buttons */
export const defaultControlButtonsOptions: TopologyControlButtonsOptions = {
  zoomIn: true,
  zoomInIcon: <SearchPlusIcon />,
  zoomInTip: 'Zoom In',
  zoomInAriaLabel: 'Zoom In',
  zoomInCallback: null,
  zoomInDisabled: false,
  zoomInHidden: false,

  zoomOut: true,
  zoomOutIcon: <SearchMinusIcon />,
  zoomOutTip: 'Zoom Out',
  zoomOutAriaLabel: 'Zoom Out',
  zoomOutCallback: null,
  zoomOutDisabled: false,
  zoomOutHidden: false,

  fitToScreen: true,
  fitToScreenIcon: <ExpandArrowsAltIcon />,
  fitToScreenTip: 'Fit to Screen',
  fitToScreenAriaLabel: 'Fit to Screen',
  fitToScreenCallback: null,
  fitToScreenDisabled: false,
  fitToScreenHidden: false,

  resetView: true,
  resetViewIcon: <ExpandIcon />,
  resetViewTip: 'Reset View',
  resetViewAriaLabel: 'Reset View',
  resetViewCallback: null,
  resetViewDisabled: false,
  resetViewHidden: false,

  expandAll: false,
  expandAllIcon: <ExpandAltIcon />,
  expandAllTip: 'Expand All',
  expandAllAriaLabel: 'Expand All',
  expandAllCallback: null,
  expandAllDisabled: false,
  expandAllHidden: false,

  collapseAll: false,
  collapseAllIcon: <CollapseIcon />,
  collapseAllTip: 'Collapse All',
  collapseAllAriaLabel: 'Collapse All',
  collapseAllCallback: null,
  collapseAllDisabled: false,
  collapseAllHidden: false,

  legend: true,
  legendIcon: 'Legend',
  legendTip: '',
  legendAriaLabel: null,
  legendCallback: null,
  legendDisabled: false,
  legendHidden: false,

  customButtons: []
};

/* Utility function to create the common control buttons, can pass null for all defaults, or specify overrides */
export const createTopologyControlButtons = ({
  zoomIn = defaultControlButtonsOptions.zoomIn,
  zoomInIcon = defaultControlButtonsOptions.zoomInIcon,
  zoomInTip = defaultControlButtonsOptions.zoomInTip,
  zoomInAriaLabel = defaultControlButtonsOptions.zoomInAriaLabel,
  zoomInCallback = defaultControlButtonsOptions.zoomInCallback,
  zoomInDisabled = defaultControlButtonsOptions.zoomInDisabled,
  zoomInHidden = defaultControlButtonsOptions.zoomInHidden,

  zoomOut = defaultControlButtonsOptions.zoomOut,
  zoomOutIcon = defaultControlButtonsOptions.zoomOutIcon,
  zoomOutTip = defaultControlButtonsOptions.zoomOutTip,
  zoomOutAriaLabel = defaultControlButtonsOptions.zoomOutAriaLabel,
  zoomOutCallback = defaultControlButtonsOptions.zoomOutCallback,
  zoomOutDisabled = defaultControlButtonsOptions.zoomOutDisabled,
  zoomOutHidden = defaultControlButtonsOptions.zoomOutHidden,

  fitToScreen = defaultControlButtonsOptions.fitToScreen,
  fitToScreenIcon = defaultControlButtonsOptions.fitToScreenIcon,
  fitToScreenTip = defaultControlButtonsOptions.fitToScreenTip,
  fitToScreenAriaLabel = defaultControlButtonsOptions.fitToScreenAriaLabel,
  fitToScreenCallback = defaultControlButtonsOptions.fitToScreenCallback,
  fitToScreenDisabled = defaultControlButtonsOptions.fitToScreenDisabled,
  fitToScreenHidden = defaultControlButtonsOptions.fitToScreenHidden,

  resetView = defaultControlButtonsOptions.resetView,
  resetViewIcon = defaultControlButtonsOptions.resetViewIcon,
  resetViewTip = defaultControlButtonsOptions.resetViewTip,
  resetViewAriaLabel = defaultControlButtonsOptions.resetViewAriaLabel,
  resetViewCallback = defaultControlButtonsOptions.resetViewCallback,
  resetViewDisabled = defaultControlButtonsOptions.resetViewDisabled,
  resetViewHidden = defaultControlButtonsOptions.resetViewHidden,

  expandAll = defaultControlButtonsOptions.expandAll,
  expandAllIcon = defaultControlButtonsOptions.expandAllIcon,
  expandAllTip = defaultControlButtonsOptions.expandAllTip,
  expandAllAriaLabel = defaultControlButtonsOptions.expandAllAriaLabel,
  expandAllCallback = defaultControlButtonsOptions.expandAllCallback,
  expandAllDisabled = defaultControlButtonsOptions.expandAllDisabled,
  expandAllHidden = defaultControlButtonsOptions.expandAllHidden,

  collapseAll = defaultControlButtonsOptions.collapseAll,
  collapseAllIcon = defaultControlButtonsOptions.collapseAllIcon,
  collapseAllTip = defaultControlButtonsOptions.collapseAllTip,
  collapseAllAriaLabel = defaultControlButtonsOptions.collapseAllAriaLabel,
  collapseAllCallback = defaultControlButtonsOptions.collapseAllCallback,
  collapseAllDisabled = defaultControlButtonsOptions.collapseAllDisabled,
  collapseAllHidden = defaultControlButtonsOptions.collapseAllHidden,

  legend = defaultControlButtonsOptions.legend,
  legendIcon = defaultControlButtonsOptions.legendIcon,
  legendTip = defaultControlButtonsOptions.legendTip,
  legendAriaLabel = defaultControlButtonsOptions.legendAriaLabel,
  legendCallback = defaultControlButtonsOptions.legendCallback,
  legendDisabled = defaultControlButtonsOptions.legendDisabled,
  legendHidden = defaultControlButtonsOptions.legendHidden,

  customButtons = defaultControlButtonsOptions.customButtons
}: TopologyControlButtonsOptions = defaultControlButtonsOptions): TopologyControlButton[] => {
  const controlButtons: TopologyControlButton[] = [];

  if (zoomIn) {
    controlButtons.push({
      id: ZOOM_IN,
      icon: zoomInIcon,
      tooltip: zoomInTip,
      ariaLabel: zoomInAriaLabel,
      callback: zoomInCallback,
      disabled: zoomInDisabled,
      hidden: zoomInHidden
    });
  }

  if (zoomOut) {
    controlButtons.push({
      id: ZOOM_OUT,
      icon: zoomOutIcon,
      tooltip: zoomOutTip,
      ariaLabel: zoomOutAriaLabel,
      callback: zoomOutCallback,
      disabled: zoomOutDisabled,
      hidden: zoomOutHidden
    });
  }

  if (fitToScreen) {
    controlButtons.push({
      id: FIT_TO_SCREEN,
      icon: fitToScreenIcon,
      tooltip: fitToScreenTip,
      ariaLabel: fitToScreenAriaLabel,
      callback: fitToScreenCallback,
      disabled: fitToScreenDisabled,
      hidden: fitToScreenHidden
    });
  }

  if (resetView) {
    controlButtons.push({
      id: RESET_VIEW,
      icon: resetViewIcon,
      tooltip: resetViewTip,
      ariaLabel: resetViewAriaLabel,
      callback: resetViewCallback,
      disabled: resetViewDisabled,
      hidden: resetViewHidden
    });
  }

  if (expandAll) {
    controlButtons.push({
      id: EXPAND_ALL,
      icon: expandAllIcon,
      tooltip: expandAllTip,
      ariaLabel: expandAllAriaLabel,
      callback: expandAllCallback,
      disabled: expandAllDisabled,
      hidden: expandAllHidden
    });
  }

  if (collapseAll) {
    controlButtons.push({
      id: COLLAPSE_ALL,
      icon: collapseAllIcon,
      tooltip: collapseAllTip,
      ariaLabel: collapseAllAriaLabel,
      callback: collapseAllCallback,
      disabled: collapseAllDisabled,
      hidden: collapseAllHidden
    });
  }

  if (customButtons) {
    controlButtons.push(...customButtons);
  }

  if (legend) {
    controlButtons.push({
      id: LEGEND,
      icon: legendIcon,
      tooltip: legendTip,
      ariaLabel: legendAriaLabel,
      callback: legendCallback,
      disabled: legendDisabled,
      hidden: legendHidden
    });
  }

  return controlButtons;
};

export interface TopologyControlBarProps extends React.HTMLProps<HTMLDivElement> {
  /** Additional classes added to the control bar */
  className?: string;
  /** Any extra child nodes (placed after the buttons) */
  children?: React.ReactNode;
  /** Buttons to be added to the bar */
  controlButtons?: TopologyControlButton[];
  /** Callback when any button is clicked, id of the clicked button is passed */
  onButtonClick?: (id: any) => void;
}

export const TopologyControlBar: React.FunctionComponent<TopologyControlBarProps> = ({
  className = null,
  children = null,
  controlButtons = [],
  onButtonClick = () => undefined
}: TopologyControlBarProps) => {
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, button: TopologyControlButton) => {
    event.preventDefault();
    onButtonClick(button.id);
    if (button.callback) {
      button.callback(button.id);
    }
  };

  const renderButton = (button: TopologyControlButton): React.ReactNode => {
    const renderedButton = (
      <Button
        id={button.id}
        className={`pf-topology-control-bar__button${button.disabled ? ' pf-m-disabled' : ''}`}
        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleButtonClick(event, button)}
        disabled={button.disabled}
        aria-disabled={button.disabled}
        variant="tertiary"
      >
        {button.icon}
        {(button.ariaLabel || button.tooltip) && (
          <span className="pf-v6-screen-reader">{button.ariaLabel || button.tooltip}</span>
        )}
      </Button>
    );

    if (button.tooltip) {
      return <Tooltip content={button.tooltip}>{renderedButton}</Tooltip>;
    }

    return renderedButton;
  };

  return (
    <GenerateId prefix="pf-topology-control-bar-">
      {(randomId) => (
        <Toolbar className={className} style={{ backgroundColor: 'transparent' }} id={randomId}>
          <ToolbarContent>
            <ToolbarGroup gap={{ default: 'gapNone' }}>
              {controlButtons.map((button: TopologyControlButton) =>
                button.hidden ? null : <ToolbarItem key={button.id}>{renderButton(button)}</ToolbarItem>
              )}
              {children}
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      )}
    </GenerateId>
  );
};
TopologyControlBar.displayName = 'TopologyControlBar';
