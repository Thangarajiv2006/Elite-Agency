import React, { useState } from 'react';
import { FaLeftLong, FaRightLong } from 'react-icons/fa6';
import MyLineChart from '../common/LineChart';
import MyPieChart from '../common/PieChart';
import '../../styles/categoryAnalytic.css';

const Analytics = () => {
  const [isMoved, setIsMoved] = useState(false);
  return (
    <div className="categoryAnalytics">
      <input
        type="checkbox"
        className="chartMover"
        id="isMoved"
        value={isMoved}
        onChange={() => setIsMoved(!isMoved)}
      />
      <label
        className={`arrow ${isMoved ? 'left' : 'right'}`}
        htmlFor="isMoved"
      >
        {isMoved ? <FaLeftLong /> : <FaRightLong />}
      </label>
      <div className="charts">
        <div className="chart">
          <MyLineChart />
        </div>
        <div className="chart">
          <MyPieChart />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
