import { delay } from "./utilities";
const puppeteer = require("puppeteer");

const waitTime = 2000;
const waitTimeClickSameUrl = 200;

const nearest_store_id: number = 438;

interface GroceryItem {
    title: string;
    price: string;
    start_date: string;
    end_date: string;
}
const options = {
    executablePath: "/usr/bin/chromium-browser" || null,
    args: ["--no-sandbox", "--headless", "--disable-gpu"],
    headless: true,
};

const iframe_selectors = {
    LIST_ITEM_BUTTON_SELECTOR:
        "#accessibilityList > li:nth-child(INDEX) > button",
    ITEM_TITLE_SELECTOR:
        "body > div.modal-dialog-content.goog-modalpopup.wishabi-modal-pop.item-details > div > div > div > div.v2_popup_content_wrap > div > div.v2_item_content_wrapper > div > div > div:nth-child(1) > div.name",
    ITEM_PREPRICE_SELECTOR:
        "body > div.modal-dialog-content.goog-modalpopup.wishabi-modal-pop.item-details > div > div > div > div.v2_popup_content_wrap > div > div.v2_item_content_wrapper > div > div > div:nth-child(1) > div.price > span.price_text.pre_price_text",
    ITEM_PRICE_SELECTOR:
        "body > div.modal-dialog-content.goog-modalpopup.wishabi-modal-pop.item-details > div > div > div > div.v2_popup_content_wrap > div > div.v2_item_content_wrapper > div > div > div:nth-child(1) > div.price > span.big_price",
    ITEM_POSTPRICE_SELECTOR:
        "body > div.modal-dialog-content.goog-modalpopup.wishabi-modal-pop.item-details > div > div > div > div.v2_popup_content_wrap > div > div.v2_item_content_wrapper > div > div > div:nth-child(1) > div.price > span.price_text.post_price_text",
    ITEM_DATE_SELECTOR:
        "body > div.modal-dialog-content.goog-modalpopup.wishabi-modal-pop.item-details > div > div > div > div.v2_popup_content_wrap > div > div.v2_item_content_wrapper > div > div > div:nth-child(1) > div.validity",
};

const nofrills = {
    LOCATION_INPUT_SELECTOR: "",
    LOCATION_INPUT_ENTER_SELECTOR: "",
    FLYER_LOCALE_SELECTOR:
        "#other_flyer_runs > div.white-label-flyer-select-container.secondary_theme_background > div.wl-flyer-selector-main > ul > li:nth-child(2) > a",
};

const metro = {
    LOCATION_INPUT_SELECTOR: "",
    LOCATION_INPUT_ENTER_SELECTOR: "",
    FLYER_LOCALE_SELECTOR:
        "#other_flyer_runs > div > div > div > div.other_flyer_runs_wrapper > table > tbody > :first-child > td.info > a",
};

const food_basics = {
    LOCATION_INPUT_SELECTOR:
        "#get_location > div > div.enter_postal_code > form > div:nth-child(3) > div > div.postal_code > div > input",
    LOCATION_INPUT_ENTER_SELECTOR:
        "#get_location > div > div.enter_postal_code > form > div:nth-child(3) > div > div.submit_postal_code_btn.btn_green > input",
    FLYER_LOCALE_SELECTOR:
        "#get_location > div > div.store_select_area_wrapper.js_store_select_area_wrapper > div > div > table > tbody > tr:nth-child(1) > td:nth-child(3) > form > button",
};

const flyer_scraper = async (
    store: {
        LOCATION_INPUT_SELECTOR?: string;
        LOCATION_INPUT_ENTER_SELECTOR?: string;
        FLYER_LOCALE_SELECTOR?: string;
    },
    flyerUrl: string,
    postal_code: string
) => {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();

    try {
        await page.goto(flyerUrl, { waitUntil: "networkidle0" });
    } catch (err) {
        alert(err);
    }

    if (store.LOCATION_INPUT_SELECTOR != "") {
        await page.type(store.LOCATION_INPUT_SELECTOR, postal_code);
        await page.click(store.LOCATION_INPUT_ENTER_SELECTOR, {
            waitUntil: "networkidle0",
        });
        await delay(waitTime);
        //await page.waitForTimeout(waitTime);
    }
    try {
        await page.click(store.FLYER_LOCALE_SELECTOR, {
            waitUntil: "networkidle0",
        });
    } catch {
        console.log("NO OPTION FOR OTHER FLYER");
    }

    //await delay(waitTime);
    //await page.waitForTimeout(waitTime);

    const LIST_ITEM_SELECTOR = "#accessibilityList";

    const numItems = await page.evaluate((sel: string) => {
        const element = document.querySelector(sel);
        return element ? element?.childElementCount : null;
    }, LIST_ITEM_SELECTOR);

    console.log("SCRAPER: Total items in flyer: " + numItems);

    const groceryItems: GroceryItem[] = [];

    for (let i = 1; i < numItems; i++) {
        const listItemButtonSelector = iframe_selectors.LIST_ITEM_BUTTON_SELECTOR.replace(
            "INDEX",
            i.toString()
        );

        await page.evaluate((sel: string) => {
            const element: HTMLElement = document.querySelector(
                sel
            ) as HTMLElement;
            element?.click();
        }, listItemButtonSelector);

        await page.waitForSelector(iframe_selectors.ITEM_TITLE_SELECTOR);

        const item_title = await page.evaluate((sel: string) => {
            const element = document.querySelector(sel);
            return element ? element?.textContent : null;
        }, iframe_selectors.ITEM_TITLE_SELECTOR);

        if (item_title === null) {
            continue;
        }

        const item_price: string = await page.evaluate(
            (sel: string) => {
                const element_prePrice = document.querySelector(sel[0]);
                const element_Price = document.querySelector(sel[1]);
                const element_postPrice = document.querySelector(sel[2]);

                const prePriceText: string = element_prePrice
                    ? element_prePrice.textContent?.trim()!
                    : "";
                const priceText: string = element_Price
                    ? element_Price.getAttribute("aria-label")?.trim()!
                    : "";
                const postPriceText: string = element_postPrice
                    ? element_postPrice.textContent?.trim()!
                    : "";

                const price: string =
                    prePriceText + " " + priceText + " " + postPriceText;
                return price;
            },
            [
                iframe_selectors.ITEM_PREPRICE_SELECTOR,
                iframe_selectors.ITEM_PRICE_SELECTOR,
                iframe_selectors.ITEM_POSTPRICE_SELECTOR,
            ]
        );

        const dates: string[] = await page.evaluate((sel: string) => {
            const element = document.querySelector(sel);
            return element
                ? element.textContent?.trim()?.substring(6)?.split(" - ")
                : ["", ""];
        }, iframe_selectors.ITEM_DATE_SELECTOR);

        const start_date = dates[0];
        const end_date = dates[1];

        const same_price_items: string[] = item_title.split("or");

        for (let j = 0; j < same_price_items.length; j++) {
            const item = same_price_items[j]?.trim();

            groceryItems.push({
                title: item,
                price: item_price,
                start_date,
                end_date,
            });

            console.log("item_title: " + item);
            // console.log("item_category: " + item_category);
            console.log("item_price: " + item_price);
            console.log("start_date: " + start_date);
            console.log("end_date: " + end_date);
            console.log(
                "===================item: " + i + "====================="
            );
        }
    }

    await browser.close();
    return groceryItems;
};

const nofrills_flyer_crawler = async (postal_code: string) => {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto(
        "https://www.nofrills.ca/print-flyer?query=" + postal_code,
        { waitUntil: "networkidle0" }
    );

    const FLYER_BUTTON_SELECTOR =
        "#site-content > div > div > div > div > div.flyers-location-search-content > div.flyers-location-search-content__items > div:nth-child(1) > div > div.flyers-location-search-item__main__content > button";

    await page.waitForSelector(FLYER_BUTTON_SELECTOR);

    await page.click(FLYER_BUTTON_SELECTOR, { waitUntil: "load" });

    const FLYER_IFRAME_SELECTOR = "iframe#flipp-iframe";

    await page.waitForSelector(FLYER_IFRAME_SELECTOR);

    console.log("CRAWLER: Opening flyer");
    const flyer_link = await page.evaluate((sel: string) => {
        return document.querySelector(sel)?.getAttribute("src")?.toString();
    }, FLYER_IFRAME_SELECTOR);
    console.log("CRAWLER: FLYER OPENED at " + flyer_link);

    await browser.close();

    return flyer_scraper(nofrills, flyer_link, postal_code);
};

const metro_flyer_crawler = async (postal_code: string) => {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto("https://www.metro.ca/en/find-a-grocery", {
        waitUntil: "networkidle0",
    });
    console.log("finding a grocery in your location...");
    const LOCATION_INPUT_SELECTOR = "#postalCode";

    console.log("typing in postal code...");
    await page.type(LOCATION_INPUT_SELECTOR, postal_code);

    const LOCATION_BUTTON_SELECTOR = "#submit";

    await page.click(LOCATION_BUTTON_SELECTOR, { waitUntil: "load" });

    //await page.waitForTimeout(waitTime);
    await delay(waitTime);

    console.log("saving location...");
    const LOCATION_SAVE_SELECTOR =
        "#mapResults > li:nth-child(1) > div.white-wrapper > div > div.row.no-gutters.justify-content-between.align-items-center > div:nth-child(1) > button";

    await page.click(LOCATION_SAVE_SELECTOR);
    await page.waitForNavigation({
        waitUntil: "networkidle0",
    });

    console.log("location save selector clicked!");

    await page.goto("https://www.metro.ca/en/flyer");

    console.log("went to the link!");

    console.log("Loading Iframe link");
    const flyer_link = await page.evaluate(() => {
        const FLYER_IFRAME_SELECTOR = "#flipp-iframe";
        return document
            .querySelector(FLYER_IFRAME_SELECTOR)
            ?.getAttribute("src")
            ?.toString();
    });
    console.log("Iframe link received!");

    console.log("going to iframe link...");
    console.log("iframe link: " + flyer_link);
    await page.goto(flyer_link, { waitUntil: "networkidle0" });
    //await page.waitForTimeout(waitTime);
    await delay(waitTime);
    await browser.close();

    console.log("closing browser");

    flyer_scraper(metro, flyer_link, postal_code);
};

const food_basics_crawler = async (postal_code: string) => {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto("https://www.foodbasics.ca/flyer.en.html", {
        waitUntil: "networkidle0",
    });

    //await page.waitForTimeout(waitTime);
    await delay(waitTime);

    console.log("Loading Iframe link");
    const flyer_link = await page.evaluate(() => {
        const FLYER_IFRAME_SELECTOR = "#flipp-iframe";
        return document
            .querySelector(FLYER_IFRAME_SELECTOR)
            ?.getAttribute("src")
            ?.toString();
    });
    console.log("Iframe link received!");
    console.log(flyer_link);

    await page.goto(flyer_link, { waitUntil: "networkidle0" });
    //await page.waitForTimeout(waitTime);
    await delay(waitTime);
    await browser.close();

    flyer_scraper(food_basics, flyer_link, postal_code);
};

export { nofrills_flyer_crawler };
