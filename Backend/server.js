//server.js
const app = require('./app');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/database');

dotenv.config({ path: path.join(__dirname,'config/config.env') });
// dotenv.config({ path: 'config/config.env' });

connectDatabase();

app.listen(process.env.PORT, () => {
console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);

});