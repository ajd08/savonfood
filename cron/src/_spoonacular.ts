import { parse } from "recipe-ingredient-parser-v2";
import {axiosRequest} from "./axiosRequestHandler";

const axios = require("axios");
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

    console.log(item_title);
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
       console.error("getProductInfo not working ->", e);
        throw e;
    }
};

export {getProductInfo};

