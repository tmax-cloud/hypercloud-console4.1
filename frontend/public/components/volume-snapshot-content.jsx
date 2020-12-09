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

const VolumeSnapshotContentHeader = props => {
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

const VolumeSnapshotContentRow = () =>
  // eslint-disable-next-line no-shadow
  function VolumeSnapshotContentRow({ obj }) {
    return (
      <div className="row co-resource-list__item">
        <div className="col-xs-4 col-sm-4 co-resource-link-wrapper">
          <ResourceCog actions={menuActions} kind="VolumeSnapshotContent" resource={obj} />
          <ResourceLink kind="VolumeSnapshotContent" name={obj.metadata.name} namespace={obj.metadata.namespace} title={obj.metadata.name} />
        </div>
        <div className="col-xs-4 col-sm-4 co-break-word">{obj.metadata.namespace ? <ResourceLink kind="Namespace" name={obj.metadata.namespace} title={obj.metadata.namespace} /> : 'None'}</div>
        <div className="col-xs-4 col-sm-4 hidden-xs">{fromNow(obj.metadata.creationTimestamp)}</div>
      </div>
    );
  };

const Details = ({ obj: volumesnapshotcontent }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <div className="co-m-pane__body">
        <SectionHeading text={t('ADDITIONAL:OVERVIEWTITLE', { something: ResourcePlural('VolumeSnapshotContent', t) })} />
        <div className="row">
          <div className="col-sm-6">
            <ResourceSummary resource={volumesnapshotcontent} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export const VolumeSnapshotContentList = props => {
  const { kinds } = props;
  const Row = VolumeSnapshotContentRow(kinds[0]);
  Row.displayName = 'VolumeSnapshotContentRow';
  return <List {...props} Header={VolumeSnapshotContentHeader} Row={Row} />;
};
VolumeSnapshotContentList.displayName = VolumeSnapshotContentList;

export const VolumeSnapshotContentPage = props => {
  const { t } = useTranslation();
  const createItems = {
    yaml: t('CONTENT:YAMLEDITOR'),
  };

  // const createProps = {
  //   items: createItems,
  //   createLink: type => `/k8s/ns/${props.namespace || 'default'}/volumesnapshotcontents/new`
  // };

  return <ListPage {...props} ListComponent={VolumeSnapshotContentList} canCreate={true} kind="VolumeSnapshotContent" createButtonText={t('ADDITIONAL:CREATEBUTTON', { something: ResourcePlural(props.kind, t) })} />;
};
VolumeSnapshotContentPage.displayName = 'VolumeSnapshotContentPage';

const { details, editYaml, images } = navFactory;
export const VolumeSnapshotContentDetailsPage = props => {
  const { t } = useTranslation();
  const pages = [details(Details, t('CONTENT:OVERVIEW')), editYaml()];
  return <DetailsPage {...props} kind="VolumeSnapshotContent" menuActions={menuActions} pages={pages} />;
};

VolumeSnapshotContentDetailsPage.displayName = 'VolumeSnapshotContentDetailsPage';
