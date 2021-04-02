import {getSpoonacularKey, updateUsedSpoontacularKey} from "./private_postgraphile";

interface Options {
    method: string;
    url: string;
    data: any;
}

const axios = require("axios");

const axiosRequest = async (options: Options) => {
    const url_SELECTOR = options.url;

    let apiKey_request = await getSpoonacularKey();

    if(apiKey_request.data.spoonacularKeys.edges==[]) {
        throw new Error('ALL API KEYS USED');
    }

    let api_key=apiKey_request.data.spoonacularKeys.edges[0].node.key;
    let apiKey_id = apiKey_request.data.spoonacularKeys.edges[0].node.id;

    let url = url_SELECTOR.replace("$APIKEY", api_key);
    options.url = url;

    try {
        const response = await axios(options);
        console.log("USED API KEY: " + api_key);
        let data = response.data;
        return data;

    }
    catch(e) {
        console.log("API KEY: " + api_key + " EXPIRED!");
        const updateUsedKey_response = await updateUsedSpoontacularKey(apiKey_id);

        apiKey_request = await getSpoonacularKey();


        if(apiKey_request.data.spoonacularKeys.edges==[]) {
            throw new Error('ALL API KEYS USED');
        }

        api_key=apiKey_request.data.spoonacularKeys.edges[0].node.key;

        url = url_SELECTOR.replace("$APIKEY", api_key);
        options.url = url;

        console.log("gang");
        console.log("NEW API KEY: " + api_key);
        const response = await axios(options);
        let data = response.data;
        return data;
    }
};

export {axiosRequest};
