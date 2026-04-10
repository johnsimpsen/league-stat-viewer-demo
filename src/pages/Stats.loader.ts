import * as Api from "@/api";
import * as apiConfig from "@/api/config.json";
import * as ReactRouter from "react-router";
import demoInfo from "@/resources/DEMO.json";

// Existing "Clean" interface for the component
export interface SearchData {
    champStats: Api.AbsoluteChampStats[]
    matchList: Api.Match[];
    summonerProfile: Api.SummonerInfo;
    championMastery: Api.ChampionMastery[];
    updateDate: string;
}

export interface Data {
    username: string;
    tagLine: string;
    lolDataPromise: Promise<SearchData>;
}

export function loader({
    params,
    request,
}: ReactRouter.LoaderFunctionArgs): Data {
    const [username = "", tagLine = ""] = (params.riotId ?? "").split("#");

    const url = new URL(request.url);

    //if match count is not given, use default
    const matchCount =
        Number(url.searchParams.get("matchCount")) ||
        apiConfig.defaultMatchCount;

    //Default data is return for demo mode
    const DEMO_DATA: SearchData = {
        champStats: demoInfo.champStats,
        matchList: demoInfo.matchData,
        summonerProfile: demoInfo.playerData.entries,
        championMastery: demoInfo.playerData.championMastery.championMastery,
        updateDate: demoInfo.playerData.updateDate,
    }

    const lolDataPromise = Promise.resolve(DEMO_DATA);

    return { username, tagLine, lolDataPromise };
}
