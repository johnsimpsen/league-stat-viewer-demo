import Search from "@/components/Search";
import styles from "./Root.module.css";

export default function Root() {
    return (
        <div className={styles.wrapper}>
            <p id={styles.demoModeText}>
                Demo Mode
            </p>
            <p id={styles.demoModeInfo}>Click search to see a preloaded profile on the website</p>
            <Search viewTransition />
            <a href="">Video Link for Non-Demo</a>
        </div>
    );
}
