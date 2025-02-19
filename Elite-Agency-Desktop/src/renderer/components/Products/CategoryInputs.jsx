import React from 'react';
import CostumeButton from '../common/CostumeButton';
import '../../styles/CategoryInputs.css';
import DocumentPicker from '../common/DocumentPicker';
import TextInput from '../common/TextInput';
function CategoryInputs({
  formData,
  setFormData,
  isOpen,
  handleClose,
  title,
  handleSubmit,
  isLoading,
}) {
  return (
    <div
      className="categoryInputContainer"
      style={{ display: isOpen ? 'block' : 'none' }}
    >
      <div className="containerHeader">{title}</div>
      <form action="">
        <DocumentPicker
          id={'categoryPhoto'}
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
          value={formData.name}
          handleChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          isRequired={true}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row-reverse',
          }}
        >
          <CostumeButton
            containerStyle={{ width: '48%', height: 40 }}
            title={'Submit'}
            isLoading={isLoading}
            onPress={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          />
          <CostumeButton
            containerStyle={{ width: '48%', background: '#cf6679' }}
            title={'Cancel'}
            onPress={handleClose}
          />
        </div>
      </form>
    </div>
  );
}

export default CategoryInputs;
