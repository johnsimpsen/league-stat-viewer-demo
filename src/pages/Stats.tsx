import * as Api from "@/api";
import ChampionList from "@/components/ChampionList";
import MatchList from "@/components/MatchList";
import MatchOverview from "@/components/MatchOverview.tsx";
import RankedInfoBox from "@/components/RankedInfoBox";
//import Search from "@/components/Search";
import SummonerProfile from "@/components/SummonerProfile";
import MatchFilterBox from "@/components/MatchFilterBox.tsx";
import * as DateTimeFormat from "@/dateTimeFormat";
import React from "react";
import * as ReactRouter from "react-router";
import * as Loader from "./Stats.loader";
import styles from "./Stats.module.css";

interface Props {
    skeleton?: boolean;
}

export default function Stats() {

    //key to determine if the skeleton should be used or not when loading in data
    const playerIdentityKey = ReactRouter.useParams().riotId

    return (
        // @ts-expect-error React hasn't yet implemented types for ViewTransition
        <React.ViewTransition>
            <React.Suspense key={playerIdentityKey} fallback={<Inner skeleton />}>
                <Inner />
            </React.Suspense>
            {/* @ts-expect-error lol */}
        </React.ViewTransition>
    );
}

function Inner({ skeleton }: Props) {

    const { username, tagLine, lolDataPromise }: Loader.Data = ReactRouter.useLoaderData();
    const revalidator = ReactRouter.useRevalidator();
    const [refreshIsProcessing, setRefreshIsProcessing] = React.useState(false);

    // load lolData from the promise the api returns
    const lolData = skeleton ? null : React.use(lolDataPromise);
    const [matchList, setMatchList] = React.useState<Api.Match[]>(lolData?.matchList ?? []);

    //update the state of loldata whenever it is changed
    React.useEffect(() => {
        if (lolData?.matchList) {
            setMatchList(lolData.matchList);
        }
    }, [lolData]);

    // keeps track if refreshProcessing or page loading is still updating, used for refresh button UI
    const isBusy = refreshIsProcessing || revalidator.state === "loading" || !lolData;

    const formattedUpdateDate = lolData
        ? new DateTimeFormat.LocaleDate(lolData.updateDate)
        : null;

    //get puuid from info or set it to be none
    const puuid = lolData?.summonerProfile.puuid || "none";


    //INTERACTABLE BUTTONS:

    //Disabled for demo mode

    //refresh button behavior, updates the state of the button ui and calls refresh api
    // async function refreshButton() {
    //     if (isBusy) return;
    //
    //     setRefreshIsProcessing(true);
    //
    //     // direct API call to trigger backend calling riot api
    //     await Api.fetchRefreshPlayer(username, tagLine, Number(searchParams.get("matchCount")));
    //     setRefreshIsProcessing(false);
    //
    //     // updates lolData after fetchRefreshPlayer is called
    //     await revalidator.revalidate();
    // }
    //
    // //load button behavior, adds 20 matches to the current match list
    // async function loadButton() {
    //     if (isBusy) return;
    //
    //     setRefreshIsProcessing(true);
    //
    //     // direct API call to ask for 20 new matches to append to the end of the matchList
    //     const result = await Api.fetchLoadMatches(username, tagLine, matchList?.length);
    //     const newMatches = result.matchData ?? [];
    //
    //     setRefreshIsProcessing(false);
    //
    //     //Append new matches to matchList
    //     setMatchList(prev => [...prev, ...newMatches]);
    //     //setChampStats(result.champStats)
    // }

    //Match filter data
    const [matchGamemodeFilter, setMatchGamemodeFilter] = React.useState("All");
    const [matchRoleFilter, setMatchRoleFilter] = React.useState("NONE");

    const handleMatchGamemodeFilterUpdate = (option: string) => {
        setMatchGamemodeFilter(option);
    }

    const handleMatchRoleFilterUpdate = (option: string) => {
        setMatchRoleFilter(option);
    }

    return (
        <div className={styles.stats}>
            <div>
                <div className={styles.topProfile}>
                    <SummonerProfile data={lolData?.summonerProfile} />
                    {/*<Search />*/}
                    <p className={styles.demoModeText}>Search is disabled on demo mode</p>

                </div>

                <p className={styles.demoModeText}>Refresh is disabled on demo mode</p>
                {/*<button*/}
                {/*    className={styles.refreshButton}*/}
                {/*    disabled={isBusy}*/}
                {/*    onClick={refreshButton}*/}
                {/*    title={`Last updated: ${formattedUpdateDate?.full ?? ""}`}*/}
                {/*    style={*/}
                {/*        isBusy ? { filter: 'brightness(0.5)' } : {}*/}
                {/*    }*/}
                {/*>*/}
                {/*    {isBusy ? "Loading..." : "Refresh"}*/}
                {/*</button>*/}

                <p className={styles.updateDate}>
                    Last updated: {formattedUpdateDate?.full ?? ""}
                </p>

                <div className={styles.rowInfo}>
                    <div className={styles.columnsPlayerInfo}>
                        <RankedInfoBox
                            data={lolData?.summonerProfile}
                            queueType="Solo"
                        />
                        <RankedInfoBox
                            data={lolData?.summonerProfile}
                            queueType="Flex"
                        />

                        <ChampionList
                            data={lolData?.champStats}
                        />


                        {/*<div className={styles.two}>*/}
                        {/*    Temporary Box*/}
                        {/*</div>*/}
                    </div>

                    <div className={styles.columnsMatchInfo}>
                        <MatchOverview
                            data={matchList}
                            playerPuuid={puuid}
                            gameTypeFilter={matchGamemodeFilter}
                            gameRoleFilter={matchRoleFilter}
                        />
                        <MatchFilterBox
                            updateMatchGamemodeFilter={handleMatchGamemodeFilterUpdate}
                            updateMatchRoleFilter={handleMatchRoleFilterUpdate}>
                        </MatchFilterBox>

                        {matchList ? (
                            <MatchList
                                data={matchList}
                                playerPuuid={puuid}
                                gameTypeFilter={matchGamemodeFilter}
                                gameRoleFilter={matchRoleFilter}
                            />
                        ) : (
                            <p className={styles.errorMessage}>Sorry, nothing to see...</p>
                        )}

                        { !isBusy ? (
                            <p className={styles.demoModeText}>Load more button is disabled on demo mode</p>
                            // <button
                            //     className={styles.loadButton}
                            //     disabled={isBusy}
                            //     onClick={loadButton}
                            //     title={
                            //         isBusy ? "" : `Load 20 more matches`}
                            //     style={
                            //         isBusy ? { filter: 'brightness(0.8)' } : {}
                            //     }
                            // >
                            //     Load More...
                            // </button>
                        ) : (
                            <div className={styles.throbberContainer}>
                                <div className={styles.throbber}></div>
                            </div>

                        )
                        }

                    </div>
                </div>
            </div>

            <br/>
            <br/>
            <br/>
        </div>
    );
}
