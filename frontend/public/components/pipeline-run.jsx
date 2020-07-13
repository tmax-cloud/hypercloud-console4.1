import * as _ from 'lodash-es';
import * as React from 'react';

import { ColHead, DetailsPage, List, ListHeader, ListPage } from './factory';
import { Cog, navFactory, ResourceCog, SectionHeading, ResourceLink, ResourceSummary } from './utils';
import { fromNow } from './utils/datetime';
import { kindForReference, referenceForModel } from '../module/k8s';
import { breadcrumbsForOwnerRefs } from './utils/breadcrumbs';
import { PipelineRunVisualization } from './pipelineRuns/PipelineRunVisualization';
import { PipelineRunModel } from '../models';
import { useTranslation } from 'react-i18next';
import { ResourcePlural } from './utils/lang/resource-plural';

const menuActions = [Cog.factory.ModifyLabels, Cog.factory.ModifyAnnotations, Cog.factory.Edit, Cog.factory.Delete];

const PipelineRunHeader = props => {
  const { t } = useTranslation();
  return (
    <ListHeader>
      <ColHead {...props} className="col-xs-4 col-sm-4" sortField="metadata.name">
        {t('CONTENT:NAME')}
      </ColHead>
      <ColHead {...props} className="col-xs-4 col-sm-4" sortField="metadata.namespace">
        {t('CONTENT:NAMESPACE')}
      </ColHead>
      <ColHead {...props} className="col-sm-4 hidden-xs" sortField="metadata.creationTimestamp">
        {t('CONTENT:CREATED')}
      </ColHead>
    </ListHeader>
  );
};

const PipelineRunRow = () =>
  // eslint-disable-next-line no-shadow
  function PipelineRunRow({ obj: pipelineRun }) {
    return (
      <div className="row co-resource-list__item">
        <div className="col-xs-4 col-sm-4 co-resource-link-wrapper">
          <ResourceCog actions={menuActions} kind="PipelineRun" resource={pipelineRun} />
          <ResourceLink kind="PipelineRun" name={pipelineRun.metadata.name} namespace={pipelineRun.metadata.namespace} title={pipelineRun.metadata.name} />
        </div>
        <div className="col-xs-4 col-sm-4 co-break-word">{pipelineRun.metadata.namespace ? <ResourceLink kind="Namespace" name={pipelineRun.metadata.namespace} title={pipelineRun.metadata.namespace} /> : 'None'}</div>
        <div className="col-xs-4 col-sm-4 hidden-xs">{fromNow(pipelineRun.metadata.creationTimestamp)}</div>
      </div>
    );
  };

const DetailsForKind = kind =>
  function DetailsForKind_({ obj: pipelineRun }) {
    const { t } = useTranslation();
    return (
      <React.Fragment>
        <div className="co-m-pane__body">
          <SectionHeading text={t('ADDITIONAL:OVERVIEWTITLE', { something: ResourcePlural('PIPELINERUN', t) })} />
          <PipelineRunVisualization pipelineRun={pipelineRun} />
          <ResourceSummary resource={pipelineRun} podSelector="spec.podSelector" showNodeSelector={false} />
        </div>
      </React.Fragment>
    );
  };

export const PipelineRunList = props => {
  const { kinds } = props;
  const Row = PipelineRunRow(kinds[0]);
  Row.displayName = 'PipelineRun';
  return <List {...props} Header={PipelineRunHeader} Row={Row} />;
};
PipelineRunList.displayName = PipelineRunList;

export const PipelineRunsPage = props => {
  const { t } = useTranslation();
  const createItems = {
    form: t('CONTENT:FORMEDITOR'),
    yaml: t('CONTENT:YAMLEDITOR'),
  };

  const createProps = {
    items: createItems,
    createLink: type => `/k8s/ns/${props.namespace || 'default'}/pipelineruns/new${type !== 'yaml' ? '/' + type : ''}`,
  };
  return <ListPage ListComponent={PipelineRunList} canCreate={true} createButtonText={t('ADDITIONAL:CREATEBUTTON', { something: ResourcePlural(props.kind, t) })} createProps={createProps} {...props} />;
};
PipelineRunsPage.displayName = 'PipelineRunsPage';

export const PipelineRunDetailsPage = props => {
  const { t } = useTranslation();
  return (
    <DetailsPage
      {...props}
      // breadcrumbsFor={obj =>
      //   breadcrumbsForOwnerRefs(obj).concat({
      //     name: 'Task Details',
      //     path: props.match.url,
      //   })
      // }
      menuActions={menuActions}
      pages={[navFactory.details(DetailsForKind(props.kind), t('CONTENT:OVERVIEW')), navFactory.editYaml()]}
    />
  );
};

PipelineRunDetailsPage.displayName = 'PipelineRunDetailsPage';
