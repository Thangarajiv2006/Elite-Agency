import React, { useEffect, useState } from 'react';
import TextInput from '../../components/common/TextInput';
import '../../styles/signup.css';
import { Link, useNavigate } from 'react-router-dom';
import CostumeButton from '../../components/common/CostumeButton';
import ToastNotification from '../../components/common/ToastNotification';
import { FaExclamation } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../actions/auth.action';
import { FaXmark } from 'react-icons/fa6';
import Header from '../../components/common/Header';
import axios from '../../helpers/axiosInstance';

function Signup() {
  const navigate = useNavigate();
  const agencyData = useSelector((state) => state.auth);

  //errorHandle

  const [toastErrorHandle, setToastErrorHandle] = useState({
    isActive: false,
    mainText: '',
    subText: '',
    Icon: '',
    borderColor: '',
  });

  useEffect(() => {
    if (agencyData.token && agencyData.isLogined) {
      navigate('/', { replace: true });
    }
  }, [agencyData]);

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  //handle Signup

  const [agencyDetails, setAgencyDetails] = useState({
    agencyName: '',
    houseNo: '',
    street: '',
    village: '',
    district: '',
    state: '',
    stateCode: '',
    pincode: '',
    name: '',
    mobile: '',
    email: '',
    FSSAI: '',
    PAN: '',
    GSTIN: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) {
      return;
    }
    for (const key in agencyDetails) {
      if (!agencyDetails[key]) {
        //Alert.alert("Error", "Please Enter All inputs ");
        setToastErrorHandle({
          isActive: true,
          mainText: 'Error',
          subText: "All Field's are important!",
          Icon: <FaExclamation />,
          borderColor: '#cf6679',
        });
        return;
      }
    }
    setLoading(true);
    const res = await axios.post('/agency/auth/sign-up', agencyDetails);

    setLoading(false);
    if (res.data.errorCode) {
      //Alert.alert(res.data.errorMessage);
      setToastErrorHandle({
        isActive: true,
        mainText: 'Error',
        subText: res.data.errorMessage,
        Icon: <FaExclamation />,
        borderColor: '#cf6679',
      });
    } else if (res.status === 201) {
      setAgencyDetails({
        agencyName: '',
        houseNo: '',
        street: '',
        village: '',
        district: '',
        state: '',
        stateCode: '',
        pincode: '',
        name: '',
        mobile: '',
        email: '',
        FSSAI: '',
        PAN: '',
        GSTIN: '',
        password: '',
      });
      navigate('/login');
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="Signupform">
          <div className="header">Signup</div>
          <form>
            <TextInput
              title={'Agency Name'}
              value={agencyDetails.agencyName}
              handleChange={(e) =>
                setAgencyDetails({
                  ...agencyDetails,
                  agencyName: e.target.value,
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
                  title={'Name'}
                  value={agencyDetails.name}
                  handleChange={(e) =>
                    setAgencyDetails({
                      ...agencyDetails,
                      name: e.target.value,
                    })
                  }
                  keyBoardType="text"
                  isRequired={true}
                />
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <TextInput
                    title={'Mobile No'}
                    containerStyle={{ width: '48%' }}
                    value={agencyDetails.mobile}
                    handleChange={(e) =>
                      setAgencyDetails({
                        ...agencyDetails,
                        mobile: e.target.value,
                      })
                    }
                    keyBoardType="number"
                    isRequired={true}
                  />
                  <TextInput
                    title={'E-Mail'}
                    containerStyle={{ width: '48%' }}
                    value={agencyDetails.email}
                    handleChange={(e) =>
                      setAgencyDetails({
                        ...agencyDetails,
                        email: e.target.value,
                      })
                    }
                    keyBoardType="text"
                    isRequired={true}
                  />
                </div>
                <TextInput
                  title={'PAN No'}
                  value={agencyDetails.PAN}
                  handleChange={(e) =>
                    setAgencyDetails({
                      ...agencyDetails,
                      PAN: e.target.value.toUpperCase(),
                    })
                  }
                  keyBoardType="text"
                  isRequired={true}
                />
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <TextInput
                    title={'FSSAI No'}
                    containerStyle={{ width: '48%' }}
                    value={agencyDetails.FSSAI}
                    handleChange={(e) =>
                      setAgencyDetails({
                        ...agencyDetails,
                        FSSAI: e.target.value,
                      })
                    }
                    keyBoardType="text"
                    isRequired={true}
                  />
                  <TextInput
                    title={'GST No'}
                    containerStyle={{ width: '48%' }}
                    value={agencyDetails.GSTIN}
                    handleChange={(e) =>
                      setAgencyDetails({
                        ...agencyDetails,
                        GSTIN: e.target.value.toUpperCase(),
                      })
                    }
                    keyBoardType="text"
                    isRequired={true}
                  />
                </div>
                <TextInput
                  title={'Password'}
                  value={agencyDetails.password}
                  handleChange={(e) =>
                    setAgencyDetails({
                      ...agencyDetails,
                      password: e.target.value,
                    })
                  }
                  keyBoardType="password"
                  isRequired={true}
                />
              </div>
              <div
                style={{
                  width: '50%',
                  overflow: 'auto',
                }}
                className="divderLine"
              >
                <div>Address:</div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <TextInput
                    title={'House No'}
                    containerStyle={{ width: '48%' }}
                    value={agencyDetails.houseNo}
                    handleChange={(e) =>
                      setAgencyDetails({
                        ...agencyDetails,
                        houseNo: e.target.value,
                      })
                    }
                    keyBoardType="text"
                    isRequired={true}
                  />
                  <TextInput
                    title={'Street'}
                    containerStyle={{ width: '48%' }}
                    value={agencyDetails.street}
                    handleChange={(e) =>
                      setAgencyDetails({
                        ...agencyDetails,
                        street: e.target.value,
                      })
                    }
                    keyBoardType="text"
                    isRequired={true}
                  />
                </div>
                <TextInput
                  title={'Village'}
                  value={agencyDetails.village}
                  handleChange={(e) =>
                    setAgencyDetails({
                      ...agencyDetails,
                      village: e.target.value,
                    })
                  }
                  keyBoardType="text"
                  isRequired={true}
                />
                <TextInput
                  title={'District'}
                  value={agencyDetails.district}
                  handleChange={(e) =>
                    setAgencyDetails({
                      ...agencyDetails,
                      district: e.target.value,
                    })
                  }
                  keyBoardType="text"
                  isRequired={true}
                />
                <TextInput
                  title={'State'}
                  value={agencyDetails.state}
                  handleChange={(e) =>
                    setAgencyDetails({
                      ...agencyDetails,
                      state: e.target.value,
                    })
                  }
                  keyBoardType="text"
                  isRequired={true}
                />
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <TextInput
                    title={'State Code'}
                    containerStyle={{ width: '48%' }}
                    value={agencyDetails.stateCode}
                    handleChange={(e) =>
                      setAgencyDetails({
                        ...agencyDetails,
                        stateCode: e.target.value,
                      })
                    }
                    keyBoardType="number"
                    isRequired={true}
                  />
                  <TextInput
                    title={'Pincode'}
                    containerStyle={{ width: '48%' }}
                    value={agencyDetails.pincode}
                    handleChange={(e) =>
                      setAgencyDetails({
                        ...agencyDetails,
                        pincode: e.target.value,
                      })
                    }
                    keyBoardType="number"
                    isRequired={true}
                  />
                </div>
              </div>
            </div>
            <CostumeButton
              title={'Signup'}
              containerStyle={{
                marginBottom: 10,
                marginTop: 20,
                color: '#000',
              }}
              onPress={handleSignup}
            />
            <p>
              Have an Account? <Link to={'/login'}>Login</Link>
            </p>
          </form>
        </div>
        <ToastNotification
          isActive={toastErrorHandle.isActive}
          mainText={toastErrorHandle.mainText}
          subText={toastErrorHandle.subText}
          Icon={toastErrorHandle.Icon}
          borderColor={toastErrorHandle.borderColor}
          IconColor={'#000'}
          onClose={() =>
            setToastErrorHandle({ ...toastErrorHandle, isActive: false })
          }
        />
      </div>
    </div>
  );
}

export default Signup;
