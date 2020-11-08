const express = require("express");
const router = express.Router();
//const Cart = require('./model');

router.get("/", async (req, resp) => {
	resp.json(); 
});

module.exports = router;