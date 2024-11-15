//server.js
const app = require('./app');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/database');

dotenv.config({ path: path.join(__dirname,'config/config.env') });
// dotenv.config({ path: 'config/config.env' });

connectDatabase();

const server = app.listen(process.env.PORT, () => {
console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);

});

//7. Unhandled Promise Rejections
//These errors occur when a promise is rejected and there is no .catch handler to handle the rejection.
process.on('unhandledRejection',(err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to unhandled rejection');
    server.close(() => {
        process.exit(1);
    })
})


process.on('uncaughtException', (err) =>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught error');
    server.close(() => {
        process.exit(1);
    })
})

// console.log(a);