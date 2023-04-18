import * as React from 'react';
import AngleDoubleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-double-right-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import CircleIcon from '@patternfly/react-icons/dist/esm/icons/circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import NotStartedIcon from '@patternfly/react-icons/dist/esm/icons/not-started-icon';
import HourglassHalfIcon from '@patternfly/react-icons/dist/esm/icons/hourglass-half-icon';
import SyncAltIcon from '@patternfly/react-icons/dist/esm/icons/sync-alt-icon';
import InProgressIcon from '@patternfly/react-icons/dist/esm/icons/in-progress-icon';
import { RunStatus } from '../types';

interface StatusIconProps {
  className?: string;
  status: RunStatus;
  height?: number;
  width?: number;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, height, width, ...props }) => {
  switch (status) {
    case RunStatus.InProgress:
      return <InProgressIcon {...props} width={width || '1em'} height={height || '1em'} />;

    case RunStatus.Running:
      return <SyncAltIcon {...props} width={width || '1em'} height={height || '1em'} />;

    case RunStatus.Succeeded:
      return <CheckCircleIcon {...props} width={width || '1em'} height={height || '1em'} />;

    case RunStatus.Failed:
    case RunStatus.FailedToStart:
      return <ExclamationCircleIcon {...props} width={width || '1em'} height={height || '1em'} />;

    case RunStatus.Idle:
      return <NotStartedIcon {...props} width={width || '1em'} height={height || '1em'} />;

    case RunStatus.Pending:
      return <HourglassHalfIcon {...props} width={width || '1em'} height={height || '1em'} />;

    case RunStatus.Cancelled:
      return <ExclamationTriangleIcon {...props} width={width || '1em'} height={height || '1em'} />;

    case RunStatus.Skipped:
      return <AngleDoubleRightIcon {...props} width={width || '1em'} height={height || '1em'} />;

    default:
      return <CircleIcon {...props} width={width || '1em'} height={height || '1em'} />;
  }
};

export default StatusIcon;
