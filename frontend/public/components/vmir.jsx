import * as React from 'react';
import * as _ from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { ResourcePlural } from './utils/lang/resource-plural';
import { ColHead, DetailsPage, List, ListHeader, ListPage } from './factory';
import { Cog, navFactory, ResourceCog, SectionHeading, ResourceLink, ScrollToTopOnMount, ResourceSummary } from './utils';

const VirtualMachineInstanceReplicasetReference = 'VirtualMachineInstanceReplicaset';

const menuActions = [Cog.factory.ModifyLabels, Cog.factory.ModifyAnnotations, Cog.factory.Edit, Cog.factory.Delete];

const VMIRsHeader = props => {
  const { t } = useTranslation();
  return (
    <ListHeader>
      <ColHead {...props} className="col-lg-3 col-md-3 col-sm-4 col-xs-6" sortField="metadata.name">
        {t('CONTENT:NAME')}
      </ColHead>
      <ColHead {...props} className="col-lg-2 col-md-3 col-sm-4 col-xs-6 " sortField="metadata.namespace">
        {t('CONTENT:NAMESPACE')}
      </ColHead>
      <ColHead {...props} className="col-lg-3 col-md-3 col-sm-4 hidden-xs" sortField="metadata.labels">
        {t('CONTENT:LABELS')}
      </ColHead>
      <ColHead {...props} className="col-lg-2 col-md-3 hidden-sm hidden-xs" sortField="spec.scaleTargetRef.name">
        {t('CONTENT:SCALETARGET')}
      </ColHead>
      <ColHead {...props} className="col-lg-1 hidden-md hidden-sm hidden-xs" sortField="spec.minReplicas">
        {t('CONTENT:MINPODS')}
      </ColHead>
      <ColHead {...props} className="col-lg-1 hidden-md hidden-sm hidden-xs" sortField="spec.maxReplicas">
        {t('CONTENT:MAXPODS')}
      </ColHead>
    </ListHeader>
  );
};

const VMIRsRow = ({ obj }) => (
  <div className="row co-resource-list__item">
    <div className="col-lg-3 col-md-3 col-sm-4 col-xs-6 co-resource-link-wrapper">
      <ResourceCog actions={menuActions} kind={VirtualMachineInstanceReplicasetReference} resource={obj} />
      <ResourceLink kind={VirtualMachineInstanceReplicasetReference} name={obj.metadata.name} namespace={obj.metadata.namespace} title={obj.metadata.name} />
    </div>
    <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 co-break-word">
      <ResourceLink kind="Namespace" name={obj.metadata.namespace} title={obj.metadata.namespace} />
    </div>
    <div className="col-lg-2 col-md-3 hidden-sm hidden-xs co-break-word">
      <ResourceLink kind={obj.spec.scaleTargetRef.kind} name={obj.spec.scaleTargetRef.name} namespace={obj.metadata.namespace} title={obj.spec.scaleTargetRef.name} />
    </div>
    <div className="col-lg-1 hidden-md hidden-sm hidden-xs">{obj.spec.minReplicas}</div>
    <div className="col-lg-1 hidden-md hidden-sm hidden-xs">{obj.spec.maxReplicas}</div>
  </div>
);

const VMIRsList = props => <List {...props} Header={VMIRsHeader} Row={VMIRsRow} />;
VMIRsList.displayName = 'VMIRsList';

export const VMIRsPage = props => {
  const { t } = useTranslation();
  return <ListPage {...props} kind={VirtualMachineInstanceReplicasetReference} title="VMIRs" createButtonText={t('ADDITIONAL:CREATEBUTTON', { something: 'VMIRs' })} ListComponent={VMIRsList} canCreate={true} filterLabel="VMIRs by name" />;
};
VMIRsPage.displayName = 'VMIRsPage';

const Details = ({ obj: VMIR }) => {
  const { t } = useTranslation();
  console.log('details VMIR ? ', VMIR);
  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <div className="co-m-pane__body">
        <SectionHeading text={t('ADDITIONAL:OVERVIEWTITLE', { something: ResourcePlural('VirtualMachineInstanceReplicasets', t) })} />
        <div className="row">
          <div className="col-sm-6">
            <ResourceSummary resource={VMIR} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export const VMIRsDetailsPage = props => {
  const { t } = useTranslation();
  return <DetailsPage {...props} kind="VMIR" menuActions={menuAction} pages={(navFactory.details(Details, t('CONTENT:OVERVIEW')), navFactory.editYaml())} />;
};
VMIRsDetailsPage.displayName = 'VMIRsDetailsPage';
