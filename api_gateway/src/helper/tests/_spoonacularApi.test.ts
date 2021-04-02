import { getProductInfo, getRecipes, getRecipe } from "../../helper/_spoonacularApi";

//test("No API keys to use", async () => {
//    const product_url: string =
//        "https://api.spoonacular.com/food/products/classify?apiKey=$APIKEY";
//
//    const apiKeys: string[] = [];
//
//    const options = {
//        url: product_url,
//        method: "POST",
//        data: {
//            title: "SUPER HALAL WINGS",
//            upc: "",
//            plu_code: "",
//        },
//    };
//    await expect(axiosRequest(options, apiKeys)).rejects.toThrow(
//        "All API keys used"
//    );
//});
//
test("Returns wings product info", async () => {
    const data = await getProductInfo("SUPER HALAL WINGS");

    await expect(data).toMatchObject({
        breadcrumbs: ["chicken wings", "appetizer"],
        category: "chicken wings",
        cleanTitle: "Super Halal Wings",
        image:
            "https://spoonacular.com/cdn/ingredients_100x100/chicken-wings.png",
        matched: "wings",
        usdaCode: 5100,
    });
});

test("Returns recipes that contains apples", async () => {
    const ingredients=["apples"];
    const numRecipes = 1;
    const data = await getRecipes(numRecipes, ingredients);

    await expect(data).toBeDefined();
});

test("Returns one recipe by id ", async () => {
    const recipeID = 987595;
    const data = await getRecipe(recipeID);

    await expect(data).toBeDefined();
});
