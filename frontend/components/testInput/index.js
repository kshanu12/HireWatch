import { Card, Select, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import styles from './testinput.module.css';

const tests = [
  {
    id: 1, 
    type: "Non-Coding"
  }, 
  { 
    id: 2, 
    type: "Coding" }];

const TestID = (props) => {
  return (
    <Card className={styles.card}>
      <h1>
        Test <EditOutlined className={styles.penIcon} />
      </h1>
      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <div className={styles.title}>Name:</div>
          <Input
            className={styles.input}
            onChange={(e) => props.setTestName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.title}>Type:</div>
          <Select
            className={styles.select}
            defaultValue={tests[0].type}
            onChange={(value) => props.setTestType(Number(value))}
            options={tests.map((test) => ({
              label: test.type,
              value: test.id,
            }))}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.title}>Duration:</div>
          <Input
            className={styles.input}
            onChange={(e) => props.setDuration(Number(e.target.value))}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.title}>Tech-Stack:</div>
          <Select
            className={styles.select}
            defaultValue="select"
            onChange={(value) => props.setSelectedTechStack(Number(value))}
            options={props.techStack.map((ts) => ({
              label: ts.name,
              value: ts.id,
            }))}
          />
        </div>
      </div>
    </Card>
  );
};

export default TestID;
