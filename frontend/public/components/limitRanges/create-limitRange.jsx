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

const CheckboxLimitType = ({ id, label, children, isChecked, onChange }) => {
  return (
    <div className="col-xs-10">
      <input type="checkbox" id={id} checked={isChecked} onChange={onChange} style={{ marginRight: '5px', marginTop: '0px', verticalAlign: 'middle' }} />
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  )
}

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
      // pod, container, pvc checkboxes state
      resourceType: [true, false, false],
      limits: [[], [], []],
      isDuplicated: [false, false, false],
      inputError: {
        name: null,
        namespace: null,
      },
    };
    this.onNameChanged = this.onNameChanged.bind(this);
    this.onNamespaceChanged = this.onNamespaceChanged.bind(this);
    this.onLabelChanged = this.onLabelChanged.bind(this);
    this._updateLimits = this._updateLimits.bind(this);
    this.save = this.save.bind(this);
  }

  onChangeCheckbox(i) {
    let resourceType = [...this.state.resourceType];
    resourceType[i] = !this.state.resourceType[i];
    this.setState({ resourceType });
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

  _updateLimits(paramLimits, nameValueId) {
    let limits = [...this.state.limits];
    limits[nameValueId] = paramLimits.resourceLimitsPairs;
    let isDuplicated = [...this.state.isDuplicated];
    isDuplicated[nameValueId] = paramLimits.isDuplicated;
    this.setState({
      limits,
      isDuplicated,
    });
  }

  isRequiredFilled = (k8sResource, item, element) => {
    const { t } = this.props;
    if (k8sResource.metadata[item] === '') {
      switch (item) {
        case 'name':
          this.setState({ inputError: { name: t(`VALIDATION:EMPTY-${element}`, { something: t(`CONTENT:NAME`) }) } });
          return false;
        case 'namespace':
          this.setState({ inputError: { namespace: t(`VALIDATION:EMPTY-${element}`, { something: t(`CONTENT:NAMESPACE`) }) } });
          return false;
      }
    } else {
      this.setState({
        inputError: {
          [item]: null,
        },
      });
      return true;
    }
  };

  onFocusName = () => {
    this.setState({
      inputError: {
        name: null,
      },
    });
  };

  onFocusNamespace = () => {
    this.setState({
      inputError: {
        namespace: null,
      },
    });
  };

  save(e) {
    e.preventDefault();
    const { kind, metadata } = this.state.limitRange;
    this.setState({ inProgress: true });
    const newLimitRange = _.assign({}, this.state.limitRange);

    if (!this.isRequiredFilled(newLimitRange, 'name', 'INPUT') || !this.isRequiredFilled(newLimitRange, 'namespace', 'SELECT')) {
      this.setState({ inProgress: false });
      return;
    }

    for (let i = 0; i < 3; i++) {
      if (this.state.isDuplicated[i]) {
        this.setState({ inProgress: false });
        return;
      }
    }

    let limits = [];
    for (let i = 0; i < 3; i++) {
      if (this.state.resourceType[i]) {
        const type = i === 0 ? 'Pod' : (i === 1 ? 'Container' : 'PersistentVolumeClaim');
        let newLimit = {};
        newLimit['type'] = type;
        this.state.limits[i].forEach(limit => {
          newLimit[limit[ResourceLimitEditorPair.LimitType]] = {};
          if (type === 'PersistentVolumeClaim') {
            newLimit[limit[ResourceLimitEditorPair.LimitType]]['storage'] = limit[ResourceLimitEditorPair.Storage] + limit[ResourceLimitEditorPair.StorageUnit];
          } else {
            const limitType = limit[ResourceLimitEditorPair.LimitType];
            if (limitType === 'maxLimitRequestRatio') {
              if (limit[ResourceLimitEditorPair.CpuRatio] !== '') {
                newLimit[limit[ResourceLimitEditorPair.LimitType]]['cpu'] = limit[ResourceLimitEditorPair.CpuRatio];
              }
              if (limit[ResourceLimitEditorPair.MemoryRatio] !== '') {
                newLimit[limit[ResourceLimitEditorPair.LimitType]]['memory'] = limit[ResourceLimitEditorPair.MemoryRatio];
              }
            } else {
              if (limit[ResourceLimitEditorPair.Cpu] !== '') {
                newLimit[limit[ResourceLimitEditorPair.LimitType]]['cpu'] = limit[ResourceLimitEditorPair.Cpu] + limit[ResourceLimitEditorPair.CpuUnit];
              }
              if (limit[ResourceLimitEditorPair.Memory] !== '') {
                newLimit[limit[ResourceLimitEditorPair.LimitType]]['memory'] = limit[ResourceLimitEditorPair.Memory] + limit[ResourceLimitEditorPair.MemoryUnit];
              }
            }
          }
        });
        limits.push(newLimit);
      }
    }

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
        label: t("CONTENT:DEFAULT")
      },
      {
        value: 'defaultRequest',
        label: t("CONTENT:DEFAULTREQUEST")
      },
      {
        value: 'max',
        label: t("CONTENT:MAX")
      },
      {
        value: 'min',
        label: t("CONTENT:MIN")
      },
      {
        value: 'maxLimitRequestRatio',
        label: t("CONTENT:MAXLIMITREQUESTRQTIO")
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
              <input className="form-control" type="text" onFocus={this.onFocusName} onChange={this.onNameChanged} value={this.state.limitRange.metadata.name} id="limit-range-name" />
              {this.state.inputError.name && <p className="cos-error-title">{this.state.inputError.name}</p>}
            </Section>
            <Section label={t('CONTENT:NAMESPACE')} isRequired={true}>
              <NsDropdown id="limit-range-namespace" t={t} onFocus={this.onFocusNamespace} onChange={this.onNamespaceChanged} />
              {this.state.inputError.namespace && <p className="cos-error-title">{this.state.inputError.namespace}</p>}
            </Section>
            <Section label={t('CONTENT:LABELS')} isRequired={false}>
              <SelectorInput desc={t('STRING:RESOURCEQUOTA-CREATE-1')} isFormControl={true} labelClassName="co-text-namespace" tags={[]} onChange={this.onLabelChanged} />
              <div id="labelErrMsg" style={{ display: 'none', color: 'red' }}>
                <p>{t('VALIDATION:LABEL_FORM')}</p>
              </div>
            </Section>
            <Section label={t('CONTENT:RESOURCELIMITSRANGE')} isRequired={false} paddingTop={'5px'}>
              <CheckboxLimitType id='pod' label={t('RESOURCE:POD')} isChecked={this.state.resourceType[0]} onChange={() => this.onChangeCheckbox(0)}>
                {this.state.resourceType[0] &&
                  <ResourceLimitEditor id='pod' t={t} typeOptions={typeOptions} limitTypeOptions={limitTypeOptions} resourceLimitsPairs={this.state.limits[0]} SelectTypeString="selectType" SelectLimitTypeString="selectLimitType" valueString="value" nameValueId={0} updateParentData={this._updateLimits} isDuplicated={this.state.isDuplicated[0]} />
                }
              </CheckboxLimitType>
              <CheckboxLimitType id='container' label={t('RESOURCE:CONTAINER')} isChecked={this.state.resourceType[1]} onChange={() => this.onChangeCheckbox(1)}>
                {this.state.resourceType[1] &&
                  <ResourceLimitEditor id='container' t={t} typeOptions={typeOptions} limitTypeOptions={limitTypeOptions} resourceLimitsPairs={this.state.limits[1]} SelectTypeString="selectType" SelectLimitTypeString="selectLimitType" valueString="value" nameValueId={1} updateParentData={this._updateLimits} isDuplicated={this.state.isDuplicated[1]} />
                }
              </CheckboxLimitType>
              <CheckboxLimitType id='pvc' label={t('CONTENT:PVC')} isChecked={this.state.resourceType[2]} onChange={() => this.onChangeCheckbox(2)}>
                {this.state.resourceType[2] &&
                  <ResourceLimitEditor id='pvc' t={t} typeOptions={typeOptions} limitTypeOptions={limitTypeOptions} resourceLimitsPairs={this.state.limits[2]} SelectTypeString="selectType" SelectLimitTypeString="selectLimitType" valueString="value" nameValueId={2} updateParentData={this._updateLimits} isDuplicated={this.state.isDuplicated[2]} />
                }
              </CheckboxLimitType>
              <div className="col-md-12 col-xs-12"><span>{t('STRING:LIMITRANGE-CREATE-2')}</span></div>
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
