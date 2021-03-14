import { nofrills_flyer_crawler } from "./_scraper-getFlyerItems";
import { getStoreIDByPostalCodeAndCompanyName } from "./_postgraphile";
import { getNoFrillsLocation } from "../helper/_scraper-getPostalCode";
import { logger } from "../logger/config";
import {getProductInfo} from "../helper/_spoonacularApi";
import { createItem } from "../helper/_postgraphile";

/**
 * Creates grocery items in db based on a flyer
 *
 * @param postal_code - postal code of the user
 *
 * @beta
 */

interface Item {
    title: string;
    price: string;
    start_date: string;
    end_date: string;
    category: string;
    store_id: number;
}
const createGroceryItemsNoFrills = async (postal_code: string) => {
    logger.info("Starting Item No Frills collection");
    let items_preStoreid = await nofrills_flyer_crawler(postal_code);

    let postal_code_store: string = await getNoFrillsLocation(postal_code);
    logger.info("No Frills postal code: " + postal_code_store);

    let storeID: number = await getStoreIDByPostalCodeAndCompanyName(postal_code_store,"nofrills");
    logger.log("info", "No Frills Store ID : " + storeID);

    //assigns store id to grocery items
    let items_preCategory = await items_preStoreid.map((item) => {
        return { ...item, store_id: storeID };
    });

    let items = await Promise.all(items_preCategory.map(async(item) => {
        let item_data = await getProductInfo(item.title);
        let category = item_data.category;
        return {...item, category: category};
    }));

    logger.info("No Frills Items" + JSON.stringify(items));
    
    await Promise.all(items.map(async(item)=> {
        await createItem(item);
    }))
    logger.info("DONE creating no frills items");

};
