import React, { useState } from 'react';
import TextInput from '../common/TextInput';
import CostumeButton from '../common/CostumeButton';

const AddShopForm = ({
  isOpen,
  handleClose,
  shopDetails,
  setShopDetails,
  handleSubmit,
}) => {
  return (
    <div
      style={{
        display: isOpen ? 'block' : 'none',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="Signupform">
        <div className="header">Add Shops</div>
        <div style={{ padding: 10 }}>
          <TextInput
            title={'Shop Name *'}
            value={shopDetails.ShopName}
            handleChange={(e) =>
              setShopDetails({
                ...shopDetails,
                ShopName: e.target.value,
              })
            }
            keyBoardType="text"
            isRequired={true}
          />
          <div
            style={{
              display: 'flex',
              marginTop: 10,
            }}
          >
            <div style={{ width: '50%', overflow: 'auto', paddingRight: 10 }}>
              <div>Persnal Info:</div>
              <TextInput
                title={'Name *'}
                value={shopDetails.name}
                handleChange={(e) =>
                  setShopDetails({
                    ...shopDetails,
                    name: e.target.value,
                  })
                }
                keyBoardType="text"
                isRequired={true}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextInput
                  title={'Mobile No *'}
                  containerStyle={{ width: '48%' }}
                  value={shopDetails.mobile}
                  handleChange={(e) =>
                    setShopDetails({
                      ...shopDetails,
                      mobile: e.target.value,
                    })
                  }
                  keyBoardType="number"
                  isRequired={true}
                />
                <TextInput
                  title={'E-Mail'}
                  containerStyle={{ width: '48%' }}
                  value={shopDetails.email}
                  handleChange={(e) =>
                    setShopDetails({
                      ...shopDetails,
                      email: e.target.value,
                    })
                  }
                  keyBoardType="text"
                  isRequired={true}
                />
              </div>
              <TextInput
                title={'PAN No'}
                value={shopDetails.PAN}
                handleChange={(e) =>
                  setShopDetails({
                    ...shopDetails,
                    PAN: e.target.value.toUpperCase(),
                  })
                }
                keyBoardType="text"
                isRequired={true}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextInput
                  title={'FSSAI No'}
                  containerStyle={{ width: '48%' }}
                  value={shopDetails.FSSAI}
                  handleChange={(e) =>
                    setShopDetails({
                      ...shopDetails,
                      FSSAI: e.target.value,
                    })
                  }
                  keyBoardType="text"
                  isRequired={true}
                />
                <TextInput
                  title={'GST No'}
                  containerStyle={{ width: '48%' }}
                  value={shopDetails.GSTIN}
                  handleChange={(e) =>
                    setShopDetails({
                      ...shopDetails,
                      GSTIN: e.target.value.toUpperCase(),
                    })
                  }
                  keyBoardType="text"
                  isRequired={true}
                />
              </div>
            </div>
            <div
              style={{
                width: '50%',
                overflow: 'auto',
              }}
              className="divderLine"
            >
              <div>Address:</div>
              <TextInput
                title={'Landmark *'}
                value={shopDetails.landmark}
                handleChange={(e) =>
                  setShopDetails({
                    ...shopDetails,
                    landmark: e.target.value,
                  })
                }
                keyBoardType="text"
                isRequired={true}
              />
              <TextInput
                title={'Village *'}
                value={shopDetails.village}
                handleChange={(e) =>
                  setShopDetails({
                    ...shopDetails,
                    village: e.target.value,
                  })
                }
                keyBoardType="text"
                isRequired={true}
              />
              <TextInput
                title={'District *'}
                value={shopDetails.district}
                handleChange={(e) =>
                  setShopDetails({
                    ...shopDetails,
                    district: e.target.value,
                  })
                }
                keyBoardType="text"
                isRequired={true}
              />
              <TextInput
                title={'State *'}
                value={shopDetails.state}
                handleChange={(e) =>
                  setShopDetails({
                    ...shopDetails,
                    state: e.target.value,
                  })
                }
                keyBoardType="text"
                isRequired={true}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <TextInput
                  title={'State Code *'}
                  containerStyle={{ width: '48%' }}
                  value={shopDetails.stateCode}
                  handleChange={(e) =>
                    setShopDetails({
                      ...shopDetails,
                      stateCode: e.target.value,
                    })
                  }
                  keyBoardType="number"
                  isRequired={true}
                />
                <TextInput
                  title={'Pincode *'}
                  containerStyle={{ width: '48%' }}
                  value={shopDetails.pincode}
                  handleChange={(e) =>
                    setShopDetails({
                      ...shopDetails,
                      pincode: e.target.value,
                    })
                  }
                  keyBoardType="number"
                  isRequired={true}
                />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <CostumeButton
              title={'Close'}
              containerStyle={{
                marginBottom: 10,
                marginTop: 20,
                color: '#000',
                background: '#cf6679',
                width: '25%',
              }}
              onPress={handleClose}
            />
            <CostumeButton
              title={'Submit'}
              containerStyle={{
                marginBottom: 10,
                marginTop: 20,
                color: '#000',
                width: '73%',
              }}
              onPress={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddShopForm;
