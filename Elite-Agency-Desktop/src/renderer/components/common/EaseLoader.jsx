import React from 'react';
import '../../styles/easeLoader.css';

function EaseLoader({ loading, style }) {
  if (!loading) {
    return;
  }
  return <div style={{ ...style }} className="easeLoader"></div>;
}

export default EaseLoader;
