/* eslint-disable no-undef */
import * as _ from 'lodash-es';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { k8sCreate, k8sUpdate, K8sResourceKind } from '../../module/k8s';
import { ButtonBar, Firehose, history, kindObj, StatusBox, SelectorInput } from '../utils';
import { formatNamespacedRouteForResource } from '../../ui/ui-actions';
import { AsyncComponent } from '../utils/async';
import { VolumeEditor } from '../utils/volume-editor';
import { BasicPortEditor } from '../utils/basic-port-editor';
import { KeyValueEditor } from '../utils/key-value-editor';
import { ValueEditor } from '../utils/value-editor';

enum CreateType {
    generic = 'generic',
    form = 'form',
}
const pageExplanation = {
    [CreateType.form]: 'Create Deployment using Form Editor',
};

const determineCreateType = (data) => {
    return CreateType.form;
};

const Section = ({ label, children, id }) => <div className="row">
    <div className="col-xs-2">
        <div>{label}</div>
    </div>
    <div className="col-xs-2" id={id}>
        {children}
    </div>
</div>;

const NameValueEditorComponent = (props) => <AsyncComponent loader={() => import('../utils/name-value-editor.jsx').then(c => c.NameValueEditor)} {...props} />;

// Requestform returns SubForm which is a Higher Order Component for all the types of secret forms.
const Requestform = (SubForm) => class SecretFormComponent extends React.Component<BaseEditSecretProps_, BaseEditSecretState_> {
    constructor(props) {
        super(props);
        const existingTemplateInstance = _.pick(props.obj, ['metadata', 'type']);
        const deployment = _.defaultsDeep({}, props.fixed, existingTemplateInstance, {
            apiVersion: 'apps/v1',
            kind: "Deployment",
            metadata: {
                name: '',
                labels: {}
            },
            spec: {
                replicas: 1,
                selector: {
                    matchLabels: { app: '' }
                },
                template: {
                    metadata: {
                        labels: { app: '' }
                    },
                    spec: {
                        containers: [{
                            name: 'hello-hypercloud',
                            image: 'hypercloud/hello-hypercloud'
                        }],
                        restartPolicy: 'Always',
                        env: []
                    }
                }
            }
        });

        this.state = {
            secretTypeAbstraction: this.props.secretTypeAbstraction,
            deployment: deployment,
            inProgress: false,
            templateList: [],
            paramList: [],
            editParamList: true,
            selectedTemplate: '',
            restartPolicyTypeList: ['Always', 'OnFailure', 'Never'],
            volumeOptions: [],
            volumes: [['', '', '', 'false']],
            pvcList: [],
            ports: [['', '', 'TCP']],
            env: [['', '']],
            requests: [['', '']],
            limits: [['', '']],
            runCommandArguments: [['']],
            runCommands: [['']],
        };

        this.onNameChanged = this.onNameChanged.bind(this);
        this.onNameFocusOut = this.onNameFocusOut.bind(this);
        this.onImageChanged = this.onImageChanged.bind(this);
        this.onImagePullPolicyChanged = this.onImagePullPolicyChanged.bind(this);
        this.onReplicasChanged = this.onReplicasChanged.bind(this);
        this.onLabelChanged = this.onLabelChanged.bind(this);
        this.save = this.save.bind(this);
        this.onRestartPolicyChanged = this.onRestartPolicyChanged.bind(this);
        this._updateRunCommands = this._updateRunCommands.bind(this);
        this._updateRunCommandArguments = this._updateRunCommandArguments.bind(this);
        this._updateEnv = this._updateEnv.bind(this);
        this._updateRequests = this._updateRequests.bind(this);
        this._updateLimits = this._updateLimits.bind(this);
        this._updatePorts = this._updatePorts.bind(this);
        this._updateVolumes = this._updateVolumes.bind(this);
    }
    onNameChanged(event) {
        let deployment = { ...this.state.deployment };
        deployment.metadata.name = event.target.value;
        deployment.metadata.labels.app = event.target.value;
        this.setState({ deployment });
    }
    onNameFocusOut(event) {
        // name 변경 시 
        let deployment = { ...this.state.deployment };
        deployment.spec.selector.matchLabels.app = event.target.value;
        deployment.spec.template.metadata.labels.app = event.target.value;
        this.setState({ deployment });
    }
    _updateRunCommands(commands) {
        this.setState({
            runCommands: commands.values
        });
    }
    _updateRunCommandArguments(args) {
        this.setState({
            runCommandArguments: args.values
        });
    }
    _updateEnv(envs) {
        this.setState({
            env: envs.keyValuePairs
        });
    }
    _updateRequests(reqs) {
        this.setState({
            requests: reqs.keyValuePairs
        });
    }
    _updateLimits(lims) {
        this.setState({
            limits: lims.keyValuePairs
        });
    }
    _updatePorts(port) {
        this.setState({
            ports: port.portPairs
        });
    }
    _updateVolumes(volume) {
        this.setState({
            volumes: volume.volumePairs
        });
    }
    onRestartPolicyChanged(event) {
        let deployment = { ...this.state.deployment };
        deployment.spec.template.spec.restartPolicy = event.target.value;
        this.setState({ deployment });
    }
    onImageChanged(event) {
        let deployment = { ...this.state.deployment };
        deployment.spec.template.spec.containers[0].image = event.target.value;
        this.setState({ deployment });
    }
    onImagePullPolicyChanged(event) {
        let deployment = { ...this.state.deployment };
        deployment.spec.template.spec.containers[0].imagePullPolicy = event.target.value;
        this.setState({ deployment });
    }
    onReplicasChanged(event) {
        let deployment = { ...this.state.deployment };
        deployment.spec.replicas = Number(event.target.value);
        this.setState({ deployment });
    }
    onLabelChanged(event) {
        let deployment = { ...this.state.deployment };
        deployment.metadata.labels = { app: '' };
        if (event.length !== 0) {
            event.forEach(item => {
                if (item.split('=')[1] === undefined) {
                    document.getElementById('labelErrMsg').style.display = 'block';
                    event.pop(item);
                    return;
                }
                document.getElementById('labelErrMsg').style.display = 'none';
            })
        }
        this.setState({ deployment });
    }
    save(e) {
        e.preventDefault();
        const { kind, metadata } = this.state.deployment;
        this.setState({ inProgress: true });

        // env 데이터 가공
        this.state.env.forEach(arr => {
            let obj = {
                name: arr[0],
                value: arr[1]
            };
            let deployment = { ...this.state.deployment };
            deployment.spec.template.spec.env.push(obj);
            this.setState({ deployment });
        })

        const newSecret = _.assign({}, this.state.deployment);
        const ko = kindObj(kind);

        console.log(this.state);
        return;
        (this.props.isCreate
            ? k8sCreate(ko, newSecret)
            : k8sUpdate(ko, newSecret, metadata.namespace, newSecret.metadata.name)
        ).then(() => {
            this.setState({ inProgress: false });
            history.push('/k8s/ns/' + metadata.namespace + '/deployments');
        }, err => this.setState({ error: err.message, inProgress: false }));
    }
    componentDidMount() {
    }
    render() {

        const { restartPolicyTypeList, volumeOptions } = this.state;
        let options = restartPolicyTypeList.map(function (type_) {
            return <option value={type_}>{type_}</option>;
        });

        return <div className="co-m-pane__body">
            < Helmet >
                <title>Create Deployment</title>
            </Helmet >
            <form className="co-m-pane__body-group co-create-secret-form" onSubmit={this.save}>
                <h1 className="co-m-pane__heading">Create Deployment</h1>
                <p className="co-m-pane__explanation">{this.props.explanation}</p>
                <fieldset disabled={!this.props.isCreate}>
                    <div className="form-group">
                        <label className="control-label" htmlFor="secret-name">Name</label>
                        <div>
                            <input className="form-control"
                                type="text"
                                onChange={this.onNameChanged}
                                onBlur={this.onNameFocusOut}
                                value={this.state.deployment.metadata.name}
                                id="deplaoyment-name"
                                required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="secret-name">Container Image</label>
                        <div>
                            <input className="form-control"
                                type="text"
                                onChange={this.onImageChanged}
                                id="template-instance-name"
                                required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="secret-type" >Image pull policy</label>
                        <div>
                            <select onChange={this.onImagePullPolicyChanged} className="form-control" id="template">
                                <option value='Always'>Always</option>
                                <option value='IfNotPresent'>IfNotPresent</option>
                                <option value='Never'>Never</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label" htmlFor="secret-name">Replicas</label>
                        <div>
                            <input className="form-control"
                                type="text"
                                onChange={this.onReplicasChanged}
                                id="template-instance-name"
                                required />
                        </div>
                    </div>
                </fieldset>
                <div className="form-group">
                    <React.Fragment>
                        <div className="form-group">
                            <label className="control-label" htmlFor="username">Labels</label>
                            <div>
                                <SelectorInput labelClassName="co-text-namespace" tags={[]} onChange={this.onLabelChanged} />
                            </div>
                        </div>
                    </React.Fragment>
                    <div id="labelErrMsg" style={{ display: 'none', color: 'red' }}>
                        <p>Lables must be 'key=value' form.</p>
                    </div>
                </div>

                {/* Run command */}
                <div className="form-group">
                    <React.Fragment>
                        <div className="form-group">
                            <label className="control-label" htmlFor="username">Run command</label>
                            <div>
                                <ValueEditor valueString="Run Command" values={this.state.runCommands} updateParentData={this._updateRunCommands} />
                            </div>
                        </div>
                    </React.Fragment>
                </div>

                {/* Run command arguments */}
                <div className="form-group">
                    <React.Fragment>
                        <div className="form-group">
                            <label className="control-label" htmlFor="username">Run command arguments</label>
                            <div>
                                <ValueEditor valueString="Run Command Arguments" values={this.state.runCommandArguments} updateParentData={this._updateRunCommandArguments}/>
                            </div>
                        </div>
                    </React.Fragment>
                </div>

                {/* Environment variables */}
                <div className="form-group">
                    <React.Fragment>
                        <div className="form-group">
                            <label className="control-label" htmlFor="username">Environment variables</label>
                            <div>
                                <KeyValueEditor keyValuePairs={this.state.env} updateParentData={this._updateEnv}/>
                            </div>
                        </div>
                    </React.Fragment>
                </div>

                {/* Port */}
                <div className="form-group">
                    <React.Fragment>
                        <div className="form-group">
                            <label className="control-label" htmlFor="username">Port</label>
                            <div>
                            <BasicPortEditor portPairs={this.state.ports} updateParentData={this._updatePorts}/>
                            </div>
                        </div>
                    </React.Fragment>
                </div>

                {/* Volumes */}
                <div className="form-group">
                    <React.Fragment>
                        <div className="form-group">
                            <label className="control-label" htmlFor="username">Volumes</label>
                            <div>
                            <VolumeEditor options={volumeOptions} volumePairs={this.state.volumes} updateParentData={this._updateVolumes}/>
                            </div>
                        </div>
                    </React.Fragment>
                </div>

                {/* Resource(Request) */}
                <div className="form-group">
                    <React.Fragment>
                        <div className="form-group">
                            <label className="control-label" htmlFor="username">Resource(Request)</label>
                            <div>
                            <KeyValueEditor keyValuePairs={this.state.requests} keyString="resource" valueString="quantity" updateParentData={this._updateRequests} />
                            </div>
                        </div>
                    </React.Fragment>
                </div>

                {/* Resource(Limits) */}
                <div className="form-group">
                    <React.Fragment>
                        <div className="form-group">
                            <label className="control-label" htmlFor="username">Resource(Limits)</label>
                            <div>
                            <KeyValueEditor keyValuePairs={this.state.limits} keyString="resource" valueString="quantity" updateParentData={this._updateLimits}/>
                            </div>
                        </div>
                    </React.Fragment>
                </div>

                {/* Restart Policy */}
                <div className="form-group">
                    <React.Fragment>
                        <div className="form-group">
                            <label className="control-label" htmlFor="username">Restart Policy</label>
                            <div>
                                <select onChange={this.onRestartPolicyChanged} className="form-control" id="template">
                                    {options}
                                </select>
                            </div>
                        </div>
                    </React.Fragment>
                </div>

                <ButtonBar errorMessage={this.state.error} inProgress={this.state.inProgress} >
                    <button type="submit" className="btn btn-primary" id="save-changes">{this.props.saveButtonText || 'Create'}</button>
                    <Link to={formatNamespacedRouteForResource('deployments')} className="btn btn-default" id="cancel">Cancel</Link>
                </ButtonBar>
            </form>
        </div >;
    }
};
class SourceSecretForm extends React.Component<SourceSecretFormProps> {
    constructor(props) {
        super(props);
        this.state = {
            stringData: this.props.stringData || {},
        };
        this.onDataChanged = this.onDataChanged.bind(this);
    }
    onDataChanged(secretsData) {
        this.setState({
            stringData: { ...secretsData },
        }, () => this.props.onChange(this.state));
    }
    render() {
        return <React.Fragment>
        </React.Fragment>;
    }
}

const secretFormFactory = secretType => {
    return secretType === CreateType.form ? Requestform(SourceSecretForm) : Requestform(SourceSecretForm);
};

const SecretLoadingWrapper = props => {
    const secretTypeAbstraction = determineCreateType(_.get(props.obj.data, 'data'));
    const SecretFormComponent = secretFormFactory(secretTypeAbstraction);
    const fixed = _.reduce(props.fixedKeys, (acc, k) => ({ ...acc, k: _.get(props.obj.data, k) }), {});
    return <StatusBox {...props.obj}>
        <SecretFormComponent {...props}
            secretTypeAbstraction={secretTypeAbstraction}
            obj={props.obj.data}
            fixed={fixed}
            explanation={pageExplanation[secretTypeAbstraction]}
        />
    </StatusBox>;
};

export const CreateDeployment = ({ match: { params } }) => {
    const SecretFormComponent = secretFormFactory(params.type);
    return <SecretFormComponent fixed={{ metadata: { namespace: params.ns } }}
        secretTypeAbstraction={params.type}
        explanation={pageExplanation[params.type]}
        titleVerb="Create"
        isCreate={true}
    />;
};

export const EditSecret = ({ match: { params }, kind }) => <Firehose resources={[{ kind: kind, name: params.name, namespace: params.ns, isList: false, prop: 'obj' }]}>
    <SecretLoadingWrapper fixedKeys={['kind', 'metadata']} titleVerb="Edit" saveButtonText="Save Changes" />
</Firehose>;


export type BaseEditSecretState_ = {
    secretTypeAbstraction?: CreateType,
    deployment: K8sResourceKind,
    inProgress: boolean,
    error?: any,
    templateList: Array<any>,
    paramList: Array<any>,
    editParamList: boolean,
    selectedTemplate: string,
    restartPolicyTypeList: Array<any>,
    volumes: Array<any>,
    pvcList: Array<any>,
    ports: Array<any>,
    env: Array<any>,
    requests: Array<any>,
    limits: Array<any>,
    runCommandArguments: Array<any>,
    runCommands: Array<any>,
    volumeOptions: Array<any>,
};

export type BaseEditSecretProps_ = {
    obj?: K8sResourceKind,
    fixed: any,
    kind?: string,
    isCreate: boolean,
    titleVerb: string,
    secretTypeAbstraction?: CreateType,
    saveButtonText?: string,
    explanation: string,
};

export type SourceSecretFormProps = {
    onChange: Function;
    stringData: {
        [key: string]: string
    },
    isCreate: boolean,
};
/* eslint-enable no-undef */
