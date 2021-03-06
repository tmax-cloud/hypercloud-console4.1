import * as _ from 'lodash-es';
import { Map as ImmutableMap } from 'immutable';

import { types } from './ui-actions';
import { ALL_NAMESPACES_KEY, LAST_NAMESPACE_NAME_LOCAL_STORAGE_KEY } from '../const';
import { legalNamePattern, getNamespace } from '../components/utils/link';

export default (state, action) => {
  if (!state) {
    const { pathname } = window.location;

    let activeNamespace = getNamespace(pathname);
    if (!activeNamespace) {
      activeNamespace = localStorage.getItem(LAST_NAMESPACE_NAME_LOCAL_STORAGE_KEY);
    }

    return ImmutableMap({
      activeNavSectionId: 'workloads',
      location: pathname,
      activeNamespace: activeNamespace || 'default',
      createProjectMessage: '',
    });
  }

  switch (action.type) {
    case types.setActiveNamespace:
      if (!action.value) {
        // eslint-disable-next-line no-console
        console.warn('setActiveNamespace: Not setting to falsy!');
        return state;
      }
      return state.set('activeNamespace', action.value);

    case types.setCurrentLocation: {
      state = state.set('location', action.location);
      const ns = getNamespace(action.location);
      if (_.isUndefined(ns)) {
        return state;
      }
      return state.set('activeNamespace', ns);
    }
    case types.startImpersonate:
      return state.set('impersonate', { kind: action.kind, name: action.name, subprotocols: action.subprotocols });

    case types.stopImpersonate:
      return state.delete('impersonate');

    case types.sortList:
      return state.mergeIn(['listSorts', action.listId], _.pick(action, ['field', 'func', 'orderBy']));

    case types.setCreateProjectMessage:
      return state.set('createProjectMessage', action.message);

    default:
      break;
  }
  return state;
};

export const createProjectMessageStateToProps = ({ UI }) => {
  return { createProjectMessage: UI.get('createProjectMessage') };
};

export const impersonateStateToProps = ({ UI }) => {
  return { impersonate: UI.get('impersonate') };
};
