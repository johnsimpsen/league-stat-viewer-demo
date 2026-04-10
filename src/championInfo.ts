//Module for anything using champion.json

import championData from "./resources/champion.json";

type Champion = {
    id: string; //champion's name
    key: string; //champion's number
    name: string; //champion's display name
    image: any; //used for image data (use image.full for name.png)
};

//parse the json for needed info
const data = Object.values(championData.data) as Champion[];

export function getChampionNameFromKey(championKey: string | number): string {
    championKey = String(championKey);

    for (const champ of Object.values(data)) {
        if (champ.key === championKey) {
            return champ.name;
        }
    }

    //default return case for "0.png"
    return "0";
}

export function getChampionIdFromKey(championKey: string | number): string {
    championKey = String(championKey);

    for (const champ of Object.values(data)) {
        if (champ.key === championKey) {
            return champ.id;
        }
    }

    //default return case for "0.png"
    return "0";
}

export function getChampionNameFromId(championId: string | number): string {
    championId = String(championId);

    for (const champ of Object.values(data)) {
        if (champ.id.toLowerCase() === championId.toLowerCase()) {
            return champ.name;
        }
    }

    //default return case for "0.png"
    return "0";
}

export function getChampionImageFromId(championId: string | number): string {
    championId = String(championId);

    for (const champ of Object.values(data)) {
        if (champ.id.toLowerCase() === championId.toLowerCase()) {
            return champ.image.full;
        }
    }

    //default return case for "0.png"
    return "0.png"
}
