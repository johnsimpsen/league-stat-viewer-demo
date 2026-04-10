import * as Api from "@/api";
import {
    getChampionImageFromId,
    getChampionNameFromId,
} from "@/championInfo.ts";
import {
    getGameResultBackgroundColor,
    getGameResultBorderColor,
    getGameResultTextColor,
    getKDARatioColor,
} from "@/colorOptions.ts";
import * as DateTimeFormat from "@/dateTimeFormat";
import { getMatchResult, getMatchResultText, getPlayerDataFromMatch, getRoleFromIndex } from "@/matchData.ts";
import * as ReactRouter from "react-router";
import styles from "./Match.module.css";

const base = import.meta.env.VITE_ROUTER_BASE_URL;

interface Props {
    data: Api.Match;
    playerPuuid: string;
}

export default function Match({ data, playerPuuid }: Props) {
    const matchInfo = data.MatchInfo; // Object
    const players = data.players; // Array

    const player = getPlayerDataFromMatch(players, playerPuuid);

    //define different teams
    const blueTeam: Api.Player[] = [];
    const redTeam: Api.Player[] = [];

    for (let i = 0; i < players.length / 2; i++) {
        blueTeam.push(players[i]);
        redTeam.push(players[i + 5]);
    }

    //create object for date and time the game was played
    const datePlayed = new DateTimeFormat.LocaleDate(matchInfo.gameCreation);

    //check if player is null
    if (player === null) return <p>Error, player is null</p>;

    //calculate kda
    const kda =
        player.kills + player.assists > 0 && player.deaths === 0
            ? Infinity // Return infinity if player participated without dying
            : (player.kills + player.assists) / (player.deaths || 1); // Avoid 0 / 0

    const gameDuration = new DateTimeFormat.Duration(matchInfo.gameDuration);
    //determine the result of the game
    const gameResult = getMatchResult(player.win, matchInfo.gameDuration);

    return (
        <div
            className={styles.matchHistoryBox}
            style={{
                backgroundColor: getGameResultBackgroundColor(gameResult),
                borderColor: getGameResultBorderColor(gameResult),
                boxShadow: "0 0 12px " + getGameResultBorderColor(gameResult),
            }}
        >
            <div className={styles.matchInfo}>
                <p className={styles.gameType}>{matchInfo.gameMode}</p>
                <p className={styles.date}>{datePlayed.date}</p>
                <p className={styles.time}>{datePlayed.time}</p>
                <p
                    className={styles.result}
                    style={{
                        color: getGameResultTextColor(gameResult),
                    }}
                >
                    {getMatchResultText(gameResult)}
                </p>
                <p
                    className={styles.duration}
                >{`${gameDuration.minutes}m ${gameDuration.seconds}s`}</p>
            </div>

            <div className={styles.champInfo}>
                <div>
                    <img
                        className={styles.champIcon}
                        title={getChampionNameFromId(player.championName)}
                        src={
                            base + "/assets/img/champion/" +
                            getChampionImageFromId(player.championName)
                        }
                        alt=""
                    />

                    <div className={styles.champLevel}>{player.champLevel}</div>
                </div>

                <div className={styles.summonerSpells}>
                    <img
                        className={styles.spellIcon}
                        id={styles.spell1}
                        src={
                            base + "assets/img/summonerSpells/" +
                            player.summoner1Id +
                            ".png"
                        }
                        alt=""
                    />
                    <img
                        className={styles.spellIcon}
                        id={styles.spell2}
                        src={
                            "/assets/img/summonerSpells/" +
                            player.summoner2Id +
                            ".png"
                        }
                        alt=""
                    />
                </div>
            </div>

            <div className={styles.matchStats}>
                <div className={styles.KDA}>
                    <span className={styles.kills}>{player.kills}</span>
                    <span className={styles.slash}> / </span>
                    <span className={styles.deaths}>{player.deaths}</span>
                    <span className={styles.slash}> / </span>
                    <span className={styles.assists}>{player.assists}</span>
                </div>
                <div className={styles.totalKDA}>
                    <span
                        className={styles.number}
                        style={{
                            color: getKDARatioColor(kda, gameResult),
                        }}
                    >
                        {kda === Infinity ? "Perfect" : kda.toFixed(2)}
                    </span>
                    <span> KDA</span>
                </div>
                <div className={styles.CS}>
                    <span className={styles.score}>{player.totalCS}</span>
                    <span> CS</span>
                </div>
                <div className={styles.avgCS}>
                    <span className={styles.score}>
                        {(player.totalCS / (player.timePlayed / 60)).toFixed(1)}
                    </span>
                    <span> CS/min</span>
                </div>
            </div>

            <div className={styles.itemStats}>
                <div className={styles.itemIcons}>
                    <img
                        className={styles.itemIcon}
                        id={styles.item0}
                        src={"/assets/img/item/" + player.item0 + ".png"}
                        alt=""
                    />
                    <img
                        className={styles.itemIcon}
                        id={styles.item1}
                        src={"/assets/img/item/" + player.item1 + ".png"}
                        alt=""
                    />
                    <img
                        className={styles.itemIcon}
                        id={styles.item2}
                        src={"/assets/img/item/" + player.item2 + ".png"}
                        alt=""
                    />

                    <img
                        className={styles.itemIcon}
                        id={styles.trinket}
                        src={"/assets/img/item/" + player.item6 + ".png"}
                        alt=""
                    />
                    <img
                        className={styles.itemIcon}
                        id={styles.item3}
                        src={"/assets/img/item/" + player.item3 + ".png"}
                        alt=""
                    />
                    <img
                        className={styles.itemIcon}
                        id={styles.item4}
                        src={"/assets/img/item/" + player.item4 + ".png"}
                        alt=""
                    />
                    <img
                        className={styles.itemIcon}
                        id={styles.item5}
                        src={"/assets/img/item/" + player.item5 + ".png"}
                        alt=""
                    />
                </div>
            </div>

            <div className={styles.teamRoster}>
                {/* Optional role icons for team, but minor tweaks need to be made in order to be used correctly */}
                {/*<ul className={styles.roleList}>*/}
                {/*    {[...Array(5).keys()].map(i => i + 1).map((num) => (*/}
                {/*        <li className={styles.roleListItem}>*/}
                {/*            <img*/}
                {/*                className={styles.roleIcon}*/}
                {/*                src={"/assets/img/role/" + getRoleFromIndex(num) + ".png"}*/}
                {/*                alt={getRoleFromIndex(num)}*/}
                {/*            />*/}
                {/*        </li>*/}
                {/*    ))}*/}
                {/*</ul>*/}

                <Team players={blueTeam} />
                <Team players={redTeam} />
            </div>
            <div className={styles.sideBar}></div>
        </div>
    );
}

interface TeamProps {
    players: Api.Player[];
}

//Definition for Team list component
function Team({ players }: TeamProps) {
    const [searchParams] = ReactRouter.useSearchParams();
    const matchCount = searchParams.get("matchCount");

    return (
        <div className={styles.team}>
            {players.map((player, index) => {
                const riotId = `${player.riotIdGameName}#${player.riotIdTagline}`;
                return (
                    <ReactRouter.Link
                        key={riotId}
                        title={riotId}
                        className={styles.teamPlayerLink}
                        to={`/stats/${encodeURIComponent(riotId)}${matchCount ? `?matchCount=${matchCount}` : ""}`}
                    >
                        <img
                            className={styles.playerChampIcon}
                            src={"/assets/img/champion/" +
                                getChampionImageFromId(player.championName)}
                            alt={`Role: ${getRoleFromIndex(index)}, ${player.riotIdGameName}'s champion icon`}
                        />
                        <p className={styles.teamPlayerName}>
                            {player.riotIdGameName}
                        </p>
                    </ReactRouter.Link>
                );
            })}
        </div>
    );
}
