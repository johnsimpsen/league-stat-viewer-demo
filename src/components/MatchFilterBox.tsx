import styles from "./MatchFilterBox.module.css";
import React from "react";
import { getDisplayRoleName } from "@/matchData.ts";

import baseRoute from "../api/baseRoute.json"

interface Props {
    updateMatchGamemodeFilter: Function;
    updateMatchRoleFilter: Function;
}

export default function MatchFilterBox({ updateMatchGamemodeFilter, updateMatchRoleFilter }: Props) {

    const [gamemodeFilter, selectGamemodeFilter] = React.useState("All");
    const [roleFilter, selectRoleFilter] = React.useState("NONE");

    //update the gamemode type the user wants to filter matches by
    function matchGamemodeFilterButton(option: string) {
        selectGamemodeFilter(option);

        //send gamemode filter data to parent component (Stats.tsx)
        updateMatchGamemodeFilter(option);
    }

    //select the role type the user wants to filter matches by
    function matchRoleFilterButton(option: string) {
        selectRoleFilter(option);

        //send role filter data to parent component (Stats.tsx)
        updateMatchRoleFilter(option);
    }

    return (
        <div className={styles.matchFilterBox}>
            <ul className={styles.matchGamemodeList}>
                {["All", "Normal", "Ranked Solo", "Ranked Flex", "Aram"].map((option) =>
                    <button
                        className={` ${styles.matchGamemodeButton} ${gamemodeFilter === option ? styles.activeGamemodeButton : ""}`}
                        onClick={() => matchGamemodeFilterButton(option)}
                        key={option}>
                        {option}
                    </button>
                )}
            </ul>

            <ul className={styles.matchRoleList}>
                {["NONE", "TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"].map((option) =>
                    <button
                        className={styles.matchRoleButton}
                        onClick={() => matchRoleFilterButton(option)}
                        title={getDisplayRoleName(option)}
                        key={option}>
                        <div className={`${styles.roleIconContainer} ${roleFilter === option ? styles.activeRoleButton : ""}`}>
                            <img src={baseRoute.baseRoute + "/assets/img/role/" + option + ".png"} alt={option} className={`${styles.roleButtonIcon} ${roleFilter === option ? styles.activeRoleButtonIcon : ""}`}/>
                        </div>
                    </button>
                )}
            </ul>
        </div>
    )
}