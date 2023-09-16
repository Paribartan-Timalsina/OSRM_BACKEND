//import express and export it as the express function
const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const products = require("./routes/productRoute");
const user = require("./routes/userRoutes");
const parking=require("./routes/parkingRoute");
const cookieParser = require("cookie-parser");
//const cron=require("./controllers/updateReservation")
app.use(express.json());
app.use(cookieParser());

//Route Imports
//cron.start();
app.use("/user", user);
app.use("/parking", parking);
app.use(errorMiddleware);

module.exports = app;
