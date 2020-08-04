import * as _ from 'lodash-es';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
// import Iframe from 'react-iframe'

// <Iframe url="http://192.168.0.191:9000/api/grafana/"
//   width="1700" height="880" scrolling="auto"
//   id="myId"
//   className="myClassname"
//   display="initial"
//   position="relative" />

export const Grafana = props => {
  const { t } = useTranslation();
  console.log(window.location.origin);
  const grafanaURL = window.location.origin + '/api/grafana';
  return (
    <div>
      {/* <iframe width="1700" height="880" scrolling="auto" src="https://192.168.0.191:9000/api/grafana/d/bbb2a765a623ae38130206c7d94a160f/kubernetes-networking-namespace-workload?orgId=1&refresh=30s" sandbox="allow-scripts">
        https://192.168.0.191:9000/api/grafana/d/UAJdHJmGk/2-cluster-monitor?orgId=1&refresh=10s&var-Cluster1=prometheus&var-cluster=&var-interval=4h&var-Cluster2=Cluester2
      </iframe> */}
      {/* <iframe width="1700" height="880" scrolling="auto" src="http://192.168.0.191:9000/api/grafana/" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-popups-to-escape-sandbox allow-presentation allow-top-navigation allow-top-navigation-by-user-activation"> */}
      {/* <iframe width="1700" height="880" scrolling="auto" src="http://192.168.0.191:9000/api/grafana/" sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-popups-to-escape-sandbox allow-presentation allow-top-navigation allow-top-navigation-by-user-activation">   */}
      <iframe width="1700" height="880" scrolling="auto" src={grafanaURL}>
        {grafanaURL}
      </iframe>
    </div>
  );
};
// import * as ReactDOM from 'react-dom';
// import { Helmet } from 'react-helmet';
// import * as PropTypes from 'prop-types';
// import * as classNames from 'classnames';

// import { history, NavTitle, SelectorInput, LoadingBox } from './utils';
// import { namespaceProptype } from '../propTypes';
// import { split, selectorFromString } from '../module/k8s/selector';
// import { requirementFromString } from '../module/k8s/selector-requirement';
// import { resourceListPages } from './resource-pages';
// import { ResourceListDropdown } from './resource-dropdown';
// import { connectToModel } from '../kinds';
// import { connectToFlags, FLAGS, flagPending } from '../features';
// import { OpenShiftGettingStarted } from './start-guide';
// import { referenceForModel, kindForReference } from '../module/k8s';
// import { AsyncComponent } from './utils/async';
// import { DefaultPage } from './default-resource';

// const ResourceList = connectToModel(({ kindObj, kindsInFlight, namespace, selector, fake }) => {
//   if (kindsInFlight) {
//     return <LoadingBox />;
//   }

//   const componentLoader = resourceListPages.get(referenceForModel(kindObj), () => Promise.resolve(DefaultPage));
//   const ns = kindObj.namespaced ? namespace : undefined;

//   return <AsyncComponent loader={componentLoader} namespace={ns} selector={selector} kind={kindObj.crd ? referenceForModel(kindObj) : kindObj.kind} showTitle={false} autoFocus={false} fake={fake} />;
// });

// const updateUrlParams = (k, v) => {
//   const url = new URL(window.location);
//   const sp = new URLSearchParams(window.location.search);
//   sp.set(k, v);
//   history.push(`${url.pathname}?${sp.toString()}${url.hash}`);
// };

// const updateKind = kind => updateUrlParams('kind', encodeURIComponent(kind));
// const updateTags = tags => updateUrlParams('q', tags.map(encodeURIComponent).join(','));

// class GrafanaPage_ extends React.PureComponent {
//   constructor(props) {
//     super(props);
//     this.setRef = ref => (this.ref = ref);
//     this.onSelectorChange = k => {
//       updateKind(k);
//       this.ref && this.ref.focus();
//     };
//   }

//   render() {
//     const { flags, location, namespace, t } = this.props;
//     let kind, q;

//     if (flagPending(flags.OPENSHIFT) || flagPending(flags.PROJECTS_AVAILABLE)) {
//       return null;
//     }

//     if (location.search) {
//       const sp = new URLSearchParams(window.location.search);
//       kind = sp.get('kind');
//       q = sp.get('q');
//     }

//     // Ensure that the "kind" route parameter is a valid resource kind ID
//     kind = kind ? decodeURIComponent(kind) : 'Service';
//     let ns = localStorage.getItem('bridge/last-namespace-name');
//     const showGettingStarted = flags.OPENSHIFT && !flags.PROJECTS_AVAILABLE;
//     let url = `${document.location.origin}/api/grafana/d/k8s-namespace/?var-namespace=${ns}`
//     return (
//       <React.Fragment>
//         {showGettingStarted && <OpenShiftGettingStarted />}
//         <div className={classNames({ 'co-disabled': showGettingStarted })}>
//           <Helmet>
//             <title>Grafana</title>
//           </Helmet>
//           <NavTitle title='Grafana'>
//           </NavTitle>
//           <iframe style={{ width: '100%', height: '100vh', border: 0 }} src={url} target="_blank" />
//         </div>
//       </React.Fragment>
//     );
//   }
// }

// export const GrafanaPage = connectToFlags(FLAGS.OPENSHIFT, FLAGS.PROJECTS_AVAILABLE)(GrafanaPage_);

// GrafanaPage.propTypes = {
//   namespace: namespaceProptype,
//   location: PropTypes.object.isRequired,
// }
