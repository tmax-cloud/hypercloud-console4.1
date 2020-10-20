import * as _ from 'lodash-es';
import * as React from 'react';

import { TemplateModel } from '../../models';
import { referenceForModel } from '../../module/k8s';
import { SampleYaml } from './resource-sidebar';
import { useTranslation } from 'react-i18next';

export const TemplateSidebar = ({ loadSampleYaml, downloadSampleYaml }) => {
  const { t } = useTranslation();
  const samples = [
    {
      header: t('STRING:TEMPLATE-SIDEBAR_0'),
      details: t('STRING:TEMPLATE-SIDEBAR_1'),
      header: '템플릿 샘플',
      details: `응용 프로그램의 모든 개체를 쉽게 다시 만들 수 있도록 템플릿을 정의한다. 템플릿은 생성된 객체와 메타 데이터를 정의하고 있다.`,
      templateName: 'template-sample',
      kind: referenceForModel(TemplateModel),
    },
    {
      header: t('STRING:TEMPLATE-SIDEBAR_2'),
      details: t('STRING:TEMPLATE-SIDEBAR_3'),
      templateName: 'template-sample2',
      kind: referenceForModel(TemplateModel),
    },
    {
      header: t('STRING:TEMPLATE-SIDEBAR_4'),
      details: t('STRING:TEMPLATE-SIDEBAR_5'),
      templateName: 'template-sample3',
      kind: referenceForModel(TemplateModel),
    },
    {
      header: t('STRING:TEMPLATE-SIDEBAR_6'),
      details: t('STRING:TEMPLATE-SIDEBAR_7'),
      templateName: 'template-sample4',
      kind: referenceForModel(TemplateModel),
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
