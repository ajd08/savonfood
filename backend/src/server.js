const express = require("express");
const { postgraphile } = require("postgraphile");

const app = express();

const postgraphileOptions = {
    subscriptions: true,
    watchPg: true,
    dynamicJson: true,
    setofFunctionsContainNulls: false,
    ignoreRBAC: false,
    //ignoreIndexes: false,
    showErrorStack: "json",
    extendedErrors: ["hint", "detail", "errcode"],
    exportGqlSchemaPath: "schema.graphql",
    appendPlugins: [
        require("@graphile-contrib/pg-simplify-inflector"),
        require("postgraphile-plugin-connection-filter"),
    ],
    graphiql: true,
    enhanceGraphiql: true,
    ownerConnectionString: "postgresql://postgres:postgres@127.0.0.1/foodapp",
    allowExplain(req) {
        // TODO: customise condition!
        return true;
    },
    enableQueryBatching: true,
    legacyRelations: "omit",
    pgSettings(req) {
        /* TODO */
    },
};

app.use(
    postgraphile(
        process.env.DATABASE_URL ||
            "postgres://anthony:brownie1!@127.0.0.1:5432/foodapp",
        "savonfood_public",
        postgraphileOptions
    )
);
app.listen(process.env.PORT || 3000);

console.log("running on localhost:3000");
