import * as React from 'react';

import { ColHead, DetailsPage, List, ListHeader, ListPage } from './factory';
import { Cog, LabelList, navFactory, ResourceCog, SectionHeading, ResourceLink, ResourceSummary, Timestamp } from './utils';
import { useTranslation } from 'react-i18next';
import { ResourcePlural } from './utils/lang/resource-plural';

const menuActions = [Cog.factory.ModifyLabels, Cog.factory.ModifyAnnotations, Cog.factory.Edit, Cog.factory.Delete];

const Header = props => {
  const { t } = useTranslation();
  return (
    <ListHeader>
      <ColHead {...props} className="col-sm-4 col-xs-6" sortField="metadata.name">
        {t('CONTENT:NAME')}
      </ColHead>
      <ColHead {...props} className="col-sm-4 col-xs-6" sortField="metadata.labels">
        {t('CONTENT:LABELS')}
      </ColHead>
      <ColHead {...props} className="col-sm-4 hidden-xs" sortField="metadata.creationTimestamp">
        {t('CONTENT:CREATED')}
      </ColHead>
    </ListHeader>
  );
};

const kind = 'PersistentVolume';
const Row = ({ obj }) => {
  const { t } = useTranslation();
  return (
    <div className="row co-resource-list__item">
      <div className="col-sm-4 col-xs-6 co-resource-link-wrapper">
        <ResourceCog actions={menuActions} kind={kind} resource={obj} />
        <ResourceLink kind={kind} name={obj.metadata.name} namespace={obj.metadata.namespace} title={obj.metadata.name} />
      </div>
      <div className="col-sm-4 col-xs-6">
        <LabelList kind={kind} labels={obj.metadata.labels} />
      </div>
      <div className="col-sm-4 hidden-xs">
        <Timestamp timestamp={obj.metadata.creationTimestamp} t={t} />
      </div>
    </div>
  );
};

const Details = ({ obj }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <div className="co-m-pane__body">
        <SectionHeading text={t('ADDITIONAL:OVERVIEWTITLE', { something: ResourcePlural('PersistentVolume', t) })} />
        <ResourceSummary resource={obj} podSelector="spec.podSelector" showNodeSelector={false} />
      </div>
    </React.Fragment>
  );
};

export const PersistentVolumesList = props => <List {...props} Header={Header} Row={Row} />;
export const PersistentVolumesPage = props => {
  const { t } = useTranslation();
  return <ListPage {...props} ListComponent={PersistentVolumesList} kind={kind} canCreate={true} createButtonText={t('ADDITIONAL:CREATEBUTTON', { something: ResourcePlural(props.kind, t) })} />;
};
export const PersistentVolumesDetailsPage = props => {
  const { t } = useTranslation();
  return <DetailsPage {...props} menuActions={menuActions} pages={[navFactory.details(Details, t('CONTENT:OVERVIEW')), navFactory.editYaml()]} />;
};
