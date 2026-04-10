import * as Api from "@/api";
import * as DateTimeFormat from "@/dateTimeFormat.ts";


export function getPlayerDataFromMatch(players: Api.Player[], playerPuuid: string) : Api.Player {

    //find match statistics about the correct player and store what players are on what team
    let player = Api.defaultPlayer;

    let index = 0;
    for (const p of players) {
        const riotGamePuuid = p.puuid; //use puuids instead of gameName to prevent gameName change errors

        //find the instance of player inside the match by checking each game participant's puuid against the search query player's puuid
        if (riotGamePuuid === playerPuuid) {
            player = p;
            break;
        }

        index++;
    }

    //track player's role
    player.individualPosition = getRoleFromIndex((index%5) + 1);

    return player;

}

export function findPlayerRoleFromMatch(players: Api.Player[], playerPuuid: string) : Api.Role {
    for (const p of players) {
        const riotGamePuuid = p.puuid; //use puuids instead of gameName to prevent gameName change errors

        //find the instance of player inside the match by checking each game participant's puuid against the search query player's puuid
        if (riotGamePuuid === playerPuuid) {

            return p.individualPosition;
        }
    }

    //return none otherwise
    return "None";
}

export function addTotalChampStats(totalChampStats: Api.TotalChampStats, player: Api.Player): void {

    totalChampStats.championId = player.championName;
    totalChampStats.kills += player.kills;
    totalChampStats.deaths += player.deaths;
    totalChampStats.assists += player.assists;

    if (player.win)
        totalChampStats.wins++;
    else
        totalChampStats.losses++;
}

export function getMatchResult(win: boolean, gameDuration: string): Api.Result {
    const lengthSeconds = new DateTimeFormat.Duration(gameDuration).getTotalSeconds();
    const isRemake = lengthSeconds < 180;

    return isRemake
        ? "remake"
        : win
            ? "win"
            : "lose";
}

export function getMatchResultText(gameResult: Api.Result) : string {
    switch (gameResult) {
        case "win":
            return "Victory";
        case "lose":
            return "Loss";
        case "remake":
            return "Remake";
        default: //default in case there is some error
            return "error";
    }
}

export function getRoleFromIndex(index: number) : Api.Role {
    switch (index) {
        case 1:
            return "TOP";
        case 2:
            return "JUNGLE";
        case 3:
            return "MIDDLE";
        case 4:
            return "BOTTOM";
        case 5:
            return "UTILITY";
        default:
            return "None";
    }
}

export function getDisplayRoleName(role: Api.Role | string): string {
    switch (role) {
        case "TOP":
            return "Top";
        case "JUNGLE":
            return "Jungle";
        case "MIDDLE":
            return "Middle";
        case "BOTTOM":
            return "Bottom";
        case "UTILITY":
            return "Support";
        default:
            return "None"
    }
}