import * as Api from "@/api";
import config from "./config.json";

// Fetch backend's database for any existing matches on first search, if none, riot api will be called from the backend
export async function fetchSearchPlayer(
    username: string,
    tagLine: string,
    matchStart: number,
    matchCount: number
): Promise<Api.SearchDataRaw> {
    const response = await fetch(
        `${config.baseURL}/player?username=${username}&tag=${tagLine}&matchStart=${matchStart}&matchCount=${matchCount}`
    );
    return await response.json();
}

// Tell backend to immediately update the database with whatever the newest info by requesting riot api
export async function fetchRefreshPlayer(
    username: string,
    tagLine: string,
    matchCount?: number,
): Promise<boolean> {
    if (!matchCount) matchCount = config.defaultMatchCount;

    const response = await fetch(`${config.baseURL}/player/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            gameName: username,
            tagLine,
            amount: matchCount,
        }),
    });
    return response.ok;
}

// Request 20 more matches starting from the current number of matches already loaded
export async function fetchLoadMatches(
    username: string,
    tagLine: string,
    matchStart?: number,
): Promise<Api.LoadMatchDataRaw> {

    const currentPage = matchStart != null ? Math.trunc(matchStart / 20) : 0;

    const response = await fetch(
        `${config.baseURL}/player/pageDown?username=${username}&tag=${tagLine}&pageNum=${currentPage}`
    );

    const data = await response.json();

    return data as Api.LoadMatchDataRaw;
}

export * from "./Types";
