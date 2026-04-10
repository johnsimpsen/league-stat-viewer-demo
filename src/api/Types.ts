import * as Api from "@/api/index.ts";

export interface Match {
    MatchInfo: MatchInfo; // Not sure why this is capitalized
    players: Player[];
}

export interface MatchInfo {
    gameCreation: string;
    gameDuration: string;
    gameMode: string;
    gameType: string;
    gameVersion: string;
    mapId: number;
    gameId: number;
}

export const defaultMatchInfo = {
    gameCreation: "0000-00-00 00:00:00.000000+00:00",
    gameDuration: "00:00:00",
    gameMode: "None",
    gameType: "None",
    gameVersion: "0",
    mapId: 11,
    gameId: 0,
};

export interface RankedInfo {
    tier: string;
    rank: string;
    wins: number;
    losses: number;
    leaguePoints: number;
}

export const defaultRankedInfo = {
    tier: "UNRANKED",
    rank: "",
    wins: 0,
    losses: 0,
    leaguePoints: 0,
};

export interface SummonerInfo {
    gameName: string;
    id: number;
    profileIconId: number;
    puuid: string;
    revisionDate: number;
    summonerLevel: number;
    tagLine: string;
    soloQueue: RankedInfo;
    flexQueue: RankedInfo;
}

export const defaultSummonerInfo: SummonerInfo = {
    gameName: "Loading",
    id: -1,
    profileIconId: 29,
    puuid: "0",
    revisionDate: 0,
    summonerLevel: 0,
    tagLine: "...",
    soloQueue: defaultRankedInfo,
    flexQueue: defaultRankedInfo,
};

//Type for game position ("UTILITY" is support)
export type Role = "TOP" | "JUNGLE" | "MIDDLE" | "BOTTOM" | "UTILITY" | "None";

export type RoleGameCount = {
    TOP: number;
    JUNGLE: number;
    MIDDLE: number;
    BOTTOM: number;
    UTILITY: number;
    None: number;
}

export const defaultRoleGameCount = {
    TOP: 0,
    JUNGLE: 0,
    MIDDLE: 0,
    BOTTOM: 0,
    UTILITY: 0,
    None: 0,
}

export interface Player {
    assists: number;
    champLevel: number;
    championId: number;
    championName: string;
    deaths: number;
    firstBloodKill: boolean;
    goldEarned: number;
    item0: number;
    item1: number;
    item2: number;
    item3: number;
    item4: number;
    item5: number;
    item6: number;
    kda: number;
    kills: number;
    puuid: string;
    riotIdGameName: string;
    riotIdTagline: string;
    individualPosition: Role;
    spell1Casts: number;
    spell2Casts: number;
    spell3Casts: number;
    spell4Casts: number;
    summoner1Id: number;
    summoner2Id: number;
    timeCCingOthers: number;
    timePlayed: number;
    totalCS: number;
    totalDamageDealtToChampions: number;
    totalDamageTaken: number;
    totalHealsOnTeammates: number;
    totalMinionsKilled: number;
    totalTimeCCDealt: number;
    visionScore: number;
    win: boolean;
}

export const defaultPlayer = {
    assists: 0,
    champLevel: 0,
    championId: 0,
    championName: "None",
    deaths: 0,
    firstBloodKill: false,
    goldEarned: 0,
    item0: 0,
    item1: 0,
    item2: 0,
    item3: 0,
    item4: 0,
    item5: 0,
    item6: 0,
    kda: 0,
    kills: 0,
    puuid: "None",
    riotIdGameName: "None",
    riotIdTagline: "None",
    individualPosition: "None" as Role,
    spell1Casts: 0,
    spell2Casts: 0,
    spell3Casts: 0,
    spell4Casts: 0,
    summoner1Id: 0,
    summoner2Id: 0,
    timeCCingOthers: 0,
    timePlayed: 0,
    totalCS: 0,
    totalDamageDealtToChampions: 0,
    totalDamageTaken: 0,
    totalHealsOnTeammates: 0,
    totalMinionsKilled: 0,
    totalTimeCCDealt: 0,
    visionScore: 0,
    win: false,
};

export interface TotalChampStats {
    championId: string;
    kills: number;
    deaths: number;
    assists: number;
    kda: number;
    wins: number;
    losses: number;
    winrate: number

}

export const defaultTotalChampStats = {
    championId: "0",
    kills: 0,
    deaths: 0,
    assists: 0,
    kda: 0,
    wins: 0,
    losses: 0,
    winrate: 0,
}

export interface AbsoluteChampStats {
    champion: string;
    role: Role;
    gameVersion: string;
    gameMode: string;
    totalKills: number;
    totalDeaths: number;
    totalAssists: number;
    totalWins: number;
    totalLosses: number;
    totalGames: number;
}

export const defaultAbsoluteChampStats = {
    champion: "0",
    role: "None",
    gameVersion: "None",
    gameMode: "None",
    totalKills: 0,
    totalDeaths: 0,
    totalAssists: 0,
    totalWins: 0,
    totalLosses: 0,
    totalGames: 0,
}

export interface PlayerTotalOverview {
    assists: number;
    deaths: number;
    kills: number;
    wins: number;
    losses: number;
}

export const defaultTotalPlayerOverview = {
    assists: 0,
    deaths: 0,
    kills: 0,
    wins: 0,
    losses: 0,
};

export interface PlayerAverageOverview {
    assists: number;
    deaths: number;
    kills: number;
    kda: number;
    wins: number;
    losses: number;
    gamesDisplayed: number;
    winrate: number;
    roleCount: RoleGameCount;
    roleCountTotal: number;
}

export const defaultPlayerAverageOverview = {
    assists: 0,
    deaths: 0,
    kills: 0,
    kda: 0,
    wins: 0,
    losses: 0,
    gamesDisplayed: 0,
    winrate: 0,
    roleCount: defaultRoleGameCount,
    roleCountTotal: 0,
};

export interface ChampionMastery {
    championId: number;
    championLevel: number;
    lastPlayTime: number;
    championPointsSinceLastLevel: number;
    championPointsUntilNextLevel: number;
}

export const defaultChampionMastery: ChampionMastery = {
    championId: 0,
    championLevel: 0,
    lastPlayTime: 0,
    championPointsSinceLastLevel: 0,
    championPointsUntilNextLevel: 0,
};

// The raw response coming from Api.fetchSearchPlayer or Api.fetchRefreshPlayer
export interface SearchDataRaw {
    champStats: Api.AbsoluteChampStats[];
    matchData: Match[];
    playerData: {
        entries: SummonerInfo;
        championMastery: {
            championMastery: ChampionMastery[];
        };
        gameName: string;
        tagLine: string;
        puuid: string;
        updateDate: string;
    };
}

export interface LoadMatchDataRaw {
    matchData: Match[];
}

export type Result = "win" | "lose" | "remake" | null;
