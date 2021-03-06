import * as _ from 'lodash-es';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as Modal from 'react-modal';
import * as PropTypes from 'prop-types';
import { Router } from 'react-router-dom';

import * as classNames from 'classnames';
import store from '../../redux';
import { ButtonBar } from '../utils/button-bar';
import { history } from '../utils/router';
import { useTranslation } from 'react-i18next';

export const createModalLauncher = Component => (props = {}) => {
  const modalContainer = document.getElementById('modal-container');
  const result = new Promise(resolve => {
    const closeModal = e => {
      // Disable closing the modal with the escape key for "blocking" modals
      if (props.blocking && _.get(e, 'type') === 'keydown') {
        return;
      }
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      ReactDOM.unmountComponentAtNode(modalContainer);
      resolve();
    };
    Modal.setAppElement(modalContainer);
    ReactDOM.render(
      <Provider store={store}>
        <Router history={history} basename={window.SERVER_FLAGS.basePath}>
          <Modal isOpen={true} contentLabel="Modal" onRequestClose={closeModal} className="modal-dialog modal-content" overlayClassName="co-overlay" shouldCloseOnOverlayClick={false /*!props.blocking*/}>
            <Component {...props} cancel={closeModal} close={closeModal} />
          </Modal>
        </Router>
      </Provider>,
      modalContainer,
    );
  });
  return { result };
};

export const ModalTitle = ({ children, className = 'modal-header' }) => (
  <div className={className}>
    <h4 className="modal-title">{children}</h4>
  </div>
);

export const ModalBody = ({ needScroll = false, children }) => <div className={classNames(needScroll ? 'modal-body scroll' : 'modal-body')}>{children}</div>;

export const ModalFooter = ({ message, errorMessage, inProgress, children }) => {
  return (
    <ButtonBar className="modal-footer" errorMessage={errorMessage} infoMessage={message} inProgress={inProgress}>
      {children}
    </ButtonBar>
  );
};

/** @type {React.SFC<{message?: string, errorMessage?: string, inProgress: boolean, cancel: (e: Event) => void, submitText: string, submitDisabled?: boolean}>} */
export const ModalSubmitFooter = ({ message, errorMessage, inProgress, cancel, submitText, submitDisabled }) => {
  const onCancelClick = e => {
    e.stopPropagation();
    cancel(e);
  };
  const { t } = useTranslation();
  return (
    <ModalFooter inProgress={inProgress} errorMessage={errorMessage} message={message}>
      <button type="button" onClick={onCancelClick} className="btn btn-default">
        {t('CONTENT:CANCEL')}
      </button>
      <button type="submit" className="btn btn-primary" disabled={submitDisabled} id="confirm-action">
        {submitText}
      </button>
    </ModalFooter>
  );
};

ModalSubmitFooter.propTypes = {
  cancel: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  inProgress: PropTypes.bool.isRequired,
  message: PropTypes.string,
  submitText: PropTypes.node.isRequired,
};

// export const CustomModalSubmitFooter = ({ message, inProgress, cancel, submitText, cancelText, submitDisabled }) => {
//   const onCancelClick = e => {
//     e.stopPropagation();
//     cancel(e);
//   };
//   return (
//     <ModalFooter inProgress={inProgress} message={message}>
//       <button type="submit" className="btn btn-primary" disabled={submitDisabled} id="confirm-action">
//         {submitText}
//       </button>
//       <button type="button" onClick={onCancelClick} className="btn btn-default">
//         {cancelText}
//       </button>
//     </ModalFooter>
//   );
// };

// CustomModalSubmitFooter.propTypes = {
//   cancel: PropTypes.func.isRequired,
//   // errorMessage: PropTypes.string.isRequired,
//   inProgress: PropTypes.bool.isRequired,
//   message: PropTypes.string,
//   submitText: PropTypes.node.isRequired,
//   cancelText: PropTypes.node.isRequired,
// };

/** @type {React.SFC<{message?: string, errorMessage?: string, inProgress: boolean, cancel: (e: Event) => void, submitText: string, submitDisabled?: boolean}>} */
export const CustomModalSubmitFooter = ({ message, errorMessage, inProgress, cancel, leftText, rightText, clickLeft, clickRight }) => {
  const onCancelClick = e => {
    e.stopPropagation();
    cancel(e);
  };
  // const { t } = useTranslation();
  return (
    <ModalFooter inProgress={inProgress} errorMessage={errorMessage} message={message}>
      <button type="button" className="btn btn-primary" onClick={clickLeft}>
        {leftText}
      </button>
      <button type="button" className="btn btn-default" onClick={clickRight}>
        {rightText}
      </button>
    </ModalFooter>
  );
};

CustomModalSubmitFooter.propTypes = {
  cancel: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  inProgress: PropTypes.bool.isRequired,
  message: PropTypes.string,
  leftText: PropTypes.node.isRequired,
  rightText: PropTypes.node.isRequired,
};
