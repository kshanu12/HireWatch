import { Button, Drawer, Radio, Space, Select, Input, Tooltip } from "antd";
import { useState } from "react";
import styles from "./filter.module.css";
import Image from "next/image";
import { Slider, Switch } from "antd";

const Filter = (props) => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("right");
  const testNames = props.testNames;
  const action = props.status;

  // console.log("TEST NAMES", props.testNames);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    // console.log("---------------CLOSE------------------", open);
    setOpen(false);
  };

  const handleViolationSliderChange = (value) => {
    props.setEnteredViolations(value);
  };

  const handleScoreSliderChange = (value) => {
    props.setMinimumScore(value);
  };

  return (
    <div className={styles.filter}>
      <Space>
        <Tooltip title="Filter" placement="bottom" color="rgb(136, 153, 190)">
          <Button onClick={showDrawer} className={styles.btn}>
            <Image
              className={styles.filter_image}
              src="/image/filter.png"
              alt="HireWatch"
              width={20}
              height={20}
            />
          </Button>
        </Tooltip>
      </Space>
      <Drawer
        className={styles.filter}
        title="Filter"
        placement={placement}
        closable={false}
        onClose={onClose}
        open={open}
        key={placement}
      >
        <div className={styles["title"]}>Violations</div>
        {/* <RangeFilter></RangeFilter> */}
        <div className={styles.combined_input}>
          <Slider
            defaultValue={100}
            value={props.enteredViolations}
            onChange={handleViolationSliderChange}
            className={styles.slider}
          />
          <input
            className={styles.slider_input}
            type="text"
            value={props.enteredViolations}
            onChange={(e) => props.setEnteredViolations(Number(e.target.value))}
          />
        </div>
        {/* <Input
          placeholder="Enter maximum violation"
          value={props.enteredViolations}
          className={`${styles.experiment} ${styles.placeholderBlack}`}
          onChange={(e) => props.setEnteredViolations(Number(e.target.value))}
        /> */}
        <div className={styles["title"]} style={{ marginTop: "20px" }}>
          Minimum Score
        </div>
        <div className={styles.combined_input}>
          <Slider
            defaultValue={0}
            value={props.enterdMinimumScore}
            onChange={handleScoreSliderChange}
            className={styles.slider}
          />
          <input
            className={styles.slider_input}
            type="text"
            value={props.enterdMinimumScore}
            onChange={(e) => props.setMinimumScore(Number(e.target.value))}
          />
        </div>
        {/* <Input
          placeholder="Enter minimum score"
          value={props.enterdMinimumScore}
          className={`${styles.experiment} ${styles.placeholderBlack}`}
          onChange={(e) => props.setMinimumScore(Number(e.target.value))}
        /> */}

        <div className={styles["title"]} style={{ marginTop: "20px" }}>
          Test Name
        </div>
        {testNames && (
          <Select
            style={{ width: "330px" }}
            className={styles.experimental}
            placeholder="Select action"
            onChange={(value) => props.setSelectedTestName(Number(value))}
            options={testNames?.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        )}

        <div className={styles["title"]} style={{ marginTop: "20px" }}>
          Status
        </div>
        <Select
          style={{ width: "330px" }}
          className={styles.experimental}
          placeholder="Select action"
          onChange={(value) => props.setSelectedStatus(Number(value))}
          options={action.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
        />
      </Drawer>
    </div>
  );
};
export default Filter;
