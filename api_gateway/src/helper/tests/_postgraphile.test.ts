import {getStoreIDByPostalCodeAndCompanyName} from "../_postgraphile";
import {logger} from "../../logger/config";

const axios = require("axios");
const host_url: string = "http://0.0.0.0:5433/graphql";

const getTestStore = async () => {
    console.log("THIS IS THE HOST URL");
    console.log(host_url);
    const options = {
        url: host_url,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        data: {
            query: `
query getTestStore {
  stores(filter: {postalCode: {equalTo: "test"}}) {
    edges {
      node {
        city
        companyName
        id
        name
        nodeId
        postalCode
        province
        streetName
      }
    }
  }
}
          `,
        },
    };
    const response = await axios(options);
    //logger.info(JSON.stringify(response.data, null, 2));
    logger.info("GOT TEST STORE!")
    logger.info(JSON.stringify(response.data));
    return response.data;
};

test("getting a test store", async () => {
    jest.setTimeout(5000);
    const store_postal_code = await getTestStore();
    console.log(store_postal_code);
    await expect(store_postal_code).toBeDefined();
});



