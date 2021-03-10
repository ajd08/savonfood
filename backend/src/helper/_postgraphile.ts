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
    title: string,
    category: string,
    price: string,
    store_id: number,
    start_date: string,
    end_date: string
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
        title: "${title}"
        category: "${name}"
        price: "${price}" 
        store_id: "${store_id}"
        startDate: "${start_date}" 
        endDate: "${end_date}" 
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

    let response = await axios(options);
    const ingredients = await response.data;
    console.log(JSON.stringify(ingredients,null,2));
    let ingredients_list: string[] = [];
    try {
        ingredients_list = ingredients.data.store.items.edges.map(
            (obj) => obj.node.category
        );
        ingredients_list = ingredients_list.filter((item,index) => ingredients_list.indexOf(item) === index);
        console.log(ingredients_list);
        
    } catch (err) {
        console.log(err);
    }

    return ingredients_list;
}; 
export {createItem, createStore, getIngredientsByStoreId};
