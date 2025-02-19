import React, { useState } from 'react';
import '../../styles/workerCard.css';
import { API } from '../../urlConfig';
import { FaBurger, FaCircleDot, FaPencil } from 'react-icons/fa6';
import { FaShare } from 'react-icons/fa';
import { MdBlock, MdMenu } from 'react-icons/md';
import CostumeButton from '../common/CostumeButton';
import { useDispatch, useSelector } from 'react-redux';
import { deactiveWorker } from '../../actions/worker.action';
import { CgUnblock } from 'react-icons/cg';

function Card({ data, index }) {
  const dispatch = useDispatch();

  const workersData = useSelector((state) => state.worker);

  const handleDeactive = (workerId, isWorked) => {
    if (workerId) {
      dispatch(deactiveWorker({ workerId, isWorked: isWorked ? true : false }));
    }
  };

  const handleEdit = () => {};

  return (
    <div
      className="workerCard"
      style={{
        animationDelay: `${(index < 10 ? index : Math.floor(index % 10)) * 0.2}s`,
      }}
    >
      <div className="menuIcon">
        <MdMenu />
        <div className="additionalOption">
          <div className="options">
            <div
              className="option"
              onClick={() => handleDeactive(data._id, data.isWorked)}
            >
              {data.isWorked ? (
                <>
                  <MdBlock />
                  <div>Deactive</div>
                </>
              ) : (
                <>
                  <CgUnblock />
                  <div>Active</div>
                </>
              )}
            </div>
            <div className="option" onClick={() => handleEdit()}>
              <FaPencil />
              <div>Edit</div>
            </div>
            <div className="option">
              <FaShare />
              <div>More</div>
            </div>
          </div>
        </div>
      </div>
      <div className="info">
        <div className="profilePic">
          <img src={API.public + data.photo} alt="" width={50} />
          {data.isWorked ? <div className="active"></div> : <></>}
        </div>
        <div className="majorInfo">
          <div className="name">{data.name}</div>
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: 12, color: '#e2e2e2' }}>Email: </div>
              <div
                style={{
                  marginLeft: 10,
                  fontSize: 12,
                  color: '#e2e2e2',
                  opacity: 0.7,
                }}
              >
                {data.email}
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: 12, color: '#e2e2e2' }}>Mobile: </div>
              <div
                style={{
                  marginLeft: 10,
                  fontSize: 12,
                  color: '#e2e2e2',
                  opacity: 0.6,
                }}
              >
                {data.mobile}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <CostumeButton
            title={'More'}
            containerStyle={{ width: '80%', height: 30, fontSize: 13 }}
          />
        </div>
      </div>
    </div>
  );
}

export default Card;
