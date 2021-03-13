import { parse } from "recipe-ingredient-parser-v2";
import { getIngredientsByStoreId } from '../helper/_postgraphile';

const axios = require("axios");
const winston= require("winston");

const api_key: string = "766e0045c601414e9ec04bd9fa363a9f";
let product_url: string =
    "https://api.spoonacular.com/food/products/classify?apiKey=766e0045c601414e9ec04bd9fa363a9f";

type ProductInfo = {
    title: string;
    upc: string;
    plu_code: string;
};

export const getProductInfo = async (item_title: string) => {
    let info: ProductInfo = {
        title: item_title,
        upc: "",
        plu_code: "",
    };

    let product_info = axios
        .post(product_url, info)
        .then(function (response) {
            return response.data;
        })
        .catch((e) => {
            winston.log("error", "cant get product info from db");
            return e;
        });
    return product_info;
};

export const getRecipes = async (numRecipes: number) => {
    let ingredients = await getIngredientsByStoreId(438);
    let num: string = numRecipes.toString();

    let url: string = "https://api.spoonacular.com/recipes/complexSearch?apiKey=" + api_key + "&ingredients=";

    let url2: string = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" + api_key + "&ingredients=";

    if (ingredients.length > 0) {
        for (let i = 0; i < ingredients.length; i++) {
            if(i==0) {
                url2+= ingredients[i].replace(" ", "%20");
            }
            else {
                url2+= ",+" + ingredients[i].replace(" ", "%20");
            }
        }

        url2+="&number=" + num + "&type=soup";
    }
    console.log(url2);

    let recipe = axios
        .get(url2)
        .then(function (response) {
            console.log(response.data,null,2);
            //console.log(response.data);
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
            return null;
        });
    return recipe;
};

export const getRecipe = async () => {
    let url: string = "https://api.spoonacular.com/recipes/1426909/information?apiKey=" + api_key;

    let recipe = axios
        .get(url)
        .then(function (response) {
            console.log(JSON.stringify(response.data,null,2));
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
            return null;
        });
    return recipe;
};
//getRecipes(9);
//getRecipe();

