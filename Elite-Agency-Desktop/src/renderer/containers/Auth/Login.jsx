import React, { useEffect, useState } from 'react';
import TextInput from '../../components/common/TextInput';
import '../../styles/login.css';
import { Link, useNavigate } from 'react-router-dom';
import CostumeButton from '../../components/common/CostumeButton';
import ToastNotification from '../../components/common/ToastNotification';
import { FaExclamation } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../actions/auth.action';
import { FaXmark } from 'react-icons/fa6';
import Header from '../../components/common/Header';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const agencyData = useSelector((state) => state.auth);

  useEffect(() => {
    if (agencyData.errorCode) {
      setToastErrorHandle({
        isActive: true,
        mainText: 'Error',
        subText: agencyData.errorMessage,
        Icon: <FaXmark />,
        borderColor: '#cf6679',
      });
    } else if (agencyData.token && agencyData.isLogined) {
      navigate('/', { replace: true });
    }
  }, [agencyData]);

  //errorHandle

  const [toastErrorHandle, setToastErrorHandle] = useState({
    isActive: false,
    mainText: '',
    subText: '',
    Icon: '',
    borderColor: '',
  });

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      if (!isValidEmail(email.trim())) {
        setToastErrorHandle({
          isActive: true,
          mainText: 'Error',
          subText: 'Please Enter The Valid Email',
          Icon: <FaExclamation />,
          borderColor: '#cf6679',
        });
        return;
      }
      setToastErrorHandle({
        ...toastErrorHandle,
        isActive: false,
      });
      dispatch(login({ email: email.trim(), password: password.trim() }));
    } else {
      setToastErrorHandle({
        isActive: true,
        mainText: 'Error',
        subText: "All Field's are important!",
        Icon: <FaExclamation />,
        borderColor: '#cf6679',
      });
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="formContainer">
          <div className="formHeader">Login</div>
          <form>
            <div style={{ width: '100%' }}>
              <TextInput
                title="Email"
                value={email}
                setValue={setEmail}
                keyBoardType="text"
                isRequired={true}
              />
              <TextInput
                title="Password"
                placeHolder=""
                keyBoardType="password"
                setValue={setPassword}
                isRequired={true}
              />
            </div>
            <CostumeButton
              title={'Login'}
              onPress={handleLogin}
              isLoading={agencyData.isLoading}
            />
            <p>
              Not an Member? <Link to={'/sign-up'}>Sign-Up</Link>
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

export default Login;
