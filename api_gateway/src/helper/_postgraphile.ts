import { logger } from "../logger/config";
const axios = require("axios");
const host_url: string = "http://localhost:3000/graphql";

 /**
   * Creates a stores in postgraphile db
   *
   * @remarks
   * This is our postgraphile utilities lib for shared projects.
   *
   * @param store - object of type Store
   * 
   * stores a Store objects in psql db
   */

interface Store {
    companyName: string;
    name: string;
    streetName: string;
    city: string;
    province: string;
    postalCode: string;
}
const createStore = async (
    store:Store
) => {
    const options = {
        url: host_url,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
            query: `
              mutation {
                createStore(
                input: {
                  store: {
                    companyName: "${store.companyName}"
                    name: "${store.name}"
                    streetName: "${store.streetName}"
                    city: "${store.city}"
                    province: "${store.province}"
                    postalCode: "${store.postalCode}"
                  }
                }
              ) {
                clientMutationId
              }
            }
    `,
        },
    };
    const response = await axios(options);
    const data = JSON.stringify(response.data, null, 2);
    console.log(data);
};

interface Item {
    title: string;
    price: string;
    start_date: string;
    end_date: string;
    category: string;
    store_id: number;
}

/**
* Creates a item in postgraphile db
*
* @remarks
* This is our postgraphile utilities lib for shared projects.
*
* @param store - object of type Item
* 
* stores a Item object in psql db
*/
const createItem = async (item: Item) => {
    const options = {
        url: host_url,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
            query: `
            mutation createItem {
              createItem(
                input: {
                  item: {
                    category: "${item.category}"
                    endDate: "${item.end_date}"
                    price: "${item.price}"
                    startDate: "${item.start_date}"
                    storeId: ${item.store_id}
                    title: "${item.title}"
                  }
                }
              ) {
                clientMutationId
              }
            }
    `,
        },
    };

    try {
        const response = await axios(options);
        logger.log("info", "ITEM CREATED: "+ item.title);
    } catch (e) {
        logger.error("unable to create item",e);
        return e;
    }
};


/**
* Returns all ingredients in a store by store ID
*
* @remarks
* This is our postgraphile utilities lib for shared projects.
*
* @param store_id - id of a store
* 
* returns a list of all ingredients from a store
*/
const getIngredientsByStoreId = async (store_id: number) => {
    const options = {
        url: host_url,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
            query: `
            query MyQuery {
  store(id: ${store_id}) {
    id
    items {
      edges {
        node {
          category
          title
        }
      }
    }
  }
}
    `,
        },
    };
    let ingredients_list: string[] = [];

    try {
        const response = await axios(options);
        const ingredients = await response.data;
        ingredients_list = ingredients.data.store.items.edges.map(
            (obj: any) => obj.node.category
        );
        ingredients_list = ingredients_list.filter(
            (item, index) => ingredients_list.indexOf(item) === index
        );

        ingredients_list = ingredients_list.filter(
            (item, index) => item != "non food item" 
        );
    } catch (err) {
        logger.log("error", "cant connect to database ganglands");
        return err;
    }

    return ingredients_list;
};


/**
* Returns the id of a store based on postal code and company name
*
* @remarks
* This is our postgraphile utilities lib for shared projects.
*
* @param postal_code: postal code of the store
* @param companyName: company that the store belongs to
* 
* returns the id of the store
*/
const getStoreIDByPostalCodeAndCompanyName = async (postal_code: string, companyName: string) => {
    const options = {
        url: host_url,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
            query: `
            query getStoreIDbypostalCodeAndCompanyName {
              stores(
                filter: {
                  postalCode: { equalToInsensitive: "${postal_code}" }
                  companyName: { equalToInsensitive: "${companyName}" }
                }
              ) {
                edges {
                  node {
                    id
                  }
                }
              }
            }
            `,
        },
    };

    let store_id: number = null;

    try {
        const response = await axios(options);
        await logger.log("info", JSON.stringify(response.data));
        try {
            store_id = await response.data.data.stores.edges[0].node.id;
        }
        catch(e) {
            throw new Error("store id not found in database: " + e);

        }
        await logger.log("info", store_id);
        return store_id;
    } catch (e) {
        logger.log("error", "Cannot get store Id: ", e);
        throw new Error ("Cannot get store ID " + e);
    }  
};

export { createItem, createStore, getIngredientsByStoreId, getStoreIDByPostalCodeAndCompanyName };
