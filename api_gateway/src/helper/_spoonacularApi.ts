import { parse } from "recipe-ingredient-parser-v2";
import { logger } from "../logger/config";
import {axiosRequest} from "./axiosRequestHandler";

interface Options {
    method: string;
    url: string;
    data: any;
}

/**
 * Return all data about a grocery item
 *
 * @remarks
 * This is our spoontacular utilities lib for shared projects.
 *
 * @param item_title - the title of the grocery item
 *
 * @returns data based on 'item_title'
 */
const getProductInfo = async (item_title: string) => {
    const product_url: string =
        "https://api.spoonacular.com/food/products/classify?apiKey=$APIKEY";

    const options = {
        url: product_url,
        method: "POST",
        data: {
            title: item_title,
            upc: "",
            plu_code: "",
        },
    };
    try {
        const data = await axiosRequest(options);
        return data;
    } catch (e) {
        logger.error("getProductInfo not working ->", e);
        throw e;
    }
};

/**
 * Return all possible recipes from grocery items from a store
 * based on store id.
 *
 * @remarks
 * This is our spoontacular utilities lib for shared projects.
 *
 * @param numRecipes - the number of recipes to return
 * @param ingredients - list of all possible ingredients
 *
 * @returns list of recipes
 */
const getRecipes = async (numRecipes: number, ingredients: string[]) => {
    const num: string = numRecipes.toString();

    let url: string =
        "https://api.spoonacular.com/recipes/findByIngredients?apiKey=$APIKEY&ingredients=";

    if (ingredients.length > 0) {
        for (let i = 0; i < ingredients.length; i++) {
            if (i == 0) {
                url += ingredients[i].replace(" ", "%20");
            } else {
                url += ",+" + ingredients[i].replace(" ", "%20");
            }
        }

        url += "&number=" + num + "&type=soup";
    }

    const options: Options = {
        method: "get",
        url: url,
        data: {},
    };

    try {
        const data = await axiosRequest(options);
        logger.info("Got all RECIPES!!");
        return data;
    } catch (e) {
        logger.error("error for getRecipes", e);
        throw e;
    }
};

/**
 * Returns data on a recipe based on the recipe ID.
 *
 * @remarks
 * This is our spoontacular utilities lib for shared projects.
 *
 * @param recipeID - the id of the recipe that needs data
 *
 * @returns data on specified recipe
 */
const getRecipe = async (recipeID: number) => {
    const url: string =
        "https://api.spoonacular.com/recipes/" +
        recipeID.toString() +
        "/information?apiKey=$APIKEY";

    const options: Options = {
        method: "get",
        url: url,
        data: {},
    };

    try {
        const data = await axiosRequest(options);
        logger.info("Got recipe succeess!! ->" + url);
        return data;
    } catch (e) {
        logger.error("error for getRecipes", e);
        throw e;
    }
};

export { getRecipes, getRecipe, getProductInfo };
