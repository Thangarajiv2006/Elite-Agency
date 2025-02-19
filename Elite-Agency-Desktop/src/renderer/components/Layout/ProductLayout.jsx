import React from 'react';
import '../../styles/productLayout.css';
import CategoryContainer from '../Category/CategoryContainer';
import Analytics from '../Category/Analytics';
import TopRatedProducts from '../Category/TopRatedProducts';
import DailyProfit from '../Category/DailyProfit';
import EmptyProducts from './EmptyProducts';

const ProductLayout = ({ selected, setSelected }) => {
  return (
    <div className="productLayout">
      <div className="categoryContainer">
        <CategoryContainer selected={selected} setSelected={setSelected} />
      </div>
      <div className="anlyticsContainer">
        <Analytics />
      </div>
      <div className="topListedContainer">
        <TopRatedProducts selectedCategory={selected} />
      </div>
      <div className="dailyProfitContainer">
        <DailyProfit />
      </div>
      <div className="emptyProductContainer">
        <EmptyProducts />
      </div>
    </div>
  );
};

export default ProductLayout;
