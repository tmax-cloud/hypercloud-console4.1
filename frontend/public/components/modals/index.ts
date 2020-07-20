export * from './configure-count-modal';
export * from './configure-operator-modal';
export * from './configure-operator-channel-modal';
export * from './confirm-modal';
export * from './configure-status-modal';
export * from './create-namespace-modal';
export * from './delete-namespace-modal';
export * from './error-modal';
export * from './kubectl-config';
export * from './configure-unschedulable-modal';
export * from './configure-ns-pull-secret-modal';
export * from './labels-modal';
export * from './configure-update-strategy-modal';
export * from './tags';
export * from './token-info-modal';
export * from './delete-modal';
export * from './service-instance-modal';
export * from './add-resources-modal';


export const taintsModal = (props) =>
  import('./taints-modal' /* webpackChunkName: "taints-modal" */).then((m) => m.taintsModal(props));

export const tolerationsModal = (props) =>
  import('./tolerations-modal' /* webpackChunkName: "tolerations-modal" */).then((m) =>
    m.tolerationsModal(props),
  );

export const expandPVCModal = (props) =>
  import('./expand-pvc-modal' /* webpackChunkName: "expand-pvc-modal" */).then((m) =>
    m.expandPVCModal(props),
  );