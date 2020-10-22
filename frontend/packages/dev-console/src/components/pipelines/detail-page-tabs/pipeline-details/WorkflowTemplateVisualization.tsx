import * as React from 'react';
import { Alert } from '@patternfly/react-core';
import { Pipeline, PipelineRun } from '../../../../utils/pipeline-augment';
import PipelineTopologyGraph from '../../pipeline-topology/PipelineTopologyGraph';
import { getTopologyNodesEdges } from '../../pipeline-topology/utils';
import { PipelineLayout, NodeType } from '../../pipeline-topology/const';

import './PipelineVisualization.scss';

interface WorkflowTemplateTopologyVisualizationProps {
  workflowTemplate: any;
  workflow?: any;
}

export const WorkflowTemplateVisualization: React.FC<WorkflowTemplateTopologyVisualizationProps> = ({
  workflowTemplate,
  workflow = undefined
}) => {
  const { nodes, edges } = getTopologyNodesEdges(workflowTemplate, workflow);
  nodes.forEach(node => node.isWorkflow = true);
  nodes.forEach(node => node.type = NodeType.WORKFLOW_NODE);

  if (nodes.length === 0 && edges.length === 0) {
    // Nothing to render
    // TODO: Confirm wording with UX; ODC-1860
    return (
      <Alert
        variant="info"
        isInline
        title={`This ${
          workflow ? 'Workflow' : 'Workflow Template'
        } has no step to visualize.`}
      />
    );
  }

  return (
    <div className="odc-pipeline-visualization">
      <PipelineTopologyGraph
        id={workflow?.metadata?.name || workflowTemplate.metadata.name}
        nodes={nodes}
        edges={edges}
        layout={PipelineLayout.DAGRE_VIEWER}
      />
    </div>
  );
};

// export default WorkflowTemplateVisualization;
