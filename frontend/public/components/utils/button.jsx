import React from 'react';
import './_button.scss';

export function Button({ children, ...props }) {
  return (
    <label type="
    button" className="button-icon" {...props} >
      {children}
    </label>
  );
}
