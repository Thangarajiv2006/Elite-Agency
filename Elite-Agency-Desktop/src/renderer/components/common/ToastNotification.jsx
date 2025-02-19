import React from 'react';
import '../../styles/toastNotification.css';
import { FaXmark } from 'react-icons/fa6';

function ToastNotification({
  isActive,
  mainText,
  subText,
  Icon,
  IconColor,
  borderColor,
  onClose,
}) {
  let timer1;

  timer1 = setTimeout(() => {
    if (isActive) {
      onClose();
    }
  }, 5000); //1s = 1000 milliseconds

  return (
    <div
      className={`toast ${isActive ? 'active' : ''}`}
      style={{ borderColor: borderColor }}
    >
      <div className="toast-content">
        <div
          className="check"
          style={{ background: borderColor, color: IconColor }}
        >
          {Icon}
        </div>
        <div className="message">
          <span className="text text-1" style={{ margin: 0 }}>
            {mainText}
          </span>
          <span className="text text-2" style={{ margin: 0 }}>
            {subText}
          </span>
        </div>
      </div>
      <FaXmark
        className="close"
        onClick={() => {
          onClose();
          clearTimeout(timer1);
        }}
      />
      <div
        className={`progress ${isActive ? 'active' : ''}`}
        id="progress"
      ></div>
      <style>{`
      #progress::before {
        content: '';
        background-color: ${borderColor};
      }
    `}</style>
    </div>
  );
}

export default ToastNotification;
