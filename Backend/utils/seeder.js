const products = require('../data/products.json');
const Product = require('../models/productModel');
const connectDatabase = require('../config/database');
const dotenv = require('dotenv');

dotenv.config({path: 'Backend/config/config.env'});
connectDatabase();


const seedProducts = async ()=> {
    try{
    await Product.deleteMany();
    console.log('Data Destroyed!');
    await Product.insertMany(products);
    console.log('Data Imported!');
    }
    catch(error){
        console.error('Error: ', error);
        process.exit(1);
    }
}

seedProducts();
