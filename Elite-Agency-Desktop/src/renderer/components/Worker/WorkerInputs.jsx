import React, { useEffect, useState } from 'react';
import TextInput from '../common/TextInput';
import '../../styles/WorkerInputs.css';
import DocumentPicker from '../common/DocumentPicker';
import CostumeButton from '../common/CostumeButton';
import { useSelector } from 'react-redux';

function WorkerInputs({
  formData,
  setFormData,
  isOpen,
  handleClose,
  title,
  handleSubmit,
}) {
  const workerData = useSelector((state) => state.worker);
  return (
    <div
      className="workerInputContainer"
      style={{ display: isOpen ? 'block' : 'none' }}
    >
      <div className="containerHeader">{title}</div>
      <form className="worker-form">
        <DocumentPicker
          id={'workerPhoto'}
          isMultiple={false}
          title={'Select From Gallery'}
          accept="image/*"
          isRequired={true}
          data={formData.photo}
          handleData={(e) =>
            setFormData({ ...formData, photo: e.target.files })
          }
        />
        <TextInput
          title={'Name'}
          keyBoardType={'text'}
          value={formData.name}
          handleChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          isRequired={true}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextInput
            title={'Email'}
            isRequired={true}
            containerStyle={{ width: '48%' }}
            value={formData.email}
            handleChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextInput
            title={'Mobile'}
            keyBoardType={'number'}
            isRequired={true}
            containerStyle={{ width: '48%' }}
            value={formData.mobile}
            handleChange={(e) =>
              setFormData({ ...formData, mobile: e.target.value })
            }
          />
        </div>
        <TextInput
          title={'Password'}
          keyBoardType={'password'}
          isRequired={true}
          value={formData.password}
          handleChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <CostumeButton
            containerStyle={{ width: '48%', background: '#cf6679' }}
            title={'Cancel'}
            onPress={handleClose}
          />
          <CostumeButton
            containerStyle={{ width: '48%', height: 40 }}
            title={'Submit'}
            onPress={handleSubmit}
            isLoading={workerData.isLoading}
          />
        </div>
      </form>
    </div>
  );
}

export default WorkerInputs;
