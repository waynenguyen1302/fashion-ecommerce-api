const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const stripeRoute = require('./routes/stripe')
const cors = require("cors");
app.use(cors())

const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
//connect to mongodb
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('DBConnection succesfull'))
.catch((error) => {
    console.log(error)
})

//so that our app can take json object request
app.use(express.json())

// When ever we use endpoint /api/user, the app will use userRoute.
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)
app.use("/api/orders", orderRoute)
app.use("/api/checkout", stripeRoute)


app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running");
})

