import * as React from 'react';
import { DetailsPage, DetailsPageProps } from '../../../../../public/components/factory';
import { Kebab } from '../../../../../public/components/utils/kebab';
import { navFactory, viewYamlComponent } from '../../../../../public/components/utils';
import { pipelineRunStatus } from '../../utils/pipeline-filter-reducer';
// import { rerunPipelineRunAndRedirect, stopPipelineRun } from '../../utils/pipeline-actions';
import { PipelineRunDetails } from './detail-page-tabs/PipelineRunDetails';
// import { PipelineRunLogsWithActiveTask } from './detail-page-tabs/PipelineRunLogs';

export const PipelineRunDetailsPage: React.FC<DetailsPageProps> = (props) => (
  <DetailsPage
    {...props}
    // menuActions={[rerunPipelineRunAndRedirect, stopPipelineRun, Kebab.factory.Delete]}
    menuActions={[]}
    getResourceStatus={pipelineRunStatus}
    pages={[
      navFactory.details(PipelineRunDetails),
      navFactory.editYaml(viewYamlComponent as any),
      // {
      //   href: 'logs',
      //   path: 'logs/:name?',
      //   name: 'Logs',
      //   component: PipelineRunLogsWithActiveTask,
      // },
    ]}
  />
);
// export default PipelineRunDetailsPage;
