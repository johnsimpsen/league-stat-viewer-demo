import * as Api from "@/api";
import { getRankedColor } from "../colorOptions.ts";
import styles from "./SummonerProfile.module.css";

interface Props {
    data?: Api.SummonerInfo;
}

export default function SummonerProfile({ data }: Props) {
    const summonerInfo = data ?? Api.defaultSummonerInfo;

    return (
        <div className={styles.summonerProfile}>
            <div className={styles.summonerInfo}>
                    <div
                        className={styles.profileImageLevel}
                        style={{
                            borderColor: getRankedColor(summonerInfo.soloQueue.tier),
                        }}
                    >
                        <img
                            className={styles.profileImage}
                            src={
                                "/assets/img/profileIcon/" +
                                summonerInfo.profileIconId +
                                ".png"
                            }
                            alt=""
                        />
                        <div className={styles.summonerLevel}>
                            {summonerInfo.summonerLevel}
                        </div>
                    </div>


                <div className={styles.playerProfileText}>
                    <div className={styles.playerNameGroup}>
                        <span
                            className={styles.playerNameText}
                            id={styles.playerUsername}
                        >
                            {summonerInfo.gameName}
                        </span>
                        <span
                            className={styles.playerNameText}
                            id={styles.playerTagline}
                        >
                            {"#" + summonerInfo.tagLine}
                        </span>
                    </div>

                    <div
                        className={styles.playerRankGroup}
                        style={{
                            color: getRankedColor(summonerInfo.soloQueue.tier),
                        }}
                    >
                        <span className={styles.playerRankText}>
                            {summonerInfo.soloQueue.tier}
                        </span>
                        { summonerInfo.soloQueue.tier == "CHALLENGER" ?
                            <></>
                            :
                            <span className={styles.playerRankText}>
                                {summonerInfo.soloQueue.rank}
                            </span>
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}
