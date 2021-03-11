import puppeteer from 'puppeteer';
import winston from "winston";

const getNoFrillsLocation = (postal_code: string) => {
    try {
        (async () => {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            const url: string =
                "https://www.nofrills.ca/store-locator?type=store";
            await page.goto(url);

            const ADDRESS_INPUT_SELECTOR = "#PlacesAutocomplete__root > input";
            await page.waitForSelector(ADDRESS_INPUT_SELECTOR);
            await page.type(ADDRESS_INPUT_SELECTOR, postal_code);
            await page.keyboard.press("Enter");
            const LOCATION_SELECTOR =
                "#store-locator > div > div.store-locator__content > div > div.store-locator-content__list > ul > li:nth-child(1) > div > div.location-list-item__info > div.location-list-item__info__details > div > div.location-list-item-details__address > address > div.location-address__line.location-address__line--region";
            await page.waitForSelector(LOCATION_SELECTOR);

            let element = await page.$(LOCATION_SELECTOR);
            let value = await page.evaluate(el => el.textContent, element);

            let location: string = value.substr(value.length-7);
            winston.info("this is the postal_code" +location);

        })();
    } catch (err) {
        console.error(err);
    }
};

getNoFrillsLocation("m1w2y5");

