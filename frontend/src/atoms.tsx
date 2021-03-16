import React from "react";
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from "recoil";
import { useHistory } from "react-router-dom";

const axios = require("axios");

const locationState = atom({
    key: "locationState",
    default: "",
});

const counterState = atom({
    key: "counterState",
    default: 0,
});

const locationSearchState = selector({
    key: "locationSearchState",

    get: async ({ get }) => {
        const location = get(locationState);
        const recipes = get(currentRecipesQuery);
        if(location!="" && recipes!=[]) {
            return false;
        }
    },
});

const currentRecipesQuery = selector({
    key: "currentRecipes",
    get: async ({ get }) => {
        const location = get(locationState);
        const response = await axios({
            method: "get",
            url: "http://localhost:8080/?postalcode=" + location,
        });
        return response.data;
    },
});

export {
    locationState,
    locationSearchState,
    currentRecipesQuery,
};
