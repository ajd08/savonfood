import { Item } from '../interfaces'
import { logger } from '../logger/config';
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

const createItem = async (
    item: Item
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
    createItem(
    input: {
      item: {
        title: "${item.title}"
        category: "${item.category}"
        price: "${item.price}" 
        store_id: "${item.store_id}"
        startDate: "${item.start_date}" 
        endDate: "${item.end_date}" 
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
        const data = JSON.stringify(response.data, null, 2);
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
            (obj) => obj.node.category
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

    try {
        let response = await axios(options);
        logger.log("info", JSON.stringify(response.data));
        let store_id: number  = await response.data.data.stores.edges[0].node.id;
        logger.log("info",store_id);
        return store_id;
    } catch (err) {
        logger.log("error", "unable to get storeid", err);
        return err;
    }
};

export { createItem, createStore, getIngredientsByStoreId,getStoreID };
