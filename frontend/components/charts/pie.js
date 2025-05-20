import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const Chart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        bottom: 10,
        left: 'center',
        data: ['Accepted', 'Rejected', 'Pending'],
		textStyle: {
			fontSize: 15 // Increase the font size for legend
		  }
      },
      toolbox: {
        top: 40,
        right: 30,
        feature: {
          saveAsImage: {}
        }
      },
      series: [
        {
          type: 'pie',
          radius: '65%', // Modified radius value
          center: ['50%', '50%'],
          selectedMode: 'single',
          data: [
            {
              label: {
                rich: {
                  title: {
                    color: '#eee',
                    align: 'center'
                  },
                  abg: {
                    backgroundColor: '#333',
                    width: '100%',
                    align: 'right',
                    height: 25,
                    borderRadius: [4, 4, 0, 0]
                  },
                  hr: {
                    borderColor: '#777',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  value: {
                    width: 20,
                    padding: [0, 20, 0, 30],
                    align: 'left'
                  },
                  rate: {
                    width: 40,
                    align: 'right',
                    padding: [0, 10, 0, 0]
                  }
                }
              }
            },
            // itemStyle: { color: 'red' } 
            { value: 150, name: 'Accepted', },
            { value: 87, name: 'Pending' ,},
            { value: 100, name: 'Rejected', }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
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

  return <div ref={chartRef} style={{ width: '90%', height: '38vh'}} />;
};

export default Chart;