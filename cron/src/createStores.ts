import {Store, createStore} from "./_postgraphile";

const puppeteer = require("puppeteer");

const url: string =
    "https://www.nofrills.ca/store-locator?searchQuery=toronto&type=store";
const STORE_LIST_SELECTOR: string =
    "#store-locator > div > div.store-locator__content > div > div.store-locator-content__list > ul";

const STORE_NAME_SELECTOR: string = "#store-locator > div > div.store-locator__content > div > div.store-locator-content__list > ul > li:nth-child($INDEX) > div > div.location-list-item__info > div.location-list-item__info__details > div > h2";

const STORE_ADDRESS_SELECTOR: string = "#store-locator > div > div.store-locator__content > div > div.store-locator-content__list > ul > li:nth-child($INDEX) > div > div.location-list-item__info > div.location-list-item__info__details > div > div.location-list-item-details__address > address";

const LIST_ITEM_SELECTOR = "#accessibilityList";


const createStores_nofrills = async () => {
    const browser = await puppeteer.launch({
        executablePath:'/usr/bin/chromium-browser' || null,
        args: ["--no-sandbox", "--headless", "--disable-gpu"],
        headless: true,
    });

    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: "networkidle0" });
    } catch (err) {
        alert(err);
    }

    const numItems = await page.evaluate((sel: string) => {
        const element = document.querySelector(sel);
        return element ? element?.childElementCount : null;
    }, STORE_LIST_SELECTOR);

    for(let i =1;i <=numItems;i++) {
        let store_name_selector: string = STORE_NAME_SELECTOR.replace("$INDEX",i.toString());

        let store_name: string = await page.evaluate((sel: string) => {
            const element = document.querySelector(sel);
            return element ? element?.textContent : null;
        }, store_name_selector);

        store_name=store_name.trim();
        console.log(store_name);

        let store_address_selector: string = STORE_ADDRESS_SELECTOR.replace("$INDEX", i.toString());

        let store_address: string = await page.evaluate((sel: string) => {
            const element = document.querySelector(sel);
            return element ? element?.textContent : null;
        }, store_address_selector);

        let streetName: string = store_address.split(",")[0].trim();
        let city: string = store_address.split(",")[1].trim();
        let province: string = store_address.split(",")[2].trim().split(" ")[0];
        let postal_code: string = store_address.split(",")[2].trim().split(" ")[1] + store_address.split(",")[2].trim().split(" ")[2];

        console.log(streetName);
        console.log(city);
        console.log(province);
        console.log(postal_code);
        console.log("--------------------------------------------------");

        let store: Store = {
            companyName: "nofrills",
            streetName: streetName,
            name: store_name,
            province: province,
            postalCode: postal_code,
            city: city,
        }

        await createStore(store);
    }

    browser.close();
};

createStores_nofrills();
