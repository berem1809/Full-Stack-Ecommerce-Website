//app.js
const express = require ('express'); //Loads the Express module.
const app = express(); //creates an express application  instance to define routes and handle requests.
const products = require ('./routes/productRoutes'); //Imports the product routes.
const errorMiddleware = require('./middlewares/error');
const auth = require('./routes/authRoutes');
const order = require('./routes/orderRoutes');
const cookieParser = require('cookie-parser');

app.use(express.json()); //Parses the JSON data sent in the request body.
app.use(cookieParser()); //Parses the cookies attached to the client request.
app.use('/api/v1/', products); //Mounts the product routes on the /api/v1/ path.
app.use('/api/v1/',auth);
app.use('/api/v1/',order)

// Middleware to handle errors
app.use(errorMiddleware);
module.exports = app;
