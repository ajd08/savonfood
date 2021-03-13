import { parse } from "recipe-ingredient-parser-v2";
import { getIngredientsByStoreId } from "../helper/_postgraphile";
import { logger } from "../logger/config";

const axios = require("axios");

const apiKeys: string[] = [
    "766e0045c601414e9ec04bd9fa363a9f",
    "b75d71f41f7e437fa334d2aff5b5c568",
    "2f690765657c46a985f0cd65028fc4fa",
    "482150f6d831442382adfaf9a8e2085c",
];
const api_key: string = "766e0045c601414e9ec04bd9fa363a9f";
/**
 * Returns a usable api key
 *
 * @remarks
 * This is our spoontacular utilities lib for shared projects.
 *
 * @returns a usable api key
 */
const getApiKey = async () => {
    for (let i = 0; i < apiKeys.length; i++) {
        let api_key = apiKeys[i];

        let test_url: string =
            "https://api.spoonacular.com/recipes/convert?apiKey=" +
            api_key +
            "&ingredientName=flour&sourceAmount=2.5&sourceUnit=cups&targetUnit=grams";
        try {
            const response = await axios.get(test_url);
            const data = JSON.stringify(response.data, null, 2);
            logger.info("("+ (i+1).toString() + "/" + apiKeys.length.toString() + ") api keys used!") ;
            return api_key;
        } catch (e) {
            logger.error("API Key out of juice: " + api_key);
        }
    }
    throw new Error("All keys ran out of juice!");
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
        "https://api.spoonacular.com/food/products/classify?apiKey=766e0045c601414e9ec04bd9fa363a9f";

    const options = {
        url: product_url,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
            title: item_title,
            upc: "",
            plu_code: "",
        },
    };
    try {
        const response = await axios(options);
        const data = JSON.stringify(response.data, null, 2);
        logger.info(data);
        return data;
    } catch (e) {
        logger.error("getProductInfo not working", e);
        return e;
    } finally {
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

    const url: string =
        "https://api.spoonacular.com/recipes/complexSearch?apiKey=" +
        api_key +
        "&ingredients=";

    let url2: string =
        "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" +
        api_key +
        "&ingredients=";

    if (ingredients.length > 0) {
        for (let i = 0; i < ingredients.length; i++) {
            if (i == 0) {
                url2 += ingredients[i].replace(" ", "%20");
            } else {
                url2 += ",+" + ingredients[i].replace(" ", "%20");
            }
        }

        url2 += "&number=" + num + "&type=soup";
    }
    console.log(url2);

    try {
        const response = await axios.get(url2);
        const recipes = JSON.stringify(response.data, null, 2);
        logger.log("info", recipes);
        return recipes;
    } catch (e) {
        return e;
    } finally {
        logger.log("info", "getProductInfo: DONE!");
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
        "/information?apiKey=" +
        api_key;
    try {
        const response = await axios.get(url);
        const recipe = response.data;
        return recipe;
    } catch (e) {
        return e;
    } finally {
        logger.log("info", "getRecipe: DONE!");
    }
};

export { getRecipes, getRecipe, getProductInfo, getApiKey };
