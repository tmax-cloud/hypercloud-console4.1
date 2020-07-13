import * as React from 'react';
import { AngleDoubleRightIcon, BanIcon, CheckCircleIcon, CircleIcon, ExclamationCircleIcon, PendingIcon, SyncAltIcon } from '@patternfly/react-icons';
import { getRunStatusColor, runStatus } from '../utils/pipeline/pipeline-augment';

interface StatusIconProps {
  status: string;
  height?: number;
  width?: number;
}

// export const StatusIcon: React.FC<StatusIconProps> = ({ status, ...props }) => {
export const StatusIcon: React.ComponentType<StatusIconProps> = ({ status, ...props }) => {
  switch (status) {
    case runStatus['In Progress']:
      return <SyncAltIcon {...props} className="fa-spin" />;

    case runStatus.Succeeded:
      return <CheckCircleIcon {...props} />;

    case runStatus.Failed:
      return <ExclamationCircleIcon {...props} />;

    case runStatus.Pending:
      return <PendingIcon {...props} />;

    case runStatus.Cancelled:
      return <BanIcon {...props} />;

    case runStatus.Skipped:
      return <AngleDoubleRightIcon {...props} />;

    default:
      return <CircleIcon {...props} />;
    // return <span>react-icons 라이브러리 다운 필요</span>;
  }
};

// export const ColoredStatusIcon: React.FC<StatusIconProps> = ({ status, ...others }) => {
export const ColoredStatusIcon: React.ComponentType<StatusIconProps> = ({ status, ...others }) => {
  return (
    <div
      style={{
        color: status ? getRunStatusColor(status).pftoken.value : getRunStatusColor(runStatus.Cancelled).pftoken.value,
      }}
    >
      <StatusIcon status={status} {...others} />
    </div>
  );
};
