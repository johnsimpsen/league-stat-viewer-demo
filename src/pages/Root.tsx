import Search from "@/components/Search";
import styles from "./Root.module.css";
import React from "react";

export default function Root() {
    return (
        <div className={styles.wrapper}>
            <p id={styles.demoModeText}>
                Demo Mode
            </p>
            <p id={styles.demoModeInfo}>Click search to see a preloaded profile on the website</p>
            <p id={styles.demoModeDisclaimer}>*DISCLAIMER: I do not own this profile, it was chosen for its role diversity!*</p>
            <Search viewTransition />
            <a href="">Video Link for Non-Demo</a>
        </div>
    );
}
