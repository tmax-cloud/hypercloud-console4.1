import * as React from 'react';
import { Alert } from '@patternfly/react-core';
import { k8sGet } from '../../../../../../public/module/k8s';
// import { PipelineModel } from '../../../models';
import { PipelineModel } from '../../../../../../public/models';
import { PipelineVisualization } from '../../pipelines/detail-page-tabs/pipeline-details/PipelineVisualization';
import {
  Pipeline,
  PipelineRun,
  pipelineRefExists
} from '../../../utils/pipeline-augment';
import { WorkflowTemplateVisualization } from '../../pipelines/detail-page-tabs/pipeline-details/WorkflowTemplateVisualization';

type WorkflowVisualizationProps = {
  workflow: any;
};

export const WorkflowVisualization: React.FC<WorkflowVisualizationProps> = ({
  workflow
}) => {
  // const [errorMessage, setErrorMessage] = React.useState<string>(null);
  // const [pipeline, setPipeline] = React.useState<Pipeline>(null);
  // console.log('pipeline', pipeline);

  // React.useEffect(() => {
  //   if (pipelineRefExists(pipelineRun)) {
  //     k8sGet(
  //       PipelineModel,
  //       pipelineRun.spec.pipelineRef.name,
  //       pipelineRun.metadata.namespace
  //     )
  //       .then((res: Pipeline) => setPipeline(res))
  //       .catch(error =>
  //         setErrorMessage(
  //           error?.message || 'Could not load visualization at this time.'
  //         )
  //       );
  //   }
  // }, [pipelineRun, setPipeline]);

  // if (errorMessage) {
  //   return <Alert variant="danger" isInline title={errorMessage} />;
  // }

  // if (!pipeline || !pipelineRun) {
  //   return null;
  // }

  return (
    <WorkflowTemplateVisualization
      workflow={workflow}
      workflowTemplate={workflow}
    />
  );
};

// export default PipelineRunVisualization;
