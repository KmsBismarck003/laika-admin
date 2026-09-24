import React from 'react';
import './Bento.css';

export const BentoCard = ({
  children,
  className = '',
  colSpan = 1,
  rowSpan = 1,
  hoverable = true,
  onClick,
  draggable,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  variant = 'default', // default, stat, action, metric
  ...props
}) => {
  const classes = [
    'bento-card',
    `bento-card--variant-${variant}`,
    colSpan > 1 ? `bento-card--col-${colSpan}` : '',
    rowSpan > 1 ? `bento-card--row-${rowSpan}` : '',
    hoverable ? 'bento-card--hoverable' : '',
    onClick ? 'bento-card--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      {...props}
    >
      {children}
    </div>
  );
};
