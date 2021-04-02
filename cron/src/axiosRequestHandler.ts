import {
    getSpoonacularKey,
    updateUsedSpoontacularKey,
} from "./private_postgraphile";

interface Options {
    method: string;
    url: string;
    data: any;
}

const axios = require("axios");

function NoKeysLeftError() {
    throw {
        name: "NoKeysLeftError",
        message: "there are no more keys left!",
    };
}

function KeyUsedError() {
    throw {
        name: "NoKeysLeftError",
        message: "there are no more keys left!",
    };
}

const axiosRequest = async (options: Options) => {
    const url_SELECTOR = options.url;

    while (true) {
        let apiKey_request = await getSpoonacularKey();

        if (
            apiKey_request.data.spoonacularKeys.edges === undefined ||
            apiKey_request.data.spoonacularKeys.edges.length == 0
        ) {
            throw new Error("NO MORE API KEYS LEFT");
        }

        let api_key = apiKey_request.data.spoonacularKeys.edges[0].node.key;
        let apiKey_id = apiKey_request.data.spoonacularKeys.edges[0].node.id;

        let url = url_SELECTOR.replace("$APIKEY", api_key);
        options.url = url;

        try {
            const response = await axios(options);
            console.log("USED API KEY: " + api_key);
            let data = response.data;
            return data;
        } catch (e) {
            console.log("API KEY: " + api_key + " EXPIRED!");
            const updateUsedKey_response = await updateUsedSpoontacularKey(
                apiKey_id
            );
        }
    }
};

export { axiosRequest };
