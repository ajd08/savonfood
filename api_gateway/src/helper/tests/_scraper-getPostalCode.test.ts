import {getNoFrillsLocation} from "../_scraper-getPostalCode";
import {logger} from "../../logger/config";

test("Get nearest no frills location", async () => {
    jest.setTimeout(30000);
    const postal_code: string = "m1w2y5";
    const store_postal_code = await getNoFrillsLocation(postal_code);
    await expect(store_postal_code).toEqual("m1t3l4");
    logger.info(JSON.stringify(store_postal_code));
});


