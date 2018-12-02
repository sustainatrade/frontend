import React from 'react';

export default function Iconify({ type, theme, style }) {
  return <span className="iconify" data-icon={type} style={style} />;
}
