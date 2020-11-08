const express = require("express");
const Item = require('./model');
const 

const router = express.Router();

// get all items
router.get('/', async (req, resp) => {
	resp.json(); 
});

// create a new item
router.post('/', async (req, resp) => {

});

module.exports = router;