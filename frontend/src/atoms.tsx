import React from "react";
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
} from "recoil";
import { useHistory } from "react-router-dom";
import { recoilPersist } from "recoil-persist";

const axios = require("axios");
const  { persistAtom } = recoilPersist();

const locationState = atom({
    key: "locationState",
    default: "",
    effects_UNSTABLE: [persistAtom],
});

const locationSearchState = selector({
    key: "locationSearchState",

    get: async ({ get }) => {
        const location = get(locationState);
        const recipes = get(currentRecipesQuery);
        if (location != "" && recipes != []) {
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

const selectedRecipePositionState = atom({
    key: "recipePositionState",
    default: 0,
});

const selectedRecipeState = selector({
    key: "selectedRecipeState",
    get: async ({ get }) => {
        const allRecipes = get(currentRecipesQuery);
        const recipePos = get(selectedRecipePositionState);
        if (allRecipes != []) {
            return allRecipes[recipePos];
        }
        return null;
    },
});

export {
    locationState,
    locationSearchState,
    currentRecipesQuery,
    selectedRecipeState,
    selectedRecipePositionState
};
