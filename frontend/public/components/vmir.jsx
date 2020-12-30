import * as React from 'react';
import * as _ from 'lodash-es';
import { useTranslation } from 'react-i18next';
import { ResourcePlural } from './utils/lang/resource-plural';
import { ColHead, DetailsPage, List, ListHeader, ListPage } from './factory';
import { Cog, navFactory, ResourceCog, SectionHeading, ResourceLink, ScrollToTopOnMount, ResourceSummary } from './utils';

const VirtualMachineInstanceReplicaSetReference = 'VirtualMachineInstanceReplicaSet';

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
    </ListHeader>
  );
};

const VMIRsRow = ({ obj }) => {
  return (
    <div className="row co-resource-list__item">
      <div className="col-lg-3 col-md-3 col-sm-4 col-xs-6 co-resource-link-wrapper">
        <ResourceCog actions={menuActions} kind={VirtualMachineInstanceReplicaSetReference} resource={obj} />
        <ResourceLink kind={VirtualMachineInstanceReplicaSetReference} name={obj.metadata.name} namespace={obj.metadata.namespace} title={obj.metadata.name} />
      </div>
      <div className="col-lg-2 col-md-3 col-sm-4 col-xs-6 co-break-word">
        <ResourceLink kind="Namespace" name={obj.metadata.namespace} title={obj.metadata.namespace} />
      </div>
    </div>
  );
};

const VMIRsList = props => <List {...props} Header={VMIRsHeader} Row={VMIRsRow} />;
VMIRsList.displayName = 'VMIRsList';

export const VirtualMachineInstanceReplicaSetsPage = props => {
  const { t } = useTranslation();
  return <ListPage {...props} kind={VirtualMachineInstanceReplicaSetReference} title="VMIRs" createButtonText={t('ADDITIONAL:CREATEBUTTON', { something: 'VMIRs' })} ListComponent={VMIRsList} canCreate={true} filterLabel="VMIRs by name" />;
};
VirtualMachineInstanceReplicaSetsPage.displayName = 'VirtualMachineInstanceReplicaSetsPage';

const Details = ({ obj: VMIR }) => {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <div className="co-m-pane__body">
        <SectionHeading text={t('ADDITIONAL:OVERVIEWTITLE', { something: ResourcePlural('VirtualMachineInstanceReplicaSet', t) })} />
        <div className="row">
          <div className="col-sm-6">
            <ResourceSummary resource={VMIR} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export const VirtualMachineInstanceReplicaSetsDetailsPage = props => {
  const { t } = useTranslation();
  return <DetailsPage {...props} kind="VirtualMachineInstanceReplicaSet" menuActions={menuActions} pages={[navFactory.details(Details, t('CONTENT:OVERVIEW')), navFactory.editYaml()]} />;
};
VirtualMachineInstanceReplicaSetsDetailsPage.displayName = 'VirtualMachineInstanceReplicaSetsDetailsPage';
