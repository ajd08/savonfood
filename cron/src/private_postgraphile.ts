const axios = require("axios");
//URL ONLY USED FOR DEVELOPMENT
const host_url: string = process.env["GRAPHQL_URL"]

const getSpoonacularKey = async() => {
    const options = {
        url: host_url,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
            query: `
                query getKey {
                  spoonacularKeys(first: 1, condition: {used: false}) {
                    edges {
                      node {
                         id
                         key
                         nodeId
                         used
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

const updateUsedSpoontacularKey = async(key_id : number) => {
    const options = {
        url: host_url,
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
        },
        data: {
            query: `
                mutation updateUsedKey {
                  updateSpoonacularKey(input: {patch: {used: true}, id: ${key_id.toString()}}) {
                    clientMutationId
                  }
                }
            `,
        },
    };
    const response = await axios(options);
    const data = response.data;
    return data;
};
export {getSpoonacularKey, updateUsedSpoontacularKey};
