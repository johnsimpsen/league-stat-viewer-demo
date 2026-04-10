import * as Api from "@/api";
import { useEffect, useRef } from "react";
import styles from "./ChampionBox.module.css";
import { getKDARatioColor } from "@/colorOptions.ts";
import { getChampionImageFromId, getChampionNameFromId } from "@/championInfo.ts";

interface Props {
    data: Api.AbsoluteChampStats;
}

const ChampionBox = ({ data }: Props) => {
    const loaderRef = useRef<HTMLDivElement>(null);

    const {totalKills, totalDeaths, totalAssists, totalGames, totalWins, totalLosses} = data;
    let averageKills = 0
    let averageDeaths = 0;
    let averageAssists = 0;
    let averageKDA = 0;
    let wins = 0;
    let losses = 0;
    let ratio = 0;


    //Check validity of the data
    if (totalKills) {
        //Calculate average kda
        averageKills = totalKills / totalGames;
        averageDeaths = totalDeaths / totalGames;
        averageAssists = totalAssists / totalGames;
        averageKDA = (averageKills + averageAssists) / averageDeaths;

        //Calculate average winrate
        wins = totalWins;
        losses = totalLosses;
        ratio = totalWins / totalGames;
    }

    //Update loading bar when ratio is changed
    useEffect(() => {
        if (loaderRef.current) {
            // Set CSS variable dynamically
            loaderRef.current.style.setProperty(
                "--loader-right",
                `${100 - ratio * 100}%`
            );
        }
    }, [ratio]);

    return (
        <div className={styles.championBox}>
            <div className={styles.champInfo}>
                <img
                    className={styles.champIcon}
                    src={
                        "/assets/img/champion/" +
                        getChampionImageFromId(data.champion)
                    }
                    alt=""
                    title={getChampionNameFromId(data.champion)}
                />

                <div className={styles.champTextInfo}>
                    <div className={styles.championName}>
                        {getChampionNameFromId(data.champion)}
                    </div>

                    <div className={styles.KDAInfo}>
                        <div className={styles.averageKDA}>
                            <span id={styles.kills}>{Number(averageKills.toFixed(1))}</span>
                            <span>/</span>
                            <span id={styles.deaths}>{Number(averageDeaths.toFixed(1))}</span>
                            <span>/</span>
                            <span id={styles.assists}>{Number(averageAssists.toFixed(1))}</span>
                        </div>

                        <div>
                            <span id={styles.averageTotalKDA}
                                  style={{
                                      color: getKDARatioColor(averageKDA)
                                  }}
                            >
                                {averageKDA.toFixed(2) + " KDA"}</span>
                        </div>



                    </div>
                </div>

                <div className={styles.champWinrateBar}>
                    <div
                        className={styles.loader}
                        ref={loaderRef}
                    >
                        <span
                            className={styles.barNum}
                        >
                            <p id={styles.winAmount}>{`${wins}W`}</p>
                            <p id={styles.loseAmount}>{`${losses}L`}</p>
                        </span>
                    </div>

                    <div className={styles.championWinratePercentageContainer}>
                        <span className={styles.championWinratePercentage}>
                            {Math.floor(ratio * 100)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChampionBox;
