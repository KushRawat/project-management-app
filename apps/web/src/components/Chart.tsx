import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type Props = {
  data: number[];
  labels: string[];
};

const Chart: React.FC<Props> = ({ data, labels }) => {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: 'Tasks Completed',
            data,
            fill: false,
            tension: 0.4,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: { legend: { display: false } },
      }}
    />
  );
};

export default Chart;
