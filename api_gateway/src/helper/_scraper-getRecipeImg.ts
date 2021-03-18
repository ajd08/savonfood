import { remove_stopwords } from "./_misc";

const puppeteer = require("puppeteer");

const waitTime = 2000;
const waitTimeClickSameUrl = 200;

//const IMG_SELECTOR = "img[alt*='Middle Easter Chicken']";

const IMG_SELECTOR = "img[alt*='$TITLE']";

const getImageURL = async (title: string, recipe_url: string) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(recipe_url, { waitUntil: "networkidle0" });
    } catch (e) {
        console.log("page " + recipe_url + " didn't load!")
    }

    title = remove_stopwords(title);
    console.log(title);

    let key_words = title.split(" ");

    for (let i = 0; i < key_words.length; i++) {

        let img_selector = IMG_SELECTOR.replace("$TITLE", key_words[i]);
        try {
            await page.waitForSelector(img_selector, { timeout: 5000 });
            console.log("found the selector!");

            const recipe_img_src = await page.evaluate((sel: string) => {
                const element = document.querySelector(sel);
                return element ? element?.getAttribute("src") : null;
            }, img_selector);
            console.log("IMG URL FOUND: " + recipe_img_src);
            browser.close();

            return recipe_img_src;
        } catch (e) {
        }
    }
    browser.close();
    return "";
};

export {getImageURL};

//run(
//    "Middle Eastern Chicken and Couscous Wraps with Goat Cheese",
//    "http://www.halfbakedharvest.com/middle-eastern-chicken-couscous-wraps-goat-cheese/"
//);
//
//run(
//    "Mulligatawny and Green Raita",
//    "http://www.foodnetwork.com/recipes/rachael-ray/mulligatawny-and-green-raita-recipe.html"
//);
//run(
//    "Turmeric Chicken Kebabs over Basmati Rice with Charred Scallions",
//    "http://nourishedkitchen.com/turmeric-chicken-kebabs-over-basmati-rice-with-charred-scallions/"
//);
//run(
//    "Smoked Meatball Sandwiches",
//    "http://www.vindulgeblog.com/2015/06/smoked-meatball-sandwiches/"
//);
//run("Chicken", "http://www.melskitchencafe.com/chicken-tikka-pizzas/");
//run("Baked Ravioli", "https://lifemadesimplebakes.com/baked-ravioli/");
