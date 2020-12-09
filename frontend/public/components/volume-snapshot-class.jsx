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

const VolumeSnapshotClassHeader = props => {
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

const VolumeSnapshotClassRow = () =>
  // eslint-disable-next-line no-shadow
  function VolumeSnapshotClassRow({ obj }) {
    return (
      <div className="row co-resource-list__item">
        <div className="col-xs-4 col-sm-4 co-resource-link-wrapper">
          <ResourceCog actions={menuActions} kind="VolumeSnapshotClass" resource={obj} />
          <ResourceLink kind="VolumeSnapshotClass" name={obj.metadata.name} namespace={obj.metadata.namespace} title={obj.metadata.name} />
        </div>
        <div className="col-xs-4 col-sm-4 co-break-word">{obj.metadata.namespace ? <ResourceLink kind="Namespace" name={obj.metadata.namespace} title={obj.metadata.namespace} /> : 'None'}</div>
        <div className="col-xs-4 col-sm-4 hidden-xs">{fromNow(obj.metadata.creationTimestamp)}</div>
      </div>
    );
  };

const Details = ({ obj: volumesnapshotclass }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <div className="co-m-pane__body">
        <SectionHeading text={t('ADDITIONAL:OVERVIEWTITLE', { something: ResourcePlural('VolumeSnapshotClass', t) })} />
        <div className="row">
          <div className="col-sm-6">
            <ResourceSummary resource={volumesnapshotclass} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export const VolumeSnapshotClassList = props => {
  const { kinds } = props;
  const Row = VolumeSnapshotClassRow(kinds[0]);
  Row.displayName = 'VolumeSnapshotClassRow';
  return <List {...props} Header={VolumeSnapshotClassHeader} Row={Row} />;
};
VolumeSnapshotClassList.displayName = VolumeSnapshotClassList;

export const VolumeSnapshotClassPage = props => {
  const { t } = useTranslation();
  const createItems = {
    yaml: t('CONTENT:YAMLEDITOR'),
  };

  // const createProps = {
  //   items: createItems,
  //   createLink: type => `/k8s/ns/${props.namespace || 'default'}/volumesnapshotclass/new`
  // };

  return <ListPage {...props} ListComponent={VolumeSnapshotClassList} canCreate={true} kind="VolumeSnapshotClass" createButtonText={t('ADDITIONAL:CREATEBUTTON', { something: ResourcePlural(props.kind, t) })} />;
};
VolumeSnapshotClassPage.displayName = 'VolumeSnapshotClassPage';

const { details, editYaml, images } = navFactory;
export const VolumeSnapshotClassDetailsPage = props => {
  const { t } = useTranslation();
  const pages = [details(Details, t('CONTENT:OVERVIEW')), editYaml()];
  return <DetailsPage {...props} kind="VolumeSnapshotClass" menuActions={menuActions} pages={pages} />;
};

VolumeSnapshotClassDetailsPage.displayName = 'VolumeSnapshotClassDetailsPage';
