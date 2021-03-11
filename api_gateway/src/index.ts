import express from "express";
import winston from "winston";
import routes from './routes';

const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

app.use('/recipes', routes.recipes);

// start the Express server
app.listen( port, () => {
    winston.info( `server started at http://localhost:${ port }` );
} );
