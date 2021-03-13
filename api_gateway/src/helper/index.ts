import { nofrills_flyer_crawler } from "./_scraper-getFlyerItems";
import { getStoreID } from "./_postgraphile";
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
    let items_preStoreid = await nofrills_flyer_crawler(postal_code);
    let postal_code_store: string = await getNoFrillsLocation(postal_code);
    let storeID: number = await getStoreID(postal_code_store);
    logger.log("info", "this is the store id : " + storeID);

    //assigns store id to grocery items
    let items_preCategory = await items_preStoreid.map((item) => {
        return { ...item, store_id: storeID };
    });

    let items = await Promise.all(items_preCategory.map(async(item) => {
        let category_info = await getProductInfo(item.title);
        return {...item, category: category_info};
    }));

    
    await Promise.all(items.map(async(item)=> {
        await createItem(item);
    }))
    logger.log("info","Done creating grocery items from nofrills!");

};
createGroceryItemsNoFrills("m1w2y5");

