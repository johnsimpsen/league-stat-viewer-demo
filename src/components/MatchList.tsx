import * as Api from "@/api";
import Match from "./Match";
import styles from "./MatchList.module.css";
import { findPlayerRoleFromMatch } from "@/matchData.ts";

interface Props {
    data: Api.Match[]; //list of games played
    playerPuuid: string;
    gameTypeFilter: string;
    gameRoleFilter: string;
}

export default function MatchList({ data, playerPuuid, gameTypeFilter, gameRoleFilter }: Props) {
    let matches = data;

    //filter for game type
    if (gameTypeFilter !== "All")
        matches = [...matches]
            .filter(a => a.MatchInfo.gameMode === gameTypeFilter)

    //filter for role type
    if (gameRoleFilter !== "NONE")
        matches = [...matches]
            .filter(a => findPlayerRoleFromMatch(a.players, playerPuuid) === gameRoleFilter)

    if (matches.length === 0) {
        return (
            <p id={styles.emptyListMessage}>
                No matches to display...
            </p>
        );
    }


    return (
        <div>
            <ul className={styles.matchList}>
                {matches.map((result, index) => (
                    <li key={index} className={styles.matchListItem}>
                        <Match data={result} playerPuuid={playerPuuid}></Match>
                    </li>
                ))}

            </ul>
        </div>
    );
}
