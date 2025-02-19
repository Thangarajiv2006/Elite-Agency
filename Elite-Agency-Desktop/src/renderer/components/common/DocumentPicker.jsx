import React, { useEffect, useState } from 'react';
import '../../styles/documentPicker.css';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { TbReplace } from 'react-icons/tb';

function DocumentPicker({
  id,
  isMultiple,
  title,
  accept,
  isRequired,
  data,
  handleData,
  subTitle,
  containerStyle,
  titleStyle,
  subTitleStyle,
}) {
  return (
    <div
      className="documentPicker"
      style={{ position: 'relative', ...containerStyle }}
    >
      <input
        type="file"
        id={id}
        multiple={isMultiple}
        accept={accept}
        required={isRequired}
        onChange={handleData}
        style={{ display: 'none' }}
      />
      {data?.length ? (
        <div className="imageSlider label">
          {Array.from(data).map((file, i) => {
            const reader = new FileReader();

            const [uri, setUri] = useState('');

            reader.onload = (e) => {
              setUri(e.target.result);
            };
            reader.readAsDataURL(file);
            return (
              <div>
                <label htmlFor={id} className="replace">
                  <TbReplace />
                </label>
                <img src={uri} key={i} style={{ height: 150 }} width={'auto'} />
              </div>
            );
          })}
        </div>
      ) : (
        <label htmlFor={id} className="label">
          <FaCloudUploadAlt className="upload" />
          <span className="title" style={titleStyle}>
            {title}
          </span>
          <span className="subTitle" style={subTitleStyle}>
            {subTitle}
          </span>
        </label>
      )}
    </div>
  );
}

export default DocumentPicker;
