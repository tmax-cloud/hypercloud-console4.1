import * as _ from 'lodash-es';
import * as React from 'react';

import { ServiceBindingModel } from '../../models';
import { referenceForModel } from '../../module/k8s';
import { SampleYaml } from './resource-sidebar';
import { useTranslation } from 'react-i18next';

export const ServiceBindingSidebar = ({ loadSampleYaml, downloadSampleYaml }) => {
  const { t } = useTranslation();
  const samples = [
    {
      header: t('STRING:SERVICEBINDING-SIDEBAR_0'),
      details: t('STRING:SERVICEBINDING-SIDEBAR_1'),
      templateName: 'servicebinding-sample',
      kind: referenceForModel(ServiceBindingModel),
    },
    {
      header: t('STRING:SERVICEBINDING-SIDEBAR_2'),
      details: t('STRING:SERVICEBINDING-SIDEBAR_3'),
      templateName: 'servicebinding-sample2',
      kind: referenceForModel(ServiceBindingModel),
    }
  ];

  return (
    <ol className="co-resource-sidebar-list">
      {_.map(samples, sample => (
        <SampleYaml key={sample.templateName} sample={sample} loadSampleYaml={loadSampleYaml} downloadSampleYaml={downloadSampleYaml} />
      ))}
    </ol>
  );
};
