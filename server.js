// brew services start mongodb-community@4.4
// brew services stop mongodb-community@4.4
// API Gateway
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const itemService = require("./app/service/item/route");
const userService = require("./app/service/user/route");
const cartService = require("./app/service/cart/route");
const authService = require("./app/access-control/authenticate");

mongoose
  .connect('mongodb://localhost:27017/jewelryfifthavenue', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((error) => console.log(error.reason));

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/rest/item/", itemService);
app.use("/rest/user/", userService);
app.use('/rest/cart/', cartService);
app.use('/rest/auth/', authService);

app.use(express.static(__dirname + "/public")); // use for front end file access

app.get("/", function(req, resp) {
	resp.sendFile(__dirname + "/public/main.html");
});

// started
app.listen(4444);
console.log("server started");