import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartPanel = ({ categoryData }) => {
  const hasData = Object.keys(categoryData).length > 0;

  const chartData = {
    labels: hasData ? Object.keys(categoryData) : ['No data'],
    datasets: [
      {
        label: 'Expenses by Category',
        data: hasData ? Object.values(categoryData) : [1],
        backgroundColor: hasData
          ? [
              '#f54291', '#4287f5', '#f5a742',
              '#42f54b', '#aa42f5', '#f54242',
              '#42f5e6', '#e6f542', '#7a42f5',
            ]
          : ['#e0e0e0'], // Gray for no data
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: hasData,
        position: 'right',
      },
      tooltip: {
        enabled: hasData,
      },
    },
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Spending by Category</h5>
        <div>
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ChartPanel;
