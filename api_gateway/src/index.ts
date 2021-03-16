import express from "express";
import { logger } from "./logger/config";
import { getNoFrillsLocation } from "./helper/_scraper-getPostalCode";
import {
    getStoreIDByPostalCodeAndCompanyName,
    getIngredientsByStoreId,
} from "./helper/_postgraphile";
import {
    getRecipes,
    getRecipe,
    getProductInfo,
} from "./helper/_spoonacularApi";

var cors = require('cors');

const app = express();
const port = 8080; // default port to listen

app.use(cors());

// define a route handler for the default home page
app.get("/", async (req, res, next) => {
    const postalCode = req.query.postalcode.toString();

    if(postalCode=="") {
        res.send([]);
        return;

    }

    //list of all the stores
    let stores_id: number[] = [];

    try {
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

        let recipes = await getRecipes(5, ingredients_list);

        recipes = await Promise.all(
            recipes.map(async (recipe: any) => {
                let id: number = recipe.id;
                let recipe_fullDetails = await getRecipe(id);
                return {
                    ...recipe,
                    readyInMinutes: recipe_fullDetails.readyInMinutes,
                    servings: recipe_fullDetails.servings,
                    sourceUrl: recipe_fullDetails.sourceUrl,
                    summary: recipe_fullDetails.summary,
                    instructions: recipe_fullDetails.analyzedInstructions,
                };
            })
        );

        res.send(recipes);
    } catch (e) {
        next(e);
    }
});

app.get("/test", (req, res) => {
    throw new Error("BROKEN"); // Express will catch this on its own.
});

// start the Express server
app.listen(port, () => {
    logger.info(`server started at http://localhost:${port}`);
});
