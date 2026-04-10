import * as Api from "@/api";
import styles from "./RankedInfoBox.module.css";

interface Props {
    data?: Api.SummonerInfo;
    queueType: "Solo" | "Flex";
}

export default function RankedInfoBox({ data, queueType }: Props) {
    const summonerInfo = data ?? Api.defaultSummonerInfo;

    const queueData =
        queueType === "Solo" ? summonerInfo.soloQueue : summonerInfo.flexQueue;

    const totalGames = queueData.wins + queueData.losses;
    const winratePercent =
        totalGames > 0 ? (queueData.wins / totalGames) * 100 : 0;

    return (
        <div className={styles.rankedInfoBox}>
            <div className={styles.rankedInfoHeader}>
                <h3>{"Ranked " + queueType}</h3>
            </div>

            <div className={styles.rankedInfoBody}>
                <div className={styles.rankedEmblemContainer}>
                    <img
                        className={styles.rankedEmblem}
                        src={"/assets/img/rank/" + queueData.tier + ".png"}
                        alt=""
                    />
                </div>

                <div className={styles.rankedText}>
                    <div className={styles.rankedLevel}>
                        <div>
                            <span className={styles.tier}>
                                {queueData.tier + " "}
                            </span>
                            <span className={styles.rank}>
                                {queueData.rank === "0" || queueData.tier == "CHALLENGER" ? "" : queueData.rank}
                            </span>
                        </div>

                        <span className={styles.leaguePoints}>
                            {queueData.leaguePoints + " LP"}
                        </span>
                    </div>
                    <div className={styles.winrate}>
                        <span className="WinsLosses">
                            {`${queueData.wins}W ${queueData.losses}L`}
                        </span>
                        <span className={styles.percentage}>
                            {winratePercent.toFixed(0) + "% WR"}
                        </span>

                    </div>
                </div>
            </div>
        </div>
    );
}
