import * as React from 'react';
import { K8sResourceKind, k8sGet } from '../../module/k8s';
import { PipelineVisualizationGraph } from '../pipelines/PipelineVisualizationGraph';
import { getPipelineTasks } from '../utils/pipeline/pipeline-utils';
import { PipelineModel } from '../../models';
import { pipelineRunFilterReducer } from '../utils/pipeline/pipeline-filter-reducer';

export interface PipelineRunVisualizationProps {
  pipelineRun: K8sResourceKind;
  t?: string;
}

export interface PipelineVisualizationRunState {
  pipeline: K8sResourceKind;
  errorCode?: number;
}

export class PipelineRunVisualization extends React.Component<PipelineRunVisualizationProps, PipelineVisualizationRunState> {
  constructor(props) {
    super(props);
    this.state = {
      pipeline: { apiVersion: '', metadata: {}, kind: 'PipelineRun', spec: {} },
      errorCode: null,
    };
    this.getPipeline = this.getPipeline.bind(this);
  }

  componentDidMount() {
    this.getPipeline();
  }

  getPipeline = () => {
    k8sGet(PipelineModel, this.props.pipelineRun.spec.pipelineRef.name, this.props.pipelineRun.metadata.namespace)
      .then(pipeline => {
        this.setState({ pipeline });
      })
      .catch(error => console.log('error'));
  };

  render() {
    const { pipelineRun } = this.props;
    if (this.state.errorCode === 404) {
      return null;
    }
    return <PipelineVisualizationGraph pipelineRun={pipelineRun.metadata.name} namespace={pipelineRun.metadata.namespace} graph={getPipelineTasks(this.state.pipeline, pipelineRun)} runStatus={pipelineRunFilterReducer(pipelineRun)} />;
  }
}
