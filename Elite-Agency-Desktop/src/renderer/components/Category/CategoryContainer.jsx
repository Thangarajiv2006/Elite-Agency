import React from 'react';
import { useSelector } from 'react-redux';
import { API } from '../../urlConfig';
import '../../styles/categoryRender.css';

const CategoryContainer = ({ selected, setSelected }) => {
  const categories = useSelector((state) => state.category).categories;
  console.log(setSelected);
  return (
    <div className="categoryHolder">
      {categories.map((data) => (
        <div
          key={data._id}
          className={`categoryCard ${selected === data._id && 'selectedCategory'}`}
          onClick={() => setSelected(data._id)}
        >
          <img
            src={API.public + data.pic}
            loading="lazy"
            height={70}
            width={70}
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryContainer;
