import { createStore } from "../helper/_postgraphile";
const puppeteer = require("puppeteer");

const nofrills_getStores = async() => {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    console.log("Opening a new page!");
    try {
        await page.goto("https://www.nofrills.ca/store-locator?searchQuery=scarborough&type=store", { waitUntil: "networkidle0" });
    } catch (err) {
        alert(err);
    }

    await page.waitForTimeout(5000);

    try {
        await page.goto("https://www.nofrills.ca/store-locator?searchQuery=scarborough&type=store", { waitUntil: "networkidle0" });
    } catch (err) {
        alert(err);
    }

    await page.waitForTimeout(5000);

    console.log("time to start collecting!");

    const LOCATION_LIST_SELECTOR = "#store-locator > div > div.store-locator__content > div > div.store-locator-content__list > ul";

    const numStores = await page.evaluate((sel: string) => {
        const element = document.querySelector(sel);
        return element ? element?.childElementCount : null;
    }, LOCATION_LIST_SELECTOR);
    console.log("numStores: " + numStores);

    let STORE_NAME_SELECTOR = "#store-locator > div > div.store-locator__content > div > div.store-locator-content__list > ul > li:nth-child($NUM_CHILD) > div > div.location-list-item__info > div.location-list-item__info__details > div > h4";
    let STORE_STREET_ADDRESS_SELECTOR = "#store-locator > div > div.store-locator__content > div > div.store-locator-content__list > ul > li:nth-child($NUM_CHILD) > div > div.location-list-item__info > div.location-list-item__info__details > div > div.location-list-item-details__address > address > div.location-address__line.location-address__line--line-1";
    let STORE_REGION_SELECTOR = "#store-locator > div > div.store-locator__content > div > div.store-locator-content__list > ul > li:nth-child($NUM_CHILD) > div > div.location-list-item__info > div.location-list-item__info__details > div > div.location-list-item-details__address > address > div.location-address__line.location-address__line--region";

    for(let i=1;i<=numStores;i++) {
        let store_name_selector= STORE_NAME_SELECTOR.replace("$NUM_CHILD", i.toString()); 
        let store_street_address_selector = STORE_STREET_ADDRESS_SELECTOR.replace("$NUM_CHILD", i.toString()); 
        let store_region_selector = STORE_REGION_SELECTOR.replace("$NUM_CHILD", i.toString()); 

        let store_name: string = await page.evaluate((sel: string) => {
            const element = document.querySelector(sel);
            return element ? element?.textContent.replace("'", "\'") : "";
        }, store_name_selector);
        console.log(store_name);

        let street_address:string = await page.evaluate((sel: string) => {
            const element = document.querySelector(sel);
            return element ? element?.textContent : "";
        }, store_street_address_selector);

        let region = await page.evaluate((sel: string) => {
            const element = document.querySelector(sel);
            return element ? element?.textContent : "";
        }, store_region_selector);

        let city:string = region.trim().split(",")[0].trim();
        region = region.trim().split(",")[1].trim();
        let province:string = region.substr(0, region.length-7).trim();
        let postal_code:string = region.substr(region.length-7);

        console.log("store name: " + store_name);
        console.log("street address: " + street_address);
        console.log("city: " + city);
        console.log("province: " + province);
        console.log("postal_code: " + postal_code);
        console.log("created!");
        createStore("nofrills", store_name, street_address, city, province, postal_code);
        console.log("=================================================================");
    }
};

nofrills_getStores();
