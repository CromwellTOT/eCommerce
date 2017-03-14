/* 
	A Router doesn't .listen() for requests on its own. 
	It's useful for separating your application into multiple modules
	-- creating a Router in each that the app can require() and .use() as middleware.
*/
// RESTful for items: CRUD

var express = require("express");
var router = express.Router();
var db = require("./dummydata.js");
var items = db.items;
//console.log(items.bangles);


// REST for items

// read
router.get("/", function(req, resp) {
	console.log("get all items");
	resp.json(items); // it's a slow process
});

// overload for 1 param
router.get("/:typeName", function(req, resp) {
	var type = req.params.typeName;
	resp.json(items[type]);
});

// overload for 2 params
router.get("/:param1/:param2", function(req, resp) {
	if(req.params.param1 === "search") { 	// search
		var searchCriteria = req.params.param2;
		var res = [];
		for(type in items) {
			var arr = items[type];
			for(var i = 0; i < arr.length; i++){
				if(arr[i].name.toLowerCase().includes(searchCriteria)) {
					res.push(arr[i]);
				}
			}
		}
		//console.log(res);
		resp.json(res);
		return ;
	} else if(req.params.param1 === "type"){// get item type by name
		var name = req.params.param2;
		for(var type in items) {
			var itemList = items[type];
			for(var i = 0; i < itemList.length; i++) {
				if(itemList[i].name === name) {
					resp.send(type);
					return;
				}
			}
		}	
	} else {
		var type = req.params.param1;		// get item details when knowing type
		var name = req.params.param2;
		item = items[type];
		for(var i = 0; i < item.length; i++) {
			if(item[i].name === name) {
				resp.json(item[i]);
				return; // to prevent sending resp twice
			}
		}
	}	
	resp.send("failed");				
});

// create
router.post("/", function(req, resp) {
	var data = req.body;
	var type = data.type;
	items[type].push(data.item);
});

// update items
router.put("/", function(req, resp) {
	var data = req.body;
	//go thru a for loop to find the one
	resp.send("update success");
});


// delete
router.delete("/:typeName/:itemName", function(req, resp) {
	var type = req.params.typeName;
	var name = req.params.itemName;
	item = items[type];
	for(var i = 0; i < item.length; i++) {
		if(item[i].name === name) {
			item.splice(i, 1);
			resp.send("deleted");
			return;
		}
	}
	resp.send("no items are found match")	
});

module.exports = router;