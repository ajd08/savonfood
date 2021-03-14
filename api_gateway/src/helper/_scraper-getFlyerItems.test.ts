import {nofrills_flyer_crawler} from "./_scraper-getFlyerItems";
import {logger} from "../logger/config";

test("Get flyer items from no frills flyer", async () => {
    jest.setTimeout(50000);
    const postal_code: string = "m1w2y5";
    const item_flyer = await nofrills_flyer_crawler(postal_code);
    await expect(item_flyer).toBeDefined();
    logger.info(JSON.stringify(item_flyer));

});

