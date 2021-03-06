import * as _ from 'lodash-es';
import * as classNames from 'classnames';
import * as React from 'react';

export const FirstSection = ({ label, children, isRequired }) => (
  <div className={'row form-group ' + (isRequired ? 'required' : '')}>
    <label className="col-xs-2 control-label" htmlFor="secret-type">
      {label}
    </label>
    <div className="col-xs-10">{children}</div>
  </div>
);

export const SecondSection = ({ label, children, id, isRequired, isModal = false }) => (
  <div className={'row form-group ' + (isRequired ? 'required' : '')}>
    {!isModal && <div className="col-xs-2"></div>}
    <div className={classNames(isModal ? 'col-xs-12' : 'col-xs-10')} id={id}>
      {label && (
        <label className="control-label" htmlFor="secret-type">
          {label}
        </label>
      )}
      <div>{children}</div>
    </div>
  </div>
);

export const SecondSection2 = ({ label, children, id, isRequired }) => (
  <div className={'row form-group ' + (isRequired ? 'required' : '')}>
    <div id={id}>
      {label && (
        <label className="control-label" htmlFor="secret-type">
          {label}
        </label>
      )}
      <div>{children}</div>
    </div>
  </div>
);
