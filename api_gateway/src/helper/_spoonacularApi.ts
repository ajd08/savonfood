import { parse } from "recipe-ingredient-parser-v2";
import { getIngredientsByStoreId } from "../helper/_postgraphile";
import { logger } from "../logger/config";

const axios = require("axios");

const apiKeys: string[] = [
    //"766e0045c601414e9ec04bd9fa363a9f",
    //"b75d71f41f7e437fa334d2aff5b5c568",
    //"2f690765657c46a985f0cd65028fc4fa",
    //"482150f6d831442382adfaf9a8e2085c",
    //"a0cba7000d3042c3bbc1a59ab7b28add",
    "925e595bb1fe4c0faad62aa1b8dc6d4f",
    "3967327a427648f6a41f8fd5c7583da7",
    "12b44df98e774449b7e4075a7cbaf8c5"
];

interface Options {
    method: string;
    url: string;
    data: any;
}
const axiosRequest = async (options: Options) => {
    const url_SELECTOR = options.url;
    for (let i = 0; i < apiKeys.length; i++) {
        let api_key: string = apiKeys[i];
        let url = url_SELECTOR.replace("$APIKEY", api_key);
        options.url = url;
        try {
            logger.log("info", "URL USED: " + options.url);
            const response = await axios(options);
            const data = response.data;
            logger.info(
                "(" +
                    (i).toString() +
                    "/" +
                    apiKeys.length.toString() +
                    ") api keys used!"
            );
            return data;
        } catch (e) {
            logger.error("API Key out of juice: " + api_key, e);
            //throw new Error("Error at axios request ->" + e);
            continue;
        }
    }
    throw new Error("All API keys used");
};
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

export { getRecipes, getRecipe, getProductInfo, apiKeys };
