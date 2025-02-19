import React, { useEffect, useState } from 'react';
import { IoMdExpand, IoMdSettings } from 'react-icons/io';
import '../../styles/topRatedProducts.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const TopRatedProducts = ({ selectedCategory }) => {
  const categoryData = useSelector((state) => state.category).categories.find(
    (data) => selectedCategory === data._id,
  );
  console.log(categoryData);
  return (
    <div className="topRatedProductsContainer">
      <div className="categoryInfo">
        <div className="CategoryName">{categoryData?.name}</div>
        <div className="options">
          <div className="option">
            <IoMdSettings />
          </div>
          <Link to={`/category/${selectedCategory}`} className="option">
            <IoMdExpand />
          </Link>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default TopRatedProducts;
