import * as _ from 'lodash-es';
import * as React from 'react';

import { PodModel } from '../../models';
import { referenceForModel } from '../../module/k8s';
import { SampleYaml } from './resource-sidebar';
import { useTranslation } from 'react-i18next';

export const PodSidebar = ({ loadSampleYaml, downloadSampleYaml }) => {
  const { t } = useTranslation();
  const samples = [
    {
      header: t('STRING:POD-SIDEBAR_0'),
      details: t('STRING:POD-SIDEBAR_1'),
      templateName: 'pod-sample',
      kind: referenceForModel(PodModel),
    },
    {
      header: t('STRING:POD-SIDEBAR_2'),
      details: t('STRING:POD-SIDEBAR_3'),
      templateName: 'pod-sample2',
      kind: referenceForModel(PodModel),
    },
  ];

  return (
    <ol className="co-resource-sidebar-list">
      {_.map(samples, sample => (
        <SampleYaml key={sample.templateName} sample={sample} loadSampleYaml={loadSampleYaml} downloadSampleYaml={downloadSampleYaml} />
      ))}
    </ol>
  );
};
