import { logger } from "../logger/config";
const axios = require("axios");
const host_url: string = "http://localhost:3000/graphql";

const createStore = async (
    companyName: string,
    name: string,
    streetName: string,
    city: string,
    province: string,
    postalCode: string
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
        companyName: "${companyName}"
        name: "${name}"
        streetName: "${streetName}" 
        city: "${city}"
        province: "${province}" 
        postalCode: "${postalCode}" 
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
        logger.log("info", JSON.stringify(response));
    } catch (e) {
        return e;
    }
};

const getIngredientsByStoreId = async (store_id: number) => {
    console.log("INGREDIENTS: ");

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
        let response = await axios(options);
        const ingredients = await response.data;
        ingredients_list = ingredients.data.store.items.edges.map(
            (obj:any) => obj.node.category
        );
        ingredients_list = ingredients_list.filter(
            (item, index) => ingredients_list.indexOf(item) === index
        );
    } catch (err) {
        logger.log("error", "cant connect to database ganglands");
        return err;
    }

    return ingredients_list;
};

//gets the storeID by postal_code
const getStoreID = async (postal_code: string) => {
    const options = {
        url: host_url,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
            query: `
            query storeByID {
  stores(filter: {postalCode: {equalToInsensitive: "${postal_code}"}}) {
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

    let store_id="";

    try {
        let response = await axios(options);
        await logger.log("info", JSON.stringify(response.data));
        let store_id: number = await response.data.data.stores.edges[0].node.id;
        await logger.log("info", store_id);
        return store_id;
    } catch (err) {
        logger.log("error", "unable to get storeid", err);
        return err;
    } finally {
        logger.log("info", "getStoreID: all done!");

    }
    return store_id;
};

export { createItem, createStore, getIngredientsByStoreId, getStoreID };
