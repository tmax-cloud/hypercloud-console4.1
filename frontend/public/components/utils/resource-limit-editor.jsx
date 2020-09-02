import * as React from 'react';
import * as _ from 'lodash-es';
import { FaMinus } from 'react-icons/fa';
import { Button } from './button';
import * as classNames from 'classnames';
import { ResourceLimitEditorPair } from './index';
import SingleSelect from './select';

export class ResourceLimitEditor extends React.Component {
  constructor(props) {
    super(props);
    this._append = this._append.bind(this);
    this._change = this._change.bind(this);
    this._remove = this._remove.bind(this);
    this._blur = this._blur.bind(this);
  }
  _append() {
    const { updateParentData, resourceLimitsPairs: resourceLimitsPairs, nameValueId } = this.props;
    updateParentData({ resourceLimitsPairs: resourceLimitsPairs.concat([['', '', '', '', '']]), isDuplicated: this.hasDuplication(resourceLimitsPairs) }, nameValueId);
  }

  _remove(i) {
    const { updateParentData, nameValueId } = this.props;
    const resourceLimitsPairs = _.cloneDeep(this.props.resourceLimitsPairs);
    resourceLimitsPairs.splice(i, 1);
    updateParentData({ resourceLimitsPairs: resourceLimitsPairs.length ? resourceLimitsPairs : [['', '', '', '', '']], isDuplicated: this.hasDuplication(resourceLimitsPairs) }, nameValueId);
  }

  _change(e, i, type, isSelect = false) {
    const { updateParentData, nameValueId } = this.props;
    const resourceLimitsPairs = _.cloneDeep(this.props.resourceLimitsPairs);
    resourceLimitsPairs[i][type] = isSelect ? e.value : e.target.value;
    updateParentData({ resourceLimitsPairs, isDuplicated: this.hasDuplication(resourceLimitsPairs) }, nameValueId);
  }

  _blur() {
    const { updateParentData, nameValueId } = this.props;
    const resourceLimitsPairs = _.cloneDeep(this.props.resourceLimitsPairs);
    updateParentData({ resourceLimitsPairs, isDuplicated: this.hasDuplication(resourceLimitsPairs) });
  }

  hasDuplication = resourceLimitsPairs => {
    let keys = resourceLimitsPairs.map(pair => pair[ResourceLimitEditorPair.Type] + pair[ResourceLimitEditorPair.LimitType]);
    return new Set(keys).size !== keys.length;
  };

  render() {
    const { SelectTypeString, SelectLimitTypeString, addString, resourceLimitsPairs, allowSorting, readOnly, nameValueId, t, typeOptions, limitTypeOptions, isDuplicated, desc, anotherDesc } = this.props;
    const keyValueItems = resourceLimitsPairs.map((pair, i) => {
      const key = _.get(pair, [ResourceLimitEditorPair.Index], i);
      return <ResourceLimitPairElement typeOptions={typeOptions} limitTypeOptions={limitTypeOptions} onChange={this._change} onBlur={this._blur} t={t} index={i} SelectTypeString={SelectTypeString} SelectLimitTypeString={SelectLimitTypeString} allowSorting={allowSorting} readOnly={readOnly} pair={pair} key={key} onRemove={this._remove} rowSourceId={nameValueId} />;
    });
    return (
      <React.Fragment>
        {keyValueItems}
        <div className="row">
          {isDuplicated ? (
            <div className="col-md-12 col-xs-12 cos-error-title" style={{ marginTop: '-15px' }}>
              {t(`VALIDATION:DUPLICATE-KEY`)}
            </div>
          ) : null}
        </div>
        <div className="row">
          <div className="col-md-12 col-xs-12">
            {readOnly ? null : (
              <React.Fragment>
                <span className="btn-link pairs-list__btn" onClick={this._append}>
                  <i aria-hidden="true" className="fa fa-plus-circle pairs-list__add-icon" />
                  {t(`CONTENT:${addString.replace(/ /gi, '').toUpperCase()}`)}
                </span>
              </React.Fragment>
            )}
          </div>
          <div className="col-md-12 col-xs-12">{desc ? <span>{desc}</span> : ''}</div>
          <div className="col-md-12 col-xs-12">{anotherDesc ? <span>{anotherDesc}</span> : ''}</div>
        </div>
      </React.Fragment>
    );
  }
}
ResourceLimitEditor.defaultProps = {
  SelectTypeString: 'SelectType',
  SelectLimitTypeString: 'SelectLimitType',
  addString: 'Add More',
  allowSorting: false,
  readOnly: false,
  nameValueId: 0,
};

class ResourceLimitPairElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cpuUnit: 'Gi',
      memoryUnit: 'Gi',
      storageUnit: 'Gi',
    };
  }
  _onRemove = (e) => {
    const { index, onRemove } = this.props;
    event.preventDefault();
    onRemove(index);
  }
  _onChangeSelectType = (e) => {
    const { index, onChange } = this.props;
    onChange(e, index, ResourceLimitEditorPair.Type, true);
  }
  _onChangeSelectLimitType = (e) => {
    const { index, onChange } = this.props;
    onChange(e, index, ResourceLimitEditorPair.LimitType, true);
  }
  _onChangeCpu = (e) => {
    const { index, onChange } = this.props;
    onChange(e, index, ResourceLimitEditorPair.Cpu);
  }
  _onChangeMemory = (e) => {
    const { index, onChange } = this.props;
    onChange(e, index, ResourceLimitEditorPair.Memory);
  }
  _onChangeStorage = (e) => {
    const { index, onChange } = this.props;
    onChange(e, index, ResourceLimitEditorPair.Storage);
  }

  _onBlurKey = (e) => {
    const { index, onBlur } = this.props;
    onBlur(e, index, ResourceLimitEditorPair.Type);
  }

  onCpuUnitChanged = e => {
    this.setState({ cpuUnit: e.value });
  };

  onMemoryUnitChanged = e => {
    this.setState({ memoryUnit: e.value });
  };

  onStorageUnitChanged = e => {
    this.setState({ storageUnit: e.value });
  };

  render() {
    const { SelectTypeString, SelectLimitTypeString, allowSorting, readOnly, pair, t, typeOptions, limitTypeOptions } = this.props;
    const deleteButton = (
      <React.Fragment>
        <Button children={<FaMinus />} onClick={this._onRemove}></Button>
        <span className="sr-only">Delete</span>
      </React.Fragment>
    );

    return (
      <>
        <div className={classNames('row', 'pairs-list__row')} ref={node => (this.node = node)}>
          <div className="col-md-2 col-xs-2 pairs-list__name-field">
            <SingleSelect options={typeOptions} value={pair[ResourceLimitEditorPair.Type]} name={''} placeholder={t(`CONTENT:${SelectTypeString.toUpperCase()}`)} onChange={this._onChangeSelectType} onBlur={this._onBlurKey} />
          </div>
          <div className="col-md-2 col-xs-2 pairs-list__name-field">
            <SingleSelect options={limitTypeOptions} value={pair[ResourceLimitEditorPair.LimitType]} name={''} placeholder={t(`CONTENT:${SelectLimitTypeString.toUpperCase()}`)} onChange={this._onChangeSelectLimitType} onBlur={this._onBlurKey} />
          </div>
          {readOnly ? null : (
            <div className="col-md-1 col-xs-2">
              <span className={classNames(allowSorting ? 'pairs-list__span-btns' : null)}>{allowSorting ? <React.Fragment>{deleteButton}</React.Fragment> : deleteButton}</span>
            </div>
          )}
        </div>
        {
          pair[ResourceLimitEditorPair.Type] !== "PersistentVolumeClaim" ? (
            <>
              <div className="col-md-1 col-xs-1 pairs-list__protocol-field">
                <input type="text" className="form-control" placeholder={t(`CONTENT:CPU`)} value={pair[ResourceLimitEditorPair.Cpu] || ''} onChange={this._onChangeCpu} onBlur={this._onBlurKey} />
              </div>
              <div className="col-md-1 col-xs-1 pairs-list__protocol-field">
                <input type="text" className="form-control" placeholder={t(`CONTENT:MEMORY`)} value={pair[ResourceLimitEditorPair.Memory] || ''} onChange={this._onChangeMemory} onBlur={this._onBlurKey} />
              </div>
            </>
          ) : (
              <>
                <div className="row" style={{ marginLeft: '15px' }}>
                  <div className="col-md-2 col-xs-2 pairs-list__name-field">
                    <div>스토리지 크기</div>
                  </div>
                </div>
                <div className="row" style={{ margin: '0 0 20px 10px' }}>
                  <div className="col-md-1 col-xs-1 pairs-list__protocol-field">
                    <input type="text" className="form-control" value={pair[ResourceLimitEditorPair.Storage] || ''} onChange={this._onChangeStorage} onBlur={this._onBlurKey} />
                  </div>
                  <div className="col-md-1 col-xs-1 pairs-list__name-field" id='memory-units'>
                    <SingleSelect options={ResourceLimitPairElement.limitsUnitOptions} value={this.state.storageUnit} onChange={this.onStorageUnitChanged} />
                  </div>
                </div>
              </>
            )
        }
      </>
    );
  }
}

ResourceLimitPairElement.limitsUnitOptions = [
  { value: 'Mi', label: 'Mi' },
  { value: 'Gi', label: 'Gi' },
  { value: 'Ti', label: 'Ti' },
  { value: 'Pi', label: 'Pi' },
  { value: 'Ei', label: 'Ei' },
  { value: 'M', label: 'M' },
  { value: 'G', label: 'G' },
  { value: 'T', label: 'T' },
  { value: 'P', label: 'P' },
  { value: 'E', label: 'E' },
];
