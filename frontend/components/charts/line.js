import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const LineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Accepted', 'Pending', 'Rejected']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: ['ReactJs', 'NextJs', 'AngularJs', 'NodeJs', 'NestJs']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Accepted',
          type: 'line',
          // stack: 'Total',
          data: [50, 57, 30, 20, 60],
          lineStyle: {
            color: '#91cc75'
          },
          itemStyle: { // Set the color of the line and dots to be the same
            color: 'green'
          }
        },
        {
          name: 'Pending',
          type: 'line',
          // stack: 'Total',
          data: [32, 28, 40,10, 40],
          lineStyle: {
            color: '#fac858'
          },
          itemStyle: { // Set the color of the line and dots to be the same
            color: '#fab858'
          }
        },
        {
          name: 'Rejected',
          type: 'line',
          // stack: 'Total',
          data: [10, 20, 8, 34, 15],
          lineStyle: {
            color: '#ee6666'
          },
          itemStyle: { // Set the color of the line and dots to be the same
            color: 'red'
          }
        }
      ]
    };

    chart.setOption(option);

    // Clean up the chart instance when the component is unmounted
    return () => {
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '94%', height: '350px', marginTop: '50px', marginLeft: '27px' }} />;
};

export default LineChart;