import React, { useRef, useState } from 'react';
import '../../styles/textInput.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function TextInput({
  title,
  placeHolder,
  value,
  handleChange,
  keyBoardType,
  containerStyle,
  titleStyle,
  inputStyle,
  isRequired,
  setValue,
  inputStatus,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);
  return (
    <div className="textfield" style={containerStyle}>
      <input
        ref={inputRef}
        type={showPassword ? 'text' : keyBoardType}
        placeholder={placeHolder}
        value={value}
        onChange={(e) => {
          if (setValue) {
            setValue(e.target.value);
          } else {
            handleChange(e);
          }
        }}
        style={{
          borderColor: inputStatus === -1 ? 'cf6679' : '',
          paddingRight: keyBoardType === 'password' ? 30 : 10,
          ...inputStyle,
        }}
        required={isRequired}
      />
      {keyBoardType === 'password' ? (
        <div
          onClick={() => {
            setShowPassword(!showPassword);
            inputRef.current.focus();
          }}
        >
          {showPassword ? (
            <FaEyeSlash className="eye" />
          ) : (
            <FaEye className="eye" />
          )}
        </div>
      ) : (
        <></>
      )}
      <div className="title" style={titleStyle}>
        {title}
      </div>
    </div>
  );
}

export default TextInput;
