import React, { useEffect, useRef, useState } from 'react';
import CircleButton from '../../components/common/CircleButton';
import { FaPlus } from 'react-icons/fa';
import ToastNotification from '../../components/common/ToastNotification';
import { useDispatch, useSelector } from 'react-redux';
import AddShopForm from '../../components/Shops/AddShopsForm';
import { FaXmark } from 'react-icons/fa6';
import { createShops } from '../../actions/shop.action';

function Shops({ search }) {
  const dispatch = useDispatch();
  const shopData = useSelector((state) => state.shops);
  const [toastErrorHandle, setToastErrorHandle] = useState({
    isActive: false,
    mainText: '',
    subText: '',
    Icon: '',
    borderColor: '',
  });

  //ADD SHOPS
  const shopLength = useRef(shopData.shops.length);
  const [showAddShopsForm, setShowAddShopsForm] = useState(false);
  const [shopDetails, setShopDetails] = useState({
    ShopName: '',
    landmark: '',
    village: '',
    district: '',
    state: 'Tamilnadu',
    stateCode: '33',
    pincode: '',
    name: '',
    mobile: '',
    email: '',
    FSSAI: '',
    PAN: '',
    GSTIN: '',
  });
  const handleCreateShop = async () => {
    if (
      shopDetails.ShopName.trim() &&
      shopDetails.name.trim() &&
      shopDetails.landmark.trim() &&
      shopDetails.village.trim() &&
      shopDetails.state.trim() &&
      shopDetails.district.trim() &&
      shopDetails.stateCode.trim() &&
      shopDetails.pincode.trim() &&
      shopDetails.mobile
    ) {
      const formData = {
        shopName: shopDetails.ShopName.trim(),
        landmark: shopDetails.landmark.trim(),
        village: shopDetails.village.trim(),
        district: shopDetails.district.trim(),
        state: shopDetails.state.trim(),
        stateCode: shopDetails.stateCode.trim(),
        pincode: shopDetails.pincode.trim(),
        name: shopDetails.name.trim(),
        mobile: shopDetails.mobile.trim(),
        email: shopDetails.email.trim(),
        FSSAI: shopDetails.FSSAI.trim(),
        PAN: shopDetails.PAN.trim(),
        GSTIN: shopDetails.GSTIN.trim(),
      };
      await dispatch(createShops(formData)).then(() => {
        if (shopLength.current + 1 === shopData.shops.length) {
          handleClose();
          shopLength.current = shopLength.current + 1;
          setToastErrorHandle({
            isActive: true,
            mainText: 'Success',
            subText: 'Worker created successfully!',
            Icon: <FaUserCheck />,
            borderColor: 'rgb(71, 182, 245)',
          });
        }
      });
    } else {
      setToastErrorHandle({
        isActive: true,
        mainText: 'Error',
        subText: 'Please fill the reqired Fields',
        Icon: <FaXmark />,
        borderColor: '#cf6679',
      });
    }
  };
  const handleClose = () => {
    setShowAddShopsForm(false);
    setShopDetails({
      ShopName: '',
      landmark: '',
      village: '',
      district: '',
      state: 'Tamilnadu',
      stateCode: '33',
      pincode: '',
      name: '',
      mobile: '',
      email: '',
      FSSAI: '',
      PAN: '',
      GSTIN: '',
    });
  };

  useEffect(() => {}, []);

  return (
    <div>
      <div className="header">
        <h1>Shops</h1>
      </div>
      <div></div>
      <CircleButton
        icon={<FaPlus />}
        handlePress={() => setShowAddShopsForm(true)}
      />
      <ToastNotification
        mainText={toastErrorHandle.mainText}
        isActive={toastErrorHandle.isActive}
        subText={toastErrorHandle.subText}
        Icon={toastErrorHandle.Icon}
        borderColor={toastErrorHandle.borderColor}
        IconColor={'#000'}
        onClose={() =>
          setToastErrorHandle({ ...toastErrorHandle, isActive: false })
        }
      />
      <AddShopForm
        isOpen={showAddShopsForm}
        handleClose={() => setShowAddShopsForm(false)}
        shopDetails={shopDetails}
        setShopDetails={setShopDetails}
        handleSubmit={handleCreateShop}
      />
    </div>
  );
}

export default Shops;
