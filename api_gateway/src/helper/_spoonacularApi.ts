import { parse } from "recipe-ingredient-parser-v2";
import { getIngredientsByStoreId } from "../helper/_postgraphile";
import { logger } from "../logger/config";

const axios = require("axios");

const api_key: string = "766e0045c601414e9ec04bd9fa363a9f";
let product_url: string =
    "https://api.spoonacular.com/food/products/classify?apiKey=766e0045c601414e9ec04bd9fa363a9f";

const getProductInfo = async (item_title: string) => {

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
        const data = response.data.category;
        return data;
    } catch (e) {
        return e;
    } finally {
    }
};

const getRecipes = async (numRecipes: number) => {
    let ingredients = await getIngredientsByStoreId(438);
    let num: string = numRecipes.toString();

    let url: string =
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
        const recipe = JSON.stringify(response.data, null, 2);
        logger.log("info", recipe);
        return recipe;
    } catch (e) {
        return e;
    } finally {
        logger.log("info", "getProductInfo: DONE!");
    }
};

const getRecipe = async () => {
    let url: string =
        "https://api.spoonacular.com/recipes/1426909/information?apiKey=" +
        api_key;
    try {
        const response = await axios.get(url);
        const recipe = JSON.stringify(response.data, null, 2);
        logger.log("info", recipe);
        return recipe;
    } catch (e) {
        return e;
    } finally {
        logger.log("info", "getProductInfo: DONE!");
    }
};

export { getRecipes, getRecipe, getProductInfo };
