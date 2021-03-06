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
    const { updateParentData, resourceLimitsPairs, nameValueId } = this.props;
    updateParentData({ resourceLimitsPairs: resourceLimitsPairs.concat([['', '', '', '', '', '', '', 'Gi', 'Gi']]), isDuplicated: this.hasDuplication(resourceLimitsPairs) }, nameValueId);

  }

  _remove(i) {
    const { updateParentData, nameValueId } = this.props;
    const resourceLimitsPairs = _.cloneDeep(this.props.resourceLimitsPairs);
    resourceLimitsPairs.splice(i, 1);
    updateParentData({ resourceLimitsPairs: resourceLimitsPairs.length ? resourceLimitsPairs : [], isDuplicated: this.hasDuplication(resourceLimitsPairs) }, nameValueId);
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
    updateParentData({ resourceLimitsPairs, isDuplicated: this.hasDuplication(resourceLimitsPairs) }, nameValueId);
  }

  hasDuplication = resourceLimitsPairs => {
    let keys = resourceLimitsPairs.map(pair => pair[ResourceLimitEditorPair.LimitType]);
    return keys.some(key => key !== '' && keys.indexOf(key) !== keys.lastIndexOf(key));
  };

  render() {
    const { SelectTypeString, SelectLimitTypeString, addString, resourceLimitsPairs, allowSorting, readOnly, nameValueId, t, typeOptions, limitTypeOptions, isDuplicated, desc, anotherDesc, id } = this.props;
    const keyValueItems = resourceLimitsPairs.map((pair, i) => {
      const key = _.get(pair, [ResourceLimitEditorPair.Index], i);
      return <ResourceLimitPairElement typeOptions={typeOptions} limitTypeOptions={limitTypeOptions} onChange={this._change} onBlur={this._blur} id={id} t={t} index={i} SelectTypeString={SelectTypeString} SelectLimitTypeString={SelectLimitTypeString} allowSorting={allowSorting} readOnly={readOnly} pair={pair} key={key} onRemove={this._remove} rowSourceId={nameValueId} />;
    });
    return (
      <React.Fragment>
        {keyValueItems}
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
          {isDuplicated ? (
            <div className="col-md-12 col-xs-12 cos-error-title">
              {t(`VALIDATION:DUPLICATE-KEY`)}
            </div>
          ) : null}
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
  }
  _onRemove = (e) => {
    const { index, onRemove } = this.props;
    event.preventDefault();
    onRemove(index);
  }
  _onChangeSelectLimitType = (e) => {
    const { index, onChange } = this.props;
    onChange(e, index, ResourceLimitEditorPair.LimitType, true);
  }
  _onChangeCpu = (e) => {
    const { index, onChange } = this.props;
    onChange(e, index, ResourceLimitEditorPair.Cpu, false);
  }
  _onChangeMemory = (e) => {
    const { index, onChange } = this.props;
    onChange(e, index, ResourceLimitEditorPair.Memory, false);
  }
  _onChangeStorage = (e) => {
    const { index, onChange } = this.props;
    onChange(e, index, ResourceLimitEditorPair.Storage, false);
  }
  _onChangeCpuRatio = (e) => {
    const { index, onChange } = this.props;
    onChange(e, index, ResourceLimitEditorPair.CpuRatio, false);
  }
  _onChangeMemoryRatio = (e) => {
    const { index, onChange } = this.props;
    onChange(e, index, ResourceLimitEditorPair.MemoryRatio, false);
  }
  _onBlurKey = (e) => {
    const { index, onBlur } = this.props;
    onBlur(e, index);
  }

  onCpuUnitChanged = e => {
    const { index, onChange } = this.props;
    this.setState({ cpuUnit: e.value });
    onChange(e, index, ResourceLimitEditorPair.CpuUnit, true);
  };

  onMemoryUnitChanged = e => {
    const { index, onChange } = this.props;
    this.setState({ memoryUnit: e.value });
    onChange(e, index, ResourceLimitEditorPair.MemoryUnit, true);
  };

  onStorageUnitChanged = e => {
    const { index, onChange } = this.props;
    this.setState({ storageUnit: e.value });
    onChange(e, index, ResourceLimitEditorPair.StorageUnit, true);
  };

  render() {
    const { SelectLimitTypeString, allowSorting, pair, t, limitTypeOptions, id } = this.props;
    const deleteButton = (
      <React.Fragment>
        <Button noMarginTop={true} children={<FaMinus />} onClick={this._onRemove}></Button>
        <span className="sr-only">Delete</span>
      </React.Fragment>
    );

    return (
      <div className={classNames('row', 'pairs-list__row')} ref={node => (this.node = node)} style={{ paddingBottom: '0px' }}>
        <div className="col-md-2 col-xs-2 pairs-list__name-field">
          <div className="row" style={{ marginLeft: '15px' }}>
            {t(`CONTENT:RESOURCELIMITTYPE`)}
          </div>
          {
            id !== "pvc" ?
              (
                id === "pod" ?
                  <SingleSelect options={limitTypeOptions.slice(2)} value={pair[ResourceLimitEditorPair.LimitType]} name={''} placeholder={t(`CONTENT:${SelectLimitTypeString.toUpperCase()}`)} onChange={this._onChangeSelectLimitType} onBlur={this._onBlurKey} />
                  :
                  (<SingleSelect options={limitTypeOptions} value={pair[ResourceLimitEditorPair.LimitType]} name={''} placeholder={t(`CONTENT:${SelectLimitTypeString.toUpperCase()}`)} onChange={this._onChangeSelectLimitType} onBlur={this._onBlurKey} />
                  )
              )
              :
              <>
                <SingleSelect options={limitTypeOptions.slice(2, 4)} value={pair[ResourceLimitEditorPair.LimitType]} name={''} placeholder={t(`CONTENT:${SelectLimitTypeString.toUpperCase()}`)} onChange={this._onChangeSelectLimitType} onBlur={this._onBlurKey} />
              </>
          }
        </div>
        {
          id !== "pvc" ? (
            pair[ResourceLimitEditorPair.LimitType] === "maxLimitRequestRatio" ? (
              <>
                <div className="col-md-2 col-xs-2 pairs-list__name-field" style={{ paddingLeft: '0px' }}>
                  <div className="row" style={{ marginLeft: '35px' }}>
                    {t(`CONTENT:CPU`)}
                  </div>
                  <div className="row" style={{ margin: '0 0 20px 10px' }}>
                    <div className="col-md-12 col-xs-12 pairs-list__protocol-field" style={{ paddingTop: '0px' }}>
                      <input type="text" className="form-control" value={pair[ResourceLimitEditorPair.CpuRatio] || ''} onChange={this._onChangeCpuRatio} onBlur={this._onBlurKey} />
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-xs-3 pairs-list__name-field" style={{ paddingLeft: '0px' }}>
                  <div className="row" style={{ marginLeft: '35px' }}>
                    {t(`CONTENT:MEMORY`)}
                  </div>
                  <div className="row" style={{ margin: '0 0 20px 10px' }}>
                    <div className="col-md-8 col-xs-8 pairs-list__protocol-field" style={{ paddingTop: '0px' }}>
                      <input type="text" className="form-control" value={pair[ResourceLimitEditorPair.MemoryRatio] || ''} onChange={this._onChangeMemoryRatio} onBlur={this._onBlurKey} />
                    </div>
                    <div className="col-md-4 col-xs-4">
                      <span className={classNames(allowSorting ? 'pairs-list__span-btns' : null)}>{allowSorting ? <React.Fragment>{deleteButton}</React.Fragment> : deleteButton}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (pair[ResourceLimitEditorPair.LimitType] !== "" ?
              (
                <>
                  <div className="col-md-3 col-xs-3 pairs-list__name-field" style={{ paddingLeft: '0px' }}>
                    <div className="row" style={{ marginLeft: '35px' }}>
                      {t("CONTENT:CPULIMITS")}
                    </div>
                    <div className="row" style={{ margin: '0 0 20px 10px' }}>
                      <div className="col-md-6 col-xs-6 pairs-list__protocol-field"
                        style={{ paddingTop: '0px' }}>
                        <input type="text" className="form-control" value={pair[ResourceLimitEditorPair.Cpu] || ''} onChange={this._onChangeCpu} onBlur={this._onBlurKey} />
                      </div>
                      <div className="col-md-6 col-xs-6 pairs-list__name-field" id='cpu-units' style={{ paddingTop: '0px' }}>
                        <SingleSelect options={ResourceLimitPairElement.CpulimitUnitOptions} value={pair[ResourceLimitEditorPair.CpuUnit]} onChange={this.onCpuUnitChanged} />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-xs-4 pairs-list__name-field" style={{ paddingLeft: '0px' }}>
                    <div className="row" style={{ marginLeft: '35px' }}>
                      {t("CONTENT:MEMORYLIMITS")}
                    </div>
                    <div className="row" style={{ margin: '0 0 20px 10px' }}>
                      <div className="col-md-4 col-xs-4 pairs-list__protocol-field"
                        style={{ paddingTop: '0px' }}>
                        <input type="text" className="form-control" value={pair[ResourceLimitEditorPair.Memory] || ''} onChange={this._onChangeMemory} onBlur={this._onBlurKey} />
                      </div>
                      <div className="col-md-4 col-xs-4 pairs-list__name-field" id='memory-units'
                        style={{ paddingTop: '0px' }}>
                        <SingleSelect options={ResourceLimitPairElement.MemorylimitUnitOptions} value={pair[ResourceLimitEditorPair.MemoryUnit]} onChange={this.onMemoryUnitChanged} />
                      </div>
                      <div className="col-md-2 col-xs-2">
                        <span className={classNames(allowSorting ? 'pairs-list__span-btns' : null)}>{allowSorting ? <React.Fragment>{deleteButton}</React.Fragment> : deleteButton}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : ''
              )
          ) : (
              <div className="col-md-6 col-xs-6 pairs-list__name-field" style={{ paddingLeft: '0px' }}>
                <div className="row" style={{ marginLeft: '35px' }}>
                  {t("CONTENT:STORAGESIZE")}
                </div>
                <div className="row" style={{ margin: '0 0 20px 10px' }}>
                  <div className="col-md-3 col-xs-3 pairs-list__protocol-field" style={{ paddingTop: '0px' }}>
                    <input type="text" className="form-control" value={pair[ResourceLimitEditorPair.Storage] || ''} onChange={this._onChangeStorage} onBlur={this._onBlurKey} />
                  </div>
                  <div className="col-md-3 col-xs-3 pairs-list__name-field" id='storage-units' style={{ paddingTop: '0px' }}>
                    <SingleSelect options={ResourceLimitPairElement.MemorylimitUnitOptions} value={pair[ResourceLimitEditorPair.StorageUnit]} onChange={this.onStorageUnitChanged} />
                  </div>
                  <div className="col-md-2 col-xs-2">
                    <span className={classNames(allowSorting ? 'pairs-list__span-btns' : null)}>{allowSorting ? <React.Fragment>{deleteButton}</React.Fragment> : deleteButton}</span>
                  </div>
                </div>
              </div>
            )
        }
      </div>
    );
  }
}

ResourceLimitPairElement.CpulimitUnitOptions = [
  { value: '', label: 'CPU' },
  { value: 'm', label: 'm' },
];

ResourceLimitPairElement.MemorylimitUnitOptions = [
  { value: 'Mi', label: 'Mi' },
  { value: 'Gi', label: 'Gi' },
  { value: 'Ti', label: 'Ti' },
  { value: 'Pi', label: 'Pi' },
  { value: 'M', label: 'M' },
  { value: 'G', label: 'G' },
  { value: 'T', label: 'T' },
  { value: 'P', label: 'P' },
];
