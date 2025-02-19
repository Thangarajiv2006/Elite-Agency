import React, { useEffect, useRef, useState } from 'react';
import { FaPlus, FaUserCheck } from 'react-icons/fa';
import CircleButton from '../../components/common/CircleButton';
import ToastNotification from '../../components/common/ToastNotification';
import CategoryInputs from '../../components/Products/CategoryInputs';
import { FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory, getAllCategory } from '../../actions/category.action';
import ProductLayout from '../../components/Layout/productLayout';

function Category({ search }) {
  const categoryData = useSelector((state) => state.category);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dispatch = useDispatch();
  const [toastErrorHandle, setToastErrorHandle] = useState({
    isActive: false,
    mainText: '',
    subText: '',
    Icon: '',
    borderColor: '',
  });

  //addCategory Releted code space

  const [showAddCategoryContainer, setShowAddCategoryContainer] =
    useState(false);
  const categoryLength = useRef(categoryData.categories.length);
  const [formData, setFormData] = useState({
    photo: null,
    name: '',
  });

  const onClose = () => {
    setFormData({
      photo: null,
      name: '',
    });
    setShowAddCategoryContainer(false);
  };

  const handleSubmitAddCategory = async () => {
    if (formData.photo && formData.name) {
      await dispatch(createCategory(formData)).then(() => {
        console.log(categoryData.categories.length);
        console.log(categoryLength.current);
        if (categoryLength.current !== categoryData.categories.length) {
          categoryLength.current += 1;
          setToastErrorHandle({
            isActive: true,
            mainText: 'Success',
            subText: 'Category Added Successfully',
            Icon: <FaUserCheck />,
            borderColor: 'rgb(71, 182, 245)',
          });
          onClose();
        }
      });
    } else {
      setToastErrorHandle({
        isActive: true,
        mainText: 'Error',
        subText: 'Enter All the Inputs',
        Icon: <FaXmark />,
        borderColor: '#cf6679',
      });
    }
  };

  useEffect(() => {
    console.log(categoryData);
    if (!categoryData.isLoading) {
      if (categoryData.categories.length === 0) {
        dispatch(getAllCategory());
        return;
      }

      if (categoryData.errorCode && categoryData.errorMessage) {
        setToastErrorHandle({
          isActive: true,
          mainText: 'Error',
          subText: categoryData.errorMessage,
          Icon: <FaXmark />,
          borderColor: '#cf6679',
        });
      }
      if (categoryData.categories.length)
        setSelectedCategory(categoryData.categories[0]._id);
      categoryLength.current = categoryData.categories.length;
    }
  }, [categoryData]);

  return (
    <div style={{ position: 'relative' }}>
      <div className="header">
        <h1>Products</h1>
      </div>
      <div style={{ height: 'calc(100vh - 90px)' }}>
        {categoryData.categories.length ? (
          <ProductLayout
            selected={selectedCategory}
            setSelected={setSelectedCategory}
          />
        ) : (
          <div>Nodata</div>
        )}

        <CircleButton
          icon={<FaPlus />}
          handlePress={() => setShowAddCategoryContainer(true)}
        />
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
        {showAddCategoryContainer && (
          <CategoryInputs
            isOpen={showAddCategoryContainer}
            title={'Add Category'}
            formData={formData}
            setFormData={setFormData}
            handleClose={onClose}
            handleSubmit={handleSubmitAddCategory}
            isLoading={categoryData.isLoading}
          />
        )}
      </div>
    </div>
  );
}

export default Category;
