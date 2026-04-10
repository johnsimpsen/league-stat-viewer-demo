import * as apiConfig from "@/api/config.json";
import * as StatsLoader from "@/pages/Stats.loader";
import React from "react";
import * as ReactRouter from "react-router";
import styles from "./Search.module.css";

interface Props {
    viewTransition?: boolean;
}

export default function Search({ viewTransition }: Props) {
    const riotIdRef = React.useRef<HTMLInputElement>(null);
    const matchCountRef = React.useRef<HTMLInputElement>(null);

    const navigate = ReactRouter.useNavigate();
    const loader: StatsLoader.Data | null = ReactRouter.useLoaderData();
    const [searchParams] = ReactRouter.useSearchParams();

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter")
            search(riotIdRef, matchCountRef, navigate, viewTransition);
    }

    function handleClick() {
        //Disabled for demo mode
       // search(riotIdRef, matchCountRef, navigate, viewTransition);

        //Navigate to demo page instead
        navigate(
            "/stats/ItsJohnny5#gay"
        );

    }

    return (
        <div className={styles.search}>
            <ReactRouter.Link className={styles.title} to="/">
                League of Legends Search
            </ReactRouter.Link>
            <LabelledInput
                ref={riotIdRef}
                id="riotIdInput"
                placeholder="DEMO MODE"
                type="text"
                defaultValue="DEMO MODE"
                onKeyDown={handleKeyDown}
            >
                Riot ID:
            </LabelledInput>
            {/*Temporarily removed*/}
            {/*<LabelledInput*/}
            {/*    ref={matchCountRef}*/}
            {/*    id="matchCountInput"*/}
            {/*    placeholder={apiConfig.defaultMatchCount.toString()}*/}
            {/*    type="number"*/}
            {/*    defaultValue={searchParams.get("matchCount") ?? ""}*/}
            {/*    onKeyDown={handleKeyDown}*/}
            {/*>*/}
            {/*    Matches to show:*/}
            {/*</LabelledInput>*/}
            <button className={styles.interactable} onClick={handleClick}>
                Search
            </button>
        </div>
    );
}

interface LabelledInputProps {
    ref: React.RefObject<HTMLInputElement | null>;
    id: string;
    placeholder: string;
    type: React.HTMLInputTypeAttribute;
    defaultValue: string | number | readonly string[];
    onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
}

function LabelledInput({
    ref,
    id,
    placeholder,
    type,
    defaultValue,
    onKeyDown,
    children,
}: React.PropsWithChildren<LabelledInputProps>) {
    return (
        <div className={styles.labelledInput}>
            <label htmlFor={id}>{children}</label>
            <input
                className={styles.interactable}
                ref={ref}
                id={id}
                placeholder={placeholder}
                type={type}
                defaultValue={defaultValue}
                onKeyDown={onKeyDown}
            />
        </div>
    );
}

function search(
    riotIdRef: React.RefObject<HTMLInputElement | null>,
    matchCountRef: React.RefObject<HTMLInputElement | null>,
    navigate: ReactRouter.NavigateFunction,
    viewTransition?: boolean
) {
    const riotId = encodeURIComponent(riotIdRef.current?.value ?? "");
    const matchCount =
        matchCountRef.current?.valueAsNumber || apiConfig.defaultMatchCount;
    navigate(
        `/stats/${riotId}${matchCount ? `?matchCount=${matchCount}` : ""}`,
        { viewTransition }
    );
}
