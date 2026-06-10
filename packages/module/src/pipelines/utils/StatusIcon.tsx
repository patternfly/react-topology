import RhUiDoubleCaretRightIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-double-caret-right-icon';
import RhUiWarningFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-warning-fill-icon';
import RhUiCheckCircleFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-check-circle-fill-icon';
import RhUiHarveyBall100Icon from '@patternfly/react-icons/dist/esm/icons/rh-ui-harvey-ball-100-icon';
import RhUiErrorFillIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-error-fill-icon';
import RhUiNotStartedIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-not-started-icon';
import RhUiHourglassIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-hourglass-icon';
import RhUiSyncAltIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-sync-alt-icon';
import RhUiInProgressIcon from '@patternfly/react-icons/dist/esm/icons/rh-ui-in-progress-icon';
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
      return <RhUiInProgressIcon {...props} />;

    case RunStatus.Running:
      return <RhUiSyncAltIcon {...props} />;

    case RunStatus.Succeeded:
      return <RhUiCheckCircleFillIcon {...props} />;

    case RunStatus.Failed:
    case RunStatus.FailedToStart:
      return <RhUiErrorFillIcon {...props} />;

    case RunStatus.Idle:
      return <RhUiNotStartedIcon {...props} />;

    case RunStatus.Pending:
      return <RhUiHourglassIcon {...props} />;

    case RunStatus.Cancelled:
      return <RhUiWarningFillIcon {...props} />;

    case RunStatus.Skipped:
      return <RhUiDoubleCaretRightIcon {...props} />;

    default:
      return <RhUiHarveyBall100Icon {...props} />;
  }
};

export default StatusIcon;
