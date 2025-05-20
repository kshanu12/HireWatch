import Header from "../header";
import styles from "./loader.module.css";

function Loader() {
    return (
        <div>
            <Header />
            <div className={styles.loaderContainer}>
                <div className={styles.text}>Your test will begin shortly keep patience..!</div>
                <img src="/image/loader.svg" />
            </div>
        </div>
    )
}

export default Loader;