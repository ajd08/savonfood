import express from "express";
import { logger } from "./logger/config";
import { getNoFrillsLocation } from "./helper/_scraper-getPostalCode";
import {
    getStoreIDByPostalCodeAndCompanyName,
    getIngredientsByStoreId,
    queryRecipesByPostalCode,
    createRecipes,

} from "./helper/_postgraphile";
import {
    getRecipes,
    getRecipe,
    getProductInfo,
} from "./helper/_spoonacularApi";
import {checkRecipeStopWords} from "./helper/checkRecipeStopWords";
import {getImageURL} from "./helper/_scraper-getRecipeImg";
import {getRecipeMetaData} from "./helper/_misc";
import {getTestStore} from "./helper/tests/_postgraphile.test";

var cors = require('cors');

const app = express();
const port = 8080; // default port to listen

app.use(cors());

// define a route handler for the default home page
app.get("/", async (req, res, next) => {
    const postalCode:string = req.query.postalcode.toString();

    //if the submitted an empty string
    if(postalCode=="") {
        res.send([]);
        return;
    }

    //check if there are already recipes in the database for postalcode specified
    //
    console.log("BEFORE GETTING THE RECIPES...");

    const queryRecipe_response = await queryRecipesByPostalCode(postalCode);

    console.log("GETTING THE RECIPES...");

    //recipes exist for the postal code
    let recipe_data = queryRecipe_response.data.recipes.edges;
    logger.info("this is the recipe_data: " + JSON.stringify(recipe_data));
    if(recipe_data!="") {
        let recipes = recipe_data.map((recipe:any)=>recipe.node.info);
        res.send(recipes);
        return;
    }

    //list of all the stores
    let stores_id: number[] = [];


    //CASE: Recipes for this postal code have not been entered into the db yet
    try {
        logger.info("GETTING THE NEAREST NO FRILLS POSTAL CODE");
        let nofrills_postalCode: string = await getNoFrillsLocation(postalCode);
        let nofrills_storeID: number = await getStoreIDByPostalCodeAndCompanyName(
            nofrills_postalCode,
            "nofrills"
        );
        let ingredients_list: string[] = [];
        let ingredients_list_nofrills = await getIngredientsByStoreId(
            nofrills_storeID
        );
        ingredients_list = ingredients_list.concat(ingredients_list_nofrills);
        logger.info(ingredients_list);

        let recipes = await getRecipes(10, ingredients_list);

        logger.info("THIS IS THE RECIPES");
        console.log(recipes);


        recipes = recipes.filter((recipe: any) => checkRecipeStopWords(recipe.title));

        recipes = await Promise.all(
            recipes.map(async (recipe: any) => {
                let id: number = recipe.id;
                let recipe_fullDetails = await getRecipe(id);
                let summary: string = recipe_fullDetails.summary;
                let sourceUrl = recipe_fullDetails.sourceUrl;
                let img: string = await getImageURL(recipe.title, sourceUrl);
                let recipeMetaData = getRecipeMetaData(summary);

                if(img!="") {
                    recipe.image = img;
                }
                else {
                    recipe.image = recipe_fullDetails.image;
                }
                return {
                    ...recipe,
                    readyInMinutes: recipe_fullDetails.readyInMinutes,
                    servings: recipe_fullDetails.servings,
                    sourceUrl: sourceUrl,
                    summary: summary,
                    image: recipe.image,
                    instructions: recipe_fullDetails.analyzedInstructions,
                    protein: recipeMetaData.protein,
                    calories: recipeMetaData.calories,
                    servings_nutrition: recipeMetaData.serving,
                    fat: recipeMetaData.fat,
                };
            })
        );
        recipes = recipes.slice(0,6);

        for(let i=0;i<recipes.length;i++) {
            logger.info(JSON.stringify(recipes[i]));
            await createRecipes(postalCode,recipes[i]);
        }

        const queryRecipe_response = await queryRecipesByPostalCode(postalCode);
        let recipe_data = queryRecipe_response.data.recipes.edges;
        recipes = recipe_data.map((recipe:any)=>recipe.node.info);

        res.send(recipes);
    } catch (e) {
        next(e);
    }
});

app.get("/test", async(req, res) => {
    const data = await getTestStore();
    res.send(data);


});

// start the Express server
app.listen(port, () => {
    logger.info(`server started at http://0.0.0.0:${port}`);
});
