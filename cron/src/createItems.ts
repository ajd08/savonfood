import { getAllStores, GroceryItem, createGroceryItem, getItemCategoryByTitle } from "./_postgraphile";
import { nofrills_flyer_crawler } from "./_scraper-getFlyerItems";
import { getProductInfo } from "./_spoonacular";

//FUNCTION USED TO POPULATE NO FRILLS FLYERS INTO THE DATABASE

interface StoreMetaData {
    id: number;
    companyName: string;
    postalCode: string;
}
const createItems = async () => {
    let data = await getAllStores();
    let stores: StoreMetaData[] = data.data.stores.edges.map((node) => {
        return {
            id: node.node.id,
            companyName: node.node.companyName,
            postalCode: node.node.postalCode,
        };
    });

    let nofrills_stores: StoreMetaData[] = stores.filter(
        (store) => store.companyName === "nofrills"
    );

    for (let i = 0; i < nofrills_stores.length; i++) {
        let store_id: number = nofrills_stores[i].id;
        let postalCode: string = nofrills_stores[i].postalCode;
        let store_items = await nofrills_flyer_crawler(postalCode);
        console.log(store_items);

        for (let j = 0; j < store_items.length; j++) {
            let item_info = store_items[j];
            let item_category: string ="";

            let item_category_request = await getItemCategoryByTitle(item_info.title);

            if(item_category_request.data.items.edges === undefined || item_category_request.data.items.edges.length == 0) {
                let item_category_info = await getProductInfo(item_info.title);
                item_category = item_category_info.category;
            }
            else {
                console.log("REUSED A CATEGORY!");
                console.log(item_category_request.data.items.edges);
                item_category = item_category_request.data.items.edges[0].node.category;
            }

            let item: GroceryItem = {
                title: item_info.title.trim(),
                start_date: item_info.start_date.trim(),
                end_date: item_info.end_date.trim(),
                category: item_category.trim(),
                store_id: store_id,
                price: item_info.price.trim()
            };

            await createGroceryItem(item);
        }
    }
};

export {createItems};


