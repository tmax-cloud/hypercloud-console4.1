import * as React from 'react';
import { observer, Node, NodeModel } from '../../../../../topology/src';
import { pipelineRunFilterReducer } from '../../../utils/pipeline-filter-reducer';
import { PipelineVisualizationTask } from '../detail-page-tabs/pipeline-details/PipelineVisualizationTask';
import { DROP_SHADOW_SPACING } from './const';
import { TaskNodeModelData } from './types';

type TaskNodeProps = {
  element: Node<NodeModel, TaskNodeModelData>;
  disableTooltip?: boolean;
};

const WorkflowNode: React.FC<TaskNodeProps> = ({ element }) => {
  const { height, width } = element.getBounds();
  const { pipeline, pipelineRun, task, selected } = element.getData();

  return (
    <foreignObject width={width} height={height + DROP_SHADOW_SPACING}>
      <PipelineVisualizationTask
        pipelineRunName={pipelineRun?.metadata?.name}
        task={task}
        pipelineRunStatus={pipelineRun && pipelineRunFilterReducer(pipelineRun)}
        namespace={pipeline?.metadata?.namespace}
        disableTooltip={true}
        selected={selected}
        isWorkflow={true}
      />
    </foreignObject>
  );
};

export default observer(WorkflowNode);
