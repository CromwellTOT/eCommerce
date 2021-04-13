/* 
	brew services start mongodb-community@4.4
	brew services stop mongodb-community@4.4
	API Gateway
	*/
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const config = require('./config');

const itemService = require("./app/service/item/route");
const userService = require("./app/service/user/route");
const cartService = require("./app/service/cart/route");
const roleService = require("./app/service/role/route");
const authService = require("./app/access-control/authenticate");

mongoose
  .connect(config.mongodb_url, {
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
app.use('/rest/access-user/', roleService);
app.use('/rest/auth/', authService);

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/frontend/index.html`);
});

app.get('/update', (req, res) => {
    res.sendFile(`${__dirname}/frontend/updateRole.html`);
});

// started
app.listen(config.port);
console.log("server started");