import express from "express";
import winston from "winston";

const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

// start the Express server
app.listen( port, () => {
    winston.info( `server started at http://localhost:${ port }` );
} );
