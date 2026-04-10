import * as Api from "@/api";
import ChampionBox from "./ChampionBox";
import styles from "./ChampionList.module.css";
import config from "@/api/config.json"
import React from "react";

interface Props {
    data?: Api.AbsoluteChampStats[];
}

export default function ChampionList({ data }: Props) {

    const [gameModeFilter, selectGameModeFilter] = React.useState("Normal");

    //Check if data is null for correct skeleton behavior when loading in new data
    let champStats = data ?? (Array(10).fill(Api.defaultAbsoluteChampStats));

    //if data exists, apply needed filters
    if (champStats) {
        champStats = [...champStats]
            .sort((a, b) => b.totalGames - a.totalGames) //Sort games by descending number of games played
            .filter(a => a.gameVersion === config.currentGameVersion)
            .filter(a => a.gameMode === gameModeFilter)
            //.filter(a => a.role == "None") //TODO: Add drop down list for filtering games by role
            .slice(0, 10);
    }

    //gameMode button behavior, change the selected gameMode to whatever is pressed
    function gameModeFilterButton(option: string) {
        selectGameModeFilter(option);
    }

    return (
        <div className={styles.champStatListBox}>
            <div className={styles.championStatsHeader}>
                <h3>Champion Stats</h3>
            </div>
            <div className={styles.filterSection}>
                <ul className={styles.buttonFilterList}>
                    {["Normal", "Ranked Solo", "Ranked Flex"].map((option, index) =>
                        <button key={index}
                            className={`${styles.buttonFilterListItem} ${gameModeFilter === option ? styles.activeFilterButton : ""}`}
                            onClick={() => gameModeFilterButton(option)}>
                            {option}
                        </button>
                    )}
                </ul>
            </div>
            <div>
                <ul className={styles.champStatList}>
                    {champStats.map((result, index) => (
                        <li key={index} className={styles.champStatListItem}>
                            <ChampionBox data={result}></ChampionBox>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
