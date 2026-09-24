import React from 'react';
import './Bento.css';

export const BentoGrid = ({ children, className = '', dense = false }) => {
  return (
    <div className={`bento-grid ${dense ? 'bento-grid--dense' : ''} ${className}`}>
      {children}
    </div>
  );
};
