import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const Bar = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const posList = [
      'left',
      'right',
      'top',
      'bottom',
      'inside',
      'insideTop',
      'insideLeft',
      'insideRight',
      'insideBottom',
      'insideTopLeft',
      'insideTopRight',
      'insideBottomLeft',
      'insideBottomRight'
    ];

    const configParameters = {
      rotate: {
        min: -90,
        max: 90
      },
      align: {
        options: {
          left: 'left',
          center: 'center',
          right: 'right'
        }
      },
      verticalAlign: {
        options: {
          top: 'top',
          middle: 'middle',
          bottom: 'bottom'
        }
      },
      position: {
        options: posList.reduce(function (map, pos) {
          map[pos] = pos;
          return map;
        }, {})
      },
      distance: {
        min: 0,
        max: 100
      }
    };

    const config = {
      rotate: 90,
      align: 'left',
      verticalAlign: 'middle',
      position: 'insideBottom',
      distance: 15,
      onChange: function () {
        const labelOption = {
          rotate: config.rotate,
          align: config.align,
          verticalAlign: config.verticalAlign,
          position: config.position,
          distance: config.distance
        };
        chart.setOption({
          series: [
            {
              label: labelOption
            },
            {
              label: labelOption
            }
          ]
        });
      }
    };

    const labelOption = {
      show: true,
      position: config.position,
      distance: config.distance,
      align: config.align,
      verticalAlign: config.verticalAlign,
      rotate: config.rotate,
      formatter: '{c}  {name|{a}}',
      fontSize: 16,
      rich: {
        name: {}
      }
    };

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Accepted', 'Rejected', 'Pending'],
        bottom: 10,
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: ['2012', '2013', '2014', '2015', '2016']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Accepted',
          type: 'bar',
          barGap: 0,
          itemStyle: {
            color: '#91cc75' // Bar color '#91cc75'
          },
          data: [320, 332, 301, 334, 390]
        },
        {
          name: 'Pending',
          type: 'bar',
          itemStyle: {
            color: '#fac858' // Bar color '#91cc75'
          },
          data: [150, 232, 201, 154, 190]
        },
        {
          name: 'Rejected',
          type: 'bar',
          itemStyle: {
            color: '#ee6666'// Bar color '#91cc75'
          },
          data: [98, 77, 101, 99, 40]
        }
      ]
    };

    chart.setOption(option);

    // Clean up the chart instance when the component is unmounted
    return () => {
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '90%', height: '38vh' }} />;
};

export default Bar;
