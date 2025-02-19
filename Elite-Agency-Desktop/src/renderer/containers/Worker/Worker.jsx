import React, { useEffect, useRef, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { FaUserCheck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/common/Loader';
import NavBar from '../../components/common/NavBar';
import TextInput from '../../components/common/TextInput';
import ToastNotification from '../../components/common/ToastNotification';
import CircleButton from '../../components/common/CircleButton';
import WorkerInputs from '../../components/Worker/WorkerInputs';
import Header from '../../components/common/Header';
import { addWorker, getWorker } from '../../actions/worker.action';
import EaseLoader from '../../components/common/EaseLoader';
import Card from '../../components/Worker/Card';
import '../../styles/worker.css';

function Worker({ search }) {
  const dispatch = useDispatch();

  const workerData = useSelector((state) => state.worker);
  const [isFetching, setIsFetching] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    photo: null,
    email: '',
    mobile: '',
  });

  const [toastErrorHandle, setToastErrorHandle] = useState({
    isActive: false,
    mainText: '',
    subText: '',
    Icon: '',
    borderColor: '',
  });
  const workerLength = useRef(workerData.workers.length);

  const checkAllDataEntered = (data) => {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key];
        if (!element) {
          setToastErrorHandle({
            isActive: true,
            mainText: 'Error',
            subText: 'Enter All the Inputs',
            Icon: <FaXmark />,
            borderColor: '#cf6679',
          });
          return false;
        }
      }
    }
    return true;
  };

  function validatePhoneNumber(phoneNumber) {
    const regex = /^\d{10}$/;
    return regex.test(phoneNumber);
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  //Add Worker Functions
  const [showAddWorker, setShowAddWorker] = useState(false);
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const onClose = (e) => {
    setShowAddWorker(false);
    setFormData({
      name: '',
      password: '',
      photo: null,
      email: '',
      mobile: '',
    });
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();

    if (checkAllDataEntered(formData)) {
      if (!isValidEmail(formData.email)) {
        setToastErrorHandle({
          isActive: true,
          mainText: 'Error',
          subText: 'Enter the correct Email',
          Icon: <FaXmark />,
          borderColor: '#cf6679',
        });
      } else if (!validatePhoneNumber(formData.mobile)) {
        setToastErrorHandle({
          isActive: true,
          mainText: 'Error',
          subText: 'Enter the correct Phone number',
          Icon: <FaXmark />,
          borderColor: '#cf6679',
        });
      } else {
        await dispatch(addWorker(formData)).then(() => {
          if (workerLength.current !== workerData.workers.length) {
            setShowAddWorker(false);
            onClose();
            setToastErrorHandle({
              isActive: true,
              mainText: 'Success',
              subText: 'Worker created successfully!',
              Icon: <FaUserCheck />,
              borderColor: 'rgb(71, 182, 245)',
            });
            scrollRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        });
      }
    }
  };

  const fetchData = async () => {
    dispatch(
      getWorker({
        start: workerData.workers.length,
      }),
    );
  };

  const fetchMoreData = async () => {
    const container = containerRef.current;
    if (
      container.scrollTop + container.clientHeight >=
        container.scrollHeight * 0.9 &&
      !workerData.isLoading &&
      !workerData.isEnded &&
      !isFetching
    ) {
      console.log(container.scrollTop + container.clientHeight);
      console.log(container.scrollHeight);
      setIsFetching(true);
      await fetchData().then(() => setIsFetching(false));
    }
  };

  useEffect(() => {
    if (workerData.workers.length === 0 && !workerData.isLoading) {
      fetchData();
      return;
    }

    if (workerData.errorCode && workerData.errorMessage) {
      setToastErrorHandle({
        isActive: true,
        mainText: 'Error',
        subText: workerData.errorMessage,
        Icon: <FaXmark />,
        borderColor: '#cf6679',
      });
    }

    if (search) {
      const filteredData = workerData.workers.filter(
        (data) =>
          data.name.toLowerCase().includes(search.toLowerCase()) ||
          data.email.toLowerCase().includes(search.toLowerCase()) ||
          data.mobile.toString().toLowerCase().includes(search.toLowerCase()),
      );
      setFilterData(filteredData);
    } else {
      setFilterData(workerData.workers);
    }

    workerLength.current = workerData.workers.length;
  }, [workerData, search]);

  const [filterData, setFilterData] = useState(workerData.workers);

  useEffect(() => {}, [search]);

  return (
    <div style={{ position: 'relative' }}>
      <div className="header">
        <h1>Workers</h1>
      </div>
      <div
        style={{
          overflow: 'auto',
          width: '100%',
          height: 'calc(100vh - 90px)',
          paddingBottom: 20,
          paddingTop: 10,
        }}
        onScroll={fetchMoreData}
        ref={containerRef}
      >
        <div className="workerContainer" ref={scrollRef}>
          {workerData.isLoading && workerData.workers.length === 0 ? (
            <div
              style={{
                width: '100%',
                height: 'calc(100vh - 90px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EaseLoader loading={workerData.isLoading} />
            </div>
          ) : (
            filterData.map((worker, index) => (
              <Card key={worker._id} data={worker} index={index} />
            ))
          )}
        </div>
        {isFetching && workerData.isLoading ? (
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EaseLoader loading={isFetching} />
          </div>
        ) : (
          <></>
        )}
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
      <CircleButton
        icon={<FaPlus />}
        handlePress={() => setShowAddWorker(true)}
      />
      <WorkerInputs
        title={'Add Worker'}
        formData={formData}
        setFormData={setFormData}
        handleClose={onClose}
        isOpen={showAddWorker}
        handleSubmit={handleAddWorker}
      />
    </div>
  );
}

export default Worker;
