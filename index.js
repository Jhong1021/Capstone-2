const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");

const cartRoutes = require("./routes/cart");

const orderRoutes = require("./routes/order");

const productRoutes = require("./routes/product");

const app = express();

const port = 4004;

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));



mongoose.connect(
  'mongodb+srv://admin:admin1234@joenedb.pxv0djt.mongodb.net/Demo-App?retryWrites=true&w=majority&appName=joeneDB'
  // 'mongodb+srv://admin:admin1234@dominic.rbrnew9.mongodb.net/Demo-App?retryWrites=true&w=majority&appName=Dominic'
);

let db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

db.once("open", () => console.log(`We're connected to the database`));

app.use('/b4/users', userRoutes);

app.use('/b4/cart', cartRoutes);

app.use('/b4/orders', orderRoutes);

app.use('/b4/products', productRoutes);

if (require.main === module) {
  app.listen(process.env.PORT || port, () =>
    console.log(`API is now online on port ${process.env.PORT || port}`)
  );
}    
module.exports = { app, mongoose }; 