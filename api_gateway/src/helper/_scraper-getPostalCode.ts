import puppeteer from "puppeteer";
import { logger } from "../logger/config";

/**
 * Returns the postal code of the nearest nofrills store.
 *
 * @param postal_code - postal code of the user
 * @returns postal code of nearest nofrills store
 *
 */
const getNoFrillsLocation = async (postal_code: string) => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const url: string = "https://www.nofrills.ca/store-locator?type=store";
        await page.goto(url);

        const ADDRESS_INPUT_SELECTOR = "#PlacesAutocomplete__root > input";
        await page.waitForSelector(ADDRESS_INPUT_SELECTOR);
        await page.type(ADDRESS_INPUT_SELECTOR, postal_code);
        await page.keyboard.press("Enter");
        const LOCATION_SELECTOR =
            "#store-locator > div > div.store-locator__content > div > div.store-locator-content__list > ul > li:nth-child(1) > div > div.location-list-item__info > div.location-list-item__info__details > div > div.location-list-item-details__address > address > div.location-address__line.location-address__line--region";
        await page.waitForSelector(LOCATION_SELECTOR);

        const element = await page.$(LOCATION_SELECTOR);
        const value = await page.evaluate((el) => el.textContent, element);

        const location: string = value
            .substr(value.length - 7)
            .replace(/\s+/g, "")
            .toLowerCase();
        browser.close();
        logger.log("info", location);
        return location;
    } catch (err) {
        return err;
    } finally {
        logger.log("info", "getNoFrillsLocation: DONE!");
    }
};

export { getNoFrillsLocation };
