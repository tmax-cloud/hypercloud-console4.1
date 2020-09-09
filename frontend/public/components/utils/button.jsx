import React from 'react';
import './_button.scss';

export function Button({ children, noMarginTop, ...props }) {
  return (
    <label type="
    button" className="button-icon" {...props} style={noMarginTop && { marginTop: '0px' }} >
      {children}
    </label>
  );
}
