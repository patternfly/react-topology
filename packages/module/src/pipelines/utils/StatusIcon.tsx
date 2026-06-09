import AngleDoubleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-double-right-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-warning-fill-icon';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-check-circle-fill-icon';
import CircleIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-harvey-ball-100-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-error-fill-icon';
import NotStartedIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-not-started-icon';
import HourglassHalfIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-hourglass-icon';
import SyncAltIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-sync-alt-icon';
import InProgressIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-in-progress-icon';
import { RunStatus } from '../types';

interface StatusIconProps {
  className?: string;
  status: RunStatus;
  height?: number;
  width?: number;
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, ...props }) => {
  switch (status) {
    case RunStatus.InProgress:
      return <InProgressIcon {...props} />;

    case RunStatus.Running:
      return <SyncAltIcon {...props} />;

    case RunStatus.Succeeded:
      return <CheckCircleIcon {...props} />;

    case RunStatus.Failed:
    case RunStatus.FailedToStart:
      return <ExclamationCircleIcon {...props} />;

    case RunStatus.Idle:
      return <NotStartedIcon {...props} />;

    case RunStatus.Pending:
      return <HourglassHalfIcon {...props} />;

    case RunStatus.Cancelled:
      return <ExclamationTriangleIcon {...props} />;

    case RunStatus.Skipped:
      return <AngleDoubleRightIcon {...props} />;

    default:
      return <CircleIcon {...props} />;
  }
};

export default StatusIcon;
