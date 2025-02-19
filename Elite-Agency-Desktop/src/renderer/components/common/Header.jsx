import React from 'react';
import '../../styles/header.css';
import { FaMinus } from 'react-icons/fa';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';

function Header() {
  return (
    <div className="custom-title-bar">
      <div className="window-title">Elite Agency</div>
      <div className="window-controls">
        <button
          id="minimize-btn"
          onClick={() => {
            window.electron.ipcRenderer.sendMessage('minimize-window');
          }}
        >
          <FaMinus />
        </button>
        <button
          id="maximize-btn"
          onClick={() => {
            window.electron.ipcRenderer.sendMessage('maximize-window');
          }}
        >
          <MdCheckBoxOutlineBlank />
        </button>
        <button
          id="close-btn"
          onClick={() =>
            window.electron.ipcRenderer.sendMessage('close-window')
          }
        >
          <IoMdClose />
        </button>
      </div>
    </div>
  );
}

export default Header;
