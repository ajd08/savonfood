const axios = require("axios");
const host_url: string = process.env["GRAPHQL_URL"]

interface Store {
    companyName: string;
    name: string;
    streetName: string;
    city: string;
    province: string;
    postalCode: string;
}
const createStore = async (store: Store) => {
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

interface GroceryItem {
    title: string;
    price: string;
    start_date: string;
    end_date: string;
    category: string;
    store_id: number;
}

const createGroceryItem = async (item: GroceryItem) => {
    console.log(item.category);
    console.log(item.start_date);
    console.log(item.end_date);
    console.log(item.price);
    console.log(item.store_id);
    console.log(item.title);

    const options = {
        url: host_url,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
            query: 
            `
                mutation createGroceryItem {
                  createItem(
                    input: {
                        item: {
                            category: "${item.category}"
                            endDate: "${item.end_date}"
                            price: "${item.price}" 
                            startDate: "${item.start_date}" 
                            title: "${item.title}"
                            storeId: ${item.store_id}
                            }
                        }
                  ) {
                    clientMutationId
                  }
                }
            `
            
//            `
//           mutation createGroceryItem {
//  createItem(
//    input: {item: {category: "adsf", endDate: "April 25, 2021", price: "adsfadsf", startDate: "March 10, 2021", title: "adsf", storeId: 10}}
//  ) {
//    clientMutationId
//  }
//}
//            `


            ,
        },
    };
    console.log("TRYING TO CREATE A GROCERY ITEM");
    try {
        const response = await axios(options);
        const data = JSON.stringify(response.data, null, 2);
        console.log("SUCCESSFULLY CREATED GROCERY ITEM");
        console.log(data);
    } catch (e) {
        console.error("FAILED TO CREATE GROCERY ITEM", e);
        throw e;
    }
};

const getAllStores = async () => {
    const options = {
        url: host_url,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
            query: `
                query getAllStores {
                  stores {
                    edges {
                      node {
                        id
                        companyName
                        postalCode
                      }
                    }
                  }
                }
    `,
        },
    };
    const response = await axios(options);
    const data = response.data;
    return data;
};

const deleteAllItems = async () => {
    const options = {
        url: host_url,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
            query: `
                mutation deleteAllItems{
                  deleteAllItems(input: {}) {
                    clientMutationId
                    string
                  }
                }
            `,
        },
    };
    const response = await axios(options);
    const data = response.data;
    return data;
};

const getItemCategoryByTitle = async (title: string) => {
    const options = {
        url: host_url,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
            query: `
                query getItemCategoryByTitle {
                  items(condition: {title: "${title}"}, first: 1) {
                    edges {
                      node {
                        id
                        category
                      }
                    }
                  }
                }
            `,
        },
    };
    const response = await axios(options);
    const data = response.data;
    return data;
}

export { Store, createStore, GroceryItem, createGroceryItem, getAllStores, deleteAllItems, getItemCategoryByTitle };
