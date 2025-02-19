import React from 'react';
import '../../styles/circleButton.css';

function CircleButton({ icon, containerStyles, handlePress }) {
  return (
    <div
      className="circleButton"
      style={{ ...containerStyles }}
      onClick={handlePress}
    >
      {icon}
    </div>
  );
}

export default CircleButton;
