import * as _ from 'lodash-es';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { k8sCreate, k8sUpdate } from '../../module/k8s';
import { ButtonBar, history, kindObj, SelectorInput } from '../utils';
import { useTranslation } from 'react-i18next';
import { formatNamespacedRouteForResource } from '../../ui/ui-actions';
import { NsDropdown } from '../RBAC';
import { ResourceLimitEditor } from '../utils/resource-limit-editor';
import { ResourceLimitEditorPair } from '../utils/index';
import { isConstructorDeclaration } from 'typescript';

const Section = ({ label, children, isRequired, paddingTop }) => {
  return (
    <div className={`row form-group ${isRequired ? 'required' : ''}`}>
      <div className="col-xs-2 control-label" style={{ paddingTop: paddingTop }}>
        <strong>{label}</strong>
      </div>
      <div className="col-xs-10">{children}</div>
    </div>
  );
};

class LimitRangeFormComponent extends React.Component {
  constructor(props) {
    super(props);
    const existingLimitRange = _.pick(props.obj, ['metadata', 'type']);
    const limitRange = _.defaultsDeep({}, props.fixed, existingLimitRange, {
      apiVersion: 'v1',
      kind: 'LimitRange',
      metadata: {
        name: '',
        namespace: '',
      },
      spec: {
        limits: [
        ],
      },
    });

    this.state = {
      limitRangeTypeAbstraction: this.props.limitRangeTypeAbstraction,
      limitRange: limitRange,
      inProgress: false,
      type: 'form',
      limits: [['', '', '', '', '', '', 'Gi', 'Gi', 'Gi']],
      isDuplicated: false,
    };
    this.onNameChanged = this.onNameChanged.bind(this);
    this.onNamespaceChanged = this.onNamespaceChanged.bind(this);
    this.onLabelChanged = this.onLabelChanged.bind(this);
    this._updateLimits = this._updateLimits.bind(this);
    this.save = this.save.bind(this);
  }

  onNameChanged(event) {
    let limitRange = { ...this.state.limitRange };
    limitRange.metadata.name = String(event.target.value);
    this.setState({ limitRange: limitRange });
  }
  onNamespaceChanged(namespace) {
    let limitRange = { ...this.state.limitRange };
    limitRange.metadata.namespace = String(namespace);
    this.setState({ limitRange: limitRange });
  }
  onLabelChanged(event) {
    let limitRange = { ...this.state.limitRange };
    limitRange.metadata.labels = {};
    if (event.length !== 0) {
      event.forEach(item => {
        if (item.split('=')[1] === undefined) {
          document.getElementById('labelErrMsg').style.display = 'block';
          event.pop(item);
          return;
        }
        document.getElementById('labelErrMsg').style.display = 'none';
        limitRange.metadata.labels[item.split('=')[0]] = item.split('=')[1];
      });
    }
    this.setState({ limitRange: limitRange });
  }

  _updateLimits(limits) {
    this.setState({
      limits: limits.resourceLimitsPairs,
      isDuplicated: limits.isDuplicated,
    });
  }

  save(e) {
    e.preventDefault();
    const { kind, metadata } = this.state.limitRange;
    this.setState({ inProgress: true });
    const newLimitRange = _.assign({}, this.state.limitRange);

    if (this.state.isDuplicated) {
      this.setState({ inProgress: false });
      return;
    }

    let limits = [];
    this.state.limits.forEach(limit => {
      let newLimit = {};
      const type = limit[ResourceLimitEditorPair.Type];
      newLimit['type'] = type;
      newLimit[limit[ResourceLimitEditorPair.LimitType]] = {};
      if (type === 'PersistentVolumeClaim') {
        newLimit[limit[ResourceLimitEditorPair.LimitType]]['storage'] = limit[ResourceLimitEditorPair.Storage] + limit[ResourceLimitEditorPair.StorageUnit];
      } else {
        const limitType = limit[ResourceLimitEditorPair.LimitType];
        if (limitType === 'maxLimitRequestRatio') {
          newLimit[limit[ResourceLimitEditorPair.LimitType]]['cpu'] = limit[ResourceLimitEditorPair.Ratio];
        } else {
          newLimit[limit[ResourceLimitEditorPair.LimitType]]['cpu'] = limit[ResourceLimitEditorPair.Cpu] + limit[ResourceLimitEditorPair.CpuUnit];
          newLimit[limit[ResourceLimitEditorPair.LimitType]]['memory'] = limit[ResourceLimitEditorPair.Memory] + limit[ResourceLimitEditorPair.MemoryUnit];
        }
      }
      limits.push(newLimit);
    });

    if (limits !== []) {
      Object.assign(newLimitRange.spec.limits, limits);
    }

    const ko = kindObj(kind);
    (this.props.isCreate ? k8sCreate(ko, newLimitRange) : k8sUpdate(ko, newLimitRange, metadata.namespace, newLimitRange.metadata.name)).then(
      () => {
        this.setState({ inProgress: false });
        history.push(`/k8s/ns/${metadata.namespace}/limitranges/${metadata.name}`);
      },
      err => this.setState({ error: err.message, inProgress: false }),
    );
  }

  render() {
    const { t } = this.props;

    const typeOptions = [
      {
        value: 'Pod',
        label: t("RESOURCE:POD"),
      },
      {
        value: 'Container',
        label: t("RESOURCE:CONTAINER")
      },
      {
        value: 'PersistentVolumeClaim',
        label: t("RESOURCE:PERSISTENTVOLUMECLAIM")
      },
    ];

    const limitTypeOptions = [
      {
        value: 'default',
        label: 'Default',
      },
      {
        value: 'defaultRequest',
        label: 'Default Request',
      },
      {
        value: 'max',
        label: 'Max',
      },
      {
        value: 'min',
        label: 'Min',
      },
      {
        value: 'maxLimitRequestRatio',
        label: 'Max Limit Request Ratio',
      },
    ];

    return (
      <div className="rbac-edit-binding co-m-pane__body">
        <Helmet>
          <title>{t('ADDITIONAL:CREATEBUTTON', { something: t(`RESOURCE:${this.state.limitRange.kind.toUpperCase()}`) })}</title>
        </Helmet>
        <form className="co-m-pane__body-group form-group" onSubmit={this.save}>
          <h1 className="co-m-pane__heading">{t('ADDITIONAL:CREATEBUTTON', { something: t(`RESOURCE:${this.state.limitRange.kind.toUpperCase()}`) })}</h1>
          <p className="co-m-pane__explanation">{t('STRING:LIMITRANGE-CREATE-0')}</p>
          <fieldset disabled={!this.props.isCreate}>
            <Section label={t('CONTENT:NAME')} isRequired={true}>
              <input className="form-control" type="text" onChange={this.onNameChanged} value={this.state.limitRange.metadata.name} id="limit-range-name" required />
            </Section>
            <Section label={t('CONTENT:NAMESPACE')} isRequired={true}>
              <NsDropdown id="limit-range-namespace" t={t} onChange={this.onNamespaceChanged} />
            </Section>
            <Section label={t('CONTENT:LABELS')} isRequired={false}>
              <SelectorInput desc={t('STRING:RESOURCEQUOTA-CREATE-1')} isFormControl={true} labelClassName="co-text-namespace" tags={[]} onChange={this.onLabelChanged} />
              <div id="labelErrMsg" style={{ display: 'none', color: 'red' }}>
                <p>{t('VALIDATION:LABEL_FORM')}</p>
              </div>
            </Section>
            <Section label={t('CONTENT:RESOURCELIMITS')} isRequired={false} paddingTop={'5px'}>
              <ResourceLimitEditor desc={t('STRING:LIMITRANGE-CREATE-2')} t={t} typeOptions={typeOptions} limitTypeOptions={limitTypeOptions} resourceLimitsPairs={this.state.limits} SelectTypeString="selectType" SelectLimitTypeString="selectLimitType" valueString="value" updateParentData={this._updateLimits} isDuplicated={this.state.isDuplicated} />
            </Section>
            <ButtonBar errorMessage={this.state.error} inProgress={this.state.inProgress}>
              <button type="submit" className="btn btn-primary" id="save-changes">
                {t('CONTENT:CREATE')}
              </button>
              <Link to={formatNamespacedRouteForResource('limitranges')} className="btn btn-default" id="cancel">
                {t('CONTENT:CANCEL')}
              </Link>
            </ButtonBar>
          </fieldset>
        </form>
      </div>
    );
  }
}

export const CreateLimitRange = ({ match: { params } }) => {
  const { t } = useTranslation();
  return <LimitRangeFormComponent t={t} fixed={{ metadata: { namespace: params.ns } }} limitRangeTypeAbstraction={params.type} titleVerb="Create" isCreate={true} />;
};
