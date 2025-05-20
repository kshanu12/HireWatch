import React, { useEffect, useState } from 'react';

const ScoreMeter = (props) => {
  const [value, setValue] = useState(0);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);

  useEffect(() => {
    const scored = props.title.split("/")[0];
    const maxScore = props.title.split("/")[1];
    setValue(Number(scored));
    setMax(Number(maxScore));
  }, [props.title]);

  const getSegmentColor = (score) => {
    if (score < 35) {
      return '#FF0000'; // Red
    } else if (score >= 35 && score < 76) {
      return '#FFA500'; // Orange
    } else {
      return '#37c936'; // Green
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const JustGage = require('justgage');

      const gauge = new JustGage({
        id: 'gauge',
        value,
        min,
        max,
        title: '',
        label: '',
        levelColors: [getSegmentColor(value / max * 100)],
      });

      return () => {
        gauge.destroy();
      };
    }
  }, [value, min, max]);

  return (
    <div>
      <div id="gauge" />
    </div>
  );
};

export default ScoreMeter;
