import { chart_color_green_400 as tektonGroupColor } from '@patternfly/react-tokens';
import { K8sKind } from '../../../../public/module/k8s';
import { BadgeType } from '../../../console-shared/src/components/badges/badge-factory';

const color = tektonGroupColor.value;

export const PipelineModel: K8sKind = {
  apiGroup: 'tekton.dev',
  apiVersion: 'v1beta1',
  path: 'pipelines',
  label: 'Pipeline',
  plural: 'pipelines',
  abbr: 'PL',
  namespaced: true,
  kind: 'Pipeline',
  id: 'pipeline',
  labelPlural: 'Pipelines',
  crd: true,
  badge: BadgeType.TECH,
  color
};

export const PipelineRunModel: K8sKind = {
  apiGroup: 'tekton.dev',
  apiVersion: 'v1beta1',
  path: 'pipelineruns',
  label: 'Pipeline Run',
  plural: 'pipelineruns',
  abbr: 'PLR',
  namespaced: true,
  kind: 'PipelineRun',
  id: 'pipelinerun',
  labelPlural: 'Pipeline Runs',
  crd: false,
  badge: BadgeType.TECH,
  color
};

export const TaskModel: K8sKind = {
  apiGroup: 'tekton.dev',
  apiVersion: 'v1beta1',
  path: 'tasks',
  label: 'Task',
  plural: 'tasks',
  abbr: 'T',
  namespaced: true,
  kind: 'Task',
  id: 'task',
  labelPlural: 'Tasks',
  crd: false,
  badge: BadgeType.TECH,
  color
};

export const TaskRunModel: K8sKind = {
  apiGroup: 'tekton.dev',
  apiVersion: 'v1beta1',
  path: 'taskruns',
  label: 'Task Run',
  plural: 'taskruns',
  abbr: 'TR',
  namespaced: true,
  kind: 'TaskRun',
  id: 'taskrun',
  labelPlural: 'Task Runs',
  crd: true,
  badge: BadgeType.TECH,
  color
};

export const PipelineResourceModel: K8sKind = {
  apiGroup: 'tekton.dev',
  apiVersion: 'v1alpha1',
  path: 'pipelineresources',
  label: 'Pipeline Resource',
  plural: 'pipelineresources',
  abbr: 'PR',
  namespaced: true,
  kind: 'PipelineResource',
  id: 'pipelineresource',
  labelPlural: 'Pipeline Resources',
  crd: true,
  badge: BadgeType.TECH,
  color
};

export const ClusterTaskModel: K8sKind = {
  apiGroup: 'tekton.dev',
  apiVersion: 'v1beta1',
  path: 'clustertasks',
  label: 'Cluster Task',
  plural: 'clustertasks',
  abbr: 'CT',
  namespaced: false,
  kind: 'ClusterTask',
  id: 'clustertask',
  labelPlural: 'Cluster Tasks',
  crd: false,
  badge: BadgeType.TECH,
  color
};

export const ConditionModel: K8sKind = {
  apiGroup: 'tekton.dev',
  apiVersion: 'v1alpha1',
  path: 'conditions',
  label: 'Condition',
  plural: 'conditions',
  abbr: 'C',
  namespaced: true,
  kind: 'Condition',
  id: 'condition',
  labelPlural: 'Conditions',
  crd: true,
  badge: BadgeType.DEV,
  color
};

export const TriggerBindingModel: K8sKind = {
  apiGroup: 'triggers.tekton.dev',
  apiVersion: 'v1alpha1',
  path: 'triggerbindings',
  label: 'Trigger Binding',
  plural: 'triggerbindings',
  abbr: 'TB',
  namespaced: true,
  kind: 'TriggerBinding',
  id: 'triggerbinding',
  labelPlural: 'Trigger Bindings',
  crd: true,
  badge: BadgeType.TECH,
  color
};

export const ClusterTriggerBindingModel: K8sKind = {
  apiGroup: 'triggers.tekton.dev',
  apiVersion: 'v1alpha1',
  path: 'clustertriggerbindings',
  label: 'Cluster Trigger Binding',
  plural: 'clustertriggerbindings',
  abbr: 'CTB',
  namespaced: false,
  kind: 'ClusterTriggerBinding',
  id: 'clustertriggerbinding',
  labelPlural: 'Cluster Trigger Bindings',
  crd: true,
  badge: BadgeType.TECH,
  color
};

export const TriggerTemplateModel: K8sKind = {
  apiGroup: 'triggers.tekton.dev',
  apiVersion: 'v1alpha1',
  path: 'triggertemplates',
  label: 'Trigger Template',
  plural: 'triggertemplates',
  abbr: 'TT',
  namespaced: true,
  kind: 'TriggerTemplate',
  id: 'triggertemplate',
  labelPlural: 'Trigger Templates',
  crd: true,
  badge: BadgeType.TECH,
  color
};

export const EventListenerModel: K8sKind = {
  apiGroup: 'triggers.tekton.dev',
  apiVersion: 'v1alpha1',
  path: 'eventlisteners',
  label: 'Event Listener',
  plural: 'eventlisteners',
  abbr: 'EL',
  namespaced: true,
  kind: 'EventListener',
  id: 'eventlistener',
  labelPlural: 'Event Listeners',
  crd: true,
  badge: BadgeType.TECH,
  color
};
