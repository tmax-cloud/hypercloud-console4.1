import * as _ from 'lodash-es';
import * as React from 'react';
import { ImagesPage } from './image';
import { ColHead, DetailsPage, List, ListHeader, ListPage } from './factory';
import { Cog, navFactory, ResourceCog, SectionHeading, ResourceLink, ScrollToTopOnMount, ResourceSummary } from './utils';
import { fromNow } from './utils/datetime';
import { kindForReference } from '../module/k8s';
import { breadcrumbsForOwnerRefs } from './utils/breadcrumbs';
import { useTranslation } from 'react-i18next';
import { ResourcePlural } from './utils/lang/resource-plural';

const menuActions = [Cog.factory.ModifyLabels, Cog.factory.ModifyAnnotations, Cog.factory.Edit, Cog.factory.Delete];

const VolumeSnapshotHeader = props => {
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

const VolumeSnapshotRow = () =>
  // eslint-disable-next-line no-shadow
  function VolumeSnapshotRow({ obj }) {
    return (
      <div className="row co-resource-list__item">
        <div className="col-xs-4 col-sm-4 co-resource-link-wrapper">
          <ResourceCog actions={menuActions} kind="VolumeSnapshot" resource={obj} />
          <ResourceLink kind="VolumeSnapshot" name={obj.metadata.name} namespace={obj.metadata.namespace} title={obj.metadata.name} />
        </div>
        <div className="col-xs-4 col-sm-4 co-break-word">{obj.metadata.namespace ? <ResourceLink kind="Namespace" name={obj.metadata.namespace} title={obj.metadata.namespace} /> : 'None'}</div>
        <div className="col-xs-4 col-sm-4 hidden-xs">{fromNow(obj.metadata.creationTimestamp)}</div>
      </div>
    );
  };

const Details = ({ obj: volumesnapshot }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <div className="co-m-pane__body">
        <SectionHeading text={t('ADDITIONAL:OVERVIEWTITLE', { something: ResourcePlural('VolumeSnapshot', t) })} />
        <div className="row">
          <div className="col-sm-6">
            <ResourceSummary resource={volumesnapshot} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export const VolumeSnapshotList = props => {
  const { kinds } = props;
  const Row = VolumeSnapshotRow(kinds[0]);
  Row.displayName = 'VolumeSnapshotRow';
  return <List {...props} Header={VolumeSnapshotHeader} Row={Row} />;
};
VolumeSnapshotList.displayName = VolumeSnapshotList;

export const VolumeSnapshotPage = props => {
  const { t } = useTranslation();
  const createItems = {
    yaml: t('CONTENT:YAMLEDITOR'),
  };

  return <ListPage {...props} ListComponent={VolumeSnapshotList} canCreate={true} kind="VolumeSnapshot" createButtonText={t('ADDITIONAL:CREATEBUTTON', { something: ResourcePlural(props.kind, t) })} />;
};
VolumeSnapshotPage.displayName = 'VolumeSnapshotPage';

const { details, editYaml, images } = navFactory;
export const VolumeSnapshotsDetailsPage = props => {
  const { t } = useTranslation();
  const pages = [details(Details, t('CONTENT:OVERVIEW')), editYaml()];
  return <DetailsPage {...props} kind="VolumeSnapshot" menuActions={menuActions} pages={pages} />;
};

VolumeSnapshotDetailsPage.displayName = 'VolumeSnapshotDetailsPage';
