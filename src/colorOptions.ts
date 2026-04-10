import * as Api from "./api/Types.ts"

//converts boolean game result to string color
export function getGameResultBackgroundColor(result: Api.Result) : string {
    if (result === "win")
        return "#425d9770"
    if (result === "lose")
        return "#ff7b7b3d";
    if (result === "remake")
        return "#50505c84";

    return "#000000" //default black color
}

//converts boolean game result to string color
export function getGameResultBorderColor(result: Api.Result) : string {
    if (result === "win") //win
        return "#42aefbb2";
    if (result === "lose")
        return "#ff3737b2";
    if (result === "remake")
        return "#d2d2e1b2";

    return "#000000" //default black color
}

export function getGameResultTextColor(result: Api.Result) : string {
    if (result === "win") //win
        return "#67a4ff";
    if (result === "lose")
        return "#ff6868";
    if (result === "remake")
        return "#ffffff";

    return "#000000" //default black color
}

//converts string rank to string color
export function getRankedColor(color: string): string {
    switch (color.toLowerCase()) {
        case "iron":
            return "#695f61";
        case "bronze":
            return "#8a533b";
        case "silver":
            return "#91b2b8";
        case "gold":
            return "#f4a24e";
        case "platinum":
            return "#2daad1";
        case "emerald":
            return "#12b53d";
        case "diamond":
            return "#8141eb";
        case "master":
            return "#ae5e53";
        case "grandmaster":
            return "#cd4545";
        case "challenger":
            return "#f4c874";
        default: //default: return black for unranked
            return "#000000";
    }
}

//converts number KDA ratio to string color
export function getKDARatioColor(KDA: number, gameResult?: Api.Result): string {
    //if game is a remake, return white
    if (gameResult === "remake")
        return "#ffffff";

    if (KDA < 1)
        return "#ff4f4f";
    else if (KDA < 3)
        return "#ffffff";
    else if (KDA < 5)
        return "#5483ff";
    else //includes "Perfect" kda for infinity
        return "#ff9900";
}
