import * as _ from 'lodash-es';
import * as React from 'react';

import { k8sPatch, referenceForModel } from '../../module/k8s';
import { createModalLauncher, ModalTitle, ModalBody, ModalSubmitFooter } from '../factory/modal';
import { PromiseComponent, ResourceIcon, SelectorInput } from '../utils';
import { FirstSection, SecondSection, PodTemplate, VolumeclaimTemplate } from '../utils/form';
import SingleSelect from '../utils/select';
import { useTranslation, Trans } from 'react-i18next';

class BaseTaskModal extends PromiseComponent {
  constructor(props) {
    super(props);
    let { onInputResource } = this.props;
    this._submit = this._submit.bind(this);
    this._cancel = props.cancel.bind(this);
  }

  _changeType() {
    console.log('change');
  }

  _submit(e) {
    e.preventDefault();

    const { kind, path, resource } = this.props;

    const patch = [
      {
        op: this.createPath ? 'add' : 'replace',
        path,
        value: SelectorInput.objectify(this.state.labels),
      },
    ];

    // https://kubernetes.io/docs/user-guide/deployments/#selector
    //   .spec.selector must match .spec.template.metadata.labels, or it will be rejected by the API
    const promise = k8sPatch(kind, resource, patch);
    this.handlePromise(promise).then(this.props.close);
  }

  render() {
    const { kind, resource, pair, onInputResource, t } = this.props;
    const typeOptions = [
      { value: 'Git', label: t('CONTENT:GIT') },
      { value: 'Image', label: t('CONTENT:IMAGE') },
    ];

    return (
      <form style={{ width: '500px' }} onSubmit={this._submit} name="form">
        <ModalTitle>{t('CONTENT:INPUTRESOURCE')}</ModalTitle>
        <ModalBody>
          <SecondSection label={t('CONTENT:NAME')} isRequired={true}>
            {/* <input className="form-control form-group" type="text" onChange={this.onNameChanged} value={this.state.task.metadata.name} id="task-name" required /> */}
            <input
              className="form-control form-group"
              type="text"
              id="inputresource-name"
              onChange={e => {
                onInputResource({ id: 'name', value: e.target });
              }}
              required
            />
          </SecondSection>
          <SecondSection label={t('CONTENT:TYPE')} isRequired={true}>
            <SingleSelect
              options={typeOptions}
              name="Type"
              placeholder="Select Type"
              onChange={e => {
                onInputResource({ id: 'type', value: 'e' });
              }}
            />
          </SecondSection>
          <SecondSection label={t('CONTENT:RESOURCESTORAGEPATH')} isRequired={false}>
            <input
              className="form-control form-group"
              type="text"
              id="resourcestoragepath-name"
              onChange={e => {
                onInputResource({ id: 'path', value: 'e.target' });
              }}
            />
          </SecondSection>
          <SecondSection label={''} isRequired={false}>
            <label>
              <input className="" type="checkbox" id="cbx-select" />
              {t('STRING:TASK_CREATE_1')}
            </label>
            <p>{t('STRING:TASK_CREATE_2')} </p>
          </SecondSection>
        </ModalBody>
        <ModalSubmitFooter errorMessage={this.state.errorMessage} inProgress={this.state.inProgress} submitText={t('Content:Add')} cancel={this._cancel} />
      </form>
    );
  }
}

export const TaskModal = createModalLauncher(props => {
  const { t } = useTranslation();
  return <BaseTaskModal {...props} t={t} onChange={props.onInputResource} />;
});
