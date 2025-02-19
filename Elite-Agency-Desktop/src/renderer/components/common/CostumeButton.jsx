import React from 'react';
import '../../styles/costumButton.css';
import Loader from './Loader';
function CostumeButton({ title, onPress, containerStyle, isLoading }) {
  return (
    <button
      onClick={
        isLoading
          ? (e) => {
              e.preventDefault();
            }
          : onPress
      }
      className="costumButton"
      style={containerStyle}
    >
      {isLoading ? <Loader loading={isLoading} style={{ width: 20 }} /> : title}
    </button>
  );
}

export default CostumeButton;
