import * as Api from "@/api";
import styles from "./MatchOverview.module.css";
import donutGraphStyles from "./DonutGraph.module.css"
import { useEffect, useRef, useMemo } from "react";
import {
    addTotalChampStats, findPlayerRoleFromMatch,
    getDisplayRoleName,
    getMatchResult,
    getPlayerDataFromMatch,
    getRoleFromIndex
} from "@/matchData.ts";
import { getKDARatioColor } from "@/colorOptions.ts";
import { getChampionImageFromId, getChampionNameFromId } from "@/championInfo.ts";

interface Props {
    data?: Api.Match[];
    playerPuuid: string;
    gameTypeFilter: string;
    gameRoleFilter: string;
}

export default function MatchOverview({ data, playerPuuid, gameTypeFilter, gameRoleFilter }: Props) {

    let matches = data;


    //update match overview statistics only when data or playerName changes
    const stats : Api.PlayerAverageOverview = useMemo(() => {

        if (!matches || matches.length === 0)
            return { ...Api.defaultPlayerAverageOverview };

        //filter for gamemode
        if (gameTypeFilter !== "All") {
            matches = [...matches]
                .filter(a => a.MatchInfo.gameMode === gameTypeFilter)
        }

        //filter for role type
        if (gameRoleFilter !== "NONE")
            matches = [...matches]
                .filter(a => findPlayerRoleFromMatch(a.players, playerPuuid) === gameRoleFilter)

        //Total the player's stats together from each match (shallow copy of defaultTotalPlayerOverview)
        const playerTotalStats : Api.PlayerTotalOverview = { ...Api.defaultTotalPlayerOverview };

        //keep track of the number of games played on each role
        const roleCount: Api.RoleGameCount = { ...Api.defaultRoleGameCount };
        let roleCountTotal = 0;

        //Total up all stats from each game
        for (const match of matches) {
            const player = getPlayerDataFromMatch(match.players, playerPuuid);

            playerTotalStats.assists += player.assists;
            playerTotalStats.deaths += player.deaths;
            playerTotalStats.kills += player.kills;

            //If game is won, increment win counter, otherwise increment loss counter
            if (player.win)
                playerTotalStats.wins++;
            else
                playerTotalStats.losses++;

            //Increment a role if the player is in that position and if the game type is correct
            //TODO: THIS IS A TEMPORARY FIX FOR TESTING, WILL IMPLEMENT REAL TYPES LATER
            const gameType = match.MatchInfo.gameMode;
            if (gameType == "Normal" || gameType == "Ranked Solo" || gameType == "Ranked Flex") {
                roleCount[player.individualPosition]++;
                roleCountTotal++;
            }
            else
                roleCount["None"]++;
        }

        //Calculate other useful statistics
        const winrate = playerTotalStats.wins / (playerTotalStats.losses + playerTotalStats.wins) * 100;
        const averageKDA = (playerTotalStats.kills + playerTotalStats.assists) / playerTotalStats.deaths;

        //Calculate average individual assists, deaths, and kills
        const averageAssists = playerTotalStats.assists / matches.length;
        const averageDeaths = playerTotalStats.deaths / matches.length;
        const averageKills = playerTotalStats.kills / matches.length;

        return {
            assists: averageAssists,
            deaths: averageDeaths,
            kills: averageKills,
            kda: averageKDA,
            wins: playerTotalStats.wins,
            losses: playerTotalStats.losses,
            gamesDisplayed: matches.length,
            winrate: winrate,
            roleCount: roleCount,
            roleCountTotal: roleCountTotal,
        }

    }, [data, playerPuuid, gameTypeFilter, gameRoleFilter]);


    //update number of games played on each role when the number of matches being displayed is changed
    const roleAmountList = useMemo(() => {
        const list = Object.values(stats.roleCount);
        return list.slice(0, -1);
    }, [stats.roleCount]);


    //TODO: FIX TEMPORARY FORMATTING AND INFORMATION
    return (
        <div className={styles.matchOverviewBox}>
            <div className={styles.matchOverviewHeader}>
                <h3>{"Match Overview"}</h3>
            </div>

            <div className={styles.matchOverviewBody}>
                <div className={styles.winrateInfo}>
                    <DonutGraph
                        winrate={stats.winrate}
                    />
                    <div className={styles.winRateInfoData}>
                        <span className={styles.mainText}>{`${stats.winrate.toFixed(0)}% WR`}</span>
                        <span className={styles.subtext}>{"From the last " + stats.gamesDisplayed + " games"}</span>
                    </div>
                </div>

                <div className={styles.KDAInfo}>
                    <div
                        className={`${styles.mainText} ${styles.AverageKDA}`}
                        style={{
                            color: getKDARatioColor(stats.kda),
                        }}
                    >
                        {stats.kda === Infinity ? "Perfect KDA" : `${stats.kda.toFixed(2)} KDA`}
                    </div>
                    <div className={styles.midText}>
                        <span >{stats.kills.toFixed(1)}</span>
                        <span> / </span>
                        <span id={styles.KDADeaths}>{stats.deaths.toFixed(1)}</span>
                        <span> / </span>
                        <span>{stats.assists.toFixed(1)}</span>

                    </div>
                </div>

                <div className={styles.recentlyPlayedChampsContainer}>
                    <RecentlyPlayedChamps
                        matches={data}
                        playerPuuid={playerPuuid}>
                    </RecentlyPlayedChamps>
                </div>

                <div className={styles.roleBarListContainer}>
                    <ul className={styles.roleBarList}>
                        {roleAmountList.map((result, index) => (
                            <li key={index} className={styles.roleBarListItem}>
                                <RoleBarGraph
                                    roleName={getRoleFromIndex(index+1)}
                                    roleCount={result}
                                    gamesDisplayed={stats.roleCountTotal}
                                ></RoleBarGraph>
                                <img
                                    className={styles.roleIcon}
                                    src={"/assets/img/role/" + getRoleFromIndex(index+1) + ".png"}
                                    alt={getRoleFromIndex(index+1)}
                                    title={getDisplayRoleName(getRoleFromIndex(index+1))}
                                />
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
}


interface DonutGraphProps {
    winrate: number;
}

function DonutGraph({ winrate }: DonutGraphProps) {
    const segmentRef = useRef<SVGCircleElement>(null);

    //update donut graph when winrate changes
    useEffect(() => {
        if (segmentRef.current) {
            // Set CSS variable dynamically
            segmentRef.current.style.setProperty(
                "--win-percent",
                `${winrate}px`
            );

            segmentRef.current.style.setProperty(
                "--lose-percent",
                `${100-winrate}px`
            );
        }
    }, [winrate]);

    return (
        <div className={donutGraphStyles.container}>

            <svg viewBox="0 0 42 42" className={styles.donutGraph}>
                <circle className={donutGraphStyles.ring}
                        cx="21"
                        cy="21"
                        r="15.91549430918954"
                        fill="transparent"
                        strokeWidth="8">
                </circle>


                <circle className={donutGraphStyles.segment}
                        ref={segmentRef}
                        cx="21"
                        cy="21"
                        r="15.91549430918954"
                        fill="transparent"
                        strokeWidth="8"
                        strokeDashoffset="25">
                </circle>
            </svg>
        </div>
    );
}

interface RecentlyPlayedChampsProps {
    matches?: Api.Match[];
    playerPuuid: string;
}

function RecentlyPlayedChamps({ matches, playerPuuid } : RecentlyPlayedChampsProps) {

    let champArray;

    //if the data exists and have a non-zero length, use it
    if (matches && matches?.length !== 0) {

        const recentlyPlayedChamps = new Map<string, Api.TotalChampStats>();

        //Iterate through the list of matches to total all the champion stats
        for (const match of matches) {

            const player = getPlayerDataFromMatch(match.players, playerPuuid);

            //If the game is a remake, skip adding it
            if (getMatchResult(player.win, match.MatchInfo.gameDuration) == "remake")
                continue;

            const existing = recentlyPlayedChamps.get(player.championName);

            const newData = existing
                ? structuredClone(existing)
                : structuredClone(Api.defaultTotalChampStats);

            //Add new stats to the total
            addTotalChampStats(newData, player);

            //Update dictionary with new data
            recentlyPlayedChamps.set(player.championName, newData);
        }

        // Convert dictionary to array
        // Sort Array by number of games played (total wins + total losses) in descending order (most played is index 0)
        champArray = Array.from(recentlyPlayedChamps.values())
            .sort((a,b) => (b.wins + b.losses) - (a.wins + a.losses))
            .slice(0, 3);

        // Calculate kda and winrate
        for (const champ of champArray) {
            champ.kda = (champ.kills + champ.assists) / champ.deaths;
            champ.winrate = (champ.wins / (champ.wins + champ.losses) * 100);
        }
    }
    //if matches do not exist, load placeholder data
    else {
        //Create an array of 3 default stats for webpage skeleton
        champArray = Array.from({ length: 3 }, (): Api.TotalChampStats =>
            structuredClone(Api.defaultTotalChampStats)
        );
    }


    return (
        <ul className={styles.championAvgStatsList}>
            {champArray.map((champ, index) => (
                <li className={styles.championAvgStatsListElement} key={index}>
                    <img
                        className={styles.champIcon}
                        title={getChampionNameFromId(champ.championId)}
                        src={
                            "/assets/img/champion/" +
                            getChampionImageFromId(champ.championId)
                        }
                        alt="" />

                    <div className={styles.champAverageKDA}
                    style={{
                        color: getKDARatioColor(champ.kda)
                    }}>
                        <span>{champ.kda === Infinity ? "Perfect" : champ.kda.toFixed(2)}</span>
                        <span> KDA</span>
                    </div>
                    <span id={styles.champAverageWinrate}>
                        {"(" + champ.wins + "W " + champ.losses + "L) "}
                    </span>

                    <span id={styles.winratePercent}>
                            {champ.winrate.toFixed(0) + "%"}
                    </span>
                </li>
            ))}

        </ul>
    )
}

interface RoleBarGraphProps {
    roleName: string;
    roleCount: number;
    gamesDisplayed: number;

}

function RoleBarGraph({ roleName, roleCount, gamesDisplayed } : RoleBarGraphProps) {
    const barRef = useRef<HTMLDivElement>(null);

    const ratio = roleCount / gamesDisplayed;

    useEffect(() => {
        if (barRef.current) {
            // Set CSS variable dynamically
            barRef.current.style.setProperty(
                "--bar-height",
                `${100 - ratio * 100}%`
            );
        }
    }, [ratio]);

    return (
        <div>
            <div
                className={styles.bar}
                key={roleName}
                ref={barRef}
                title={(ratio*100).toFixed(0) + "%"}
            ></div>
        </div>
    )
}