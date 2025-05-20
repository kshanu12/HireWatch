import styles from "./tableLoader.module.css";
import { Spin } from 'antd';

function TableLoader() {
    return (
        <div>
            <div className={styles.loaderContainer}>
                <Spin size="large" />
            </div>
        </div>
    )
}

export default TableLoader;