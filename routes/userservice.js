var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var dd = require("./datadao");

var url = "mongodb://localhost:27017/UGuser";

// REST for users: no use 
router.get("/", function(req, resp) {
	resp.json(users);
});

// overload for 1 param
router.get("/:userName", function(req, resp) {
	var name = req.params.userName;
	for(var i = 0; i < users.length; i++) {
		if(users[i].emails === name) {
			resp.json(users[i]);
			return ;
		}
	}
	resp.send("error");
});





// in use
// user login
router.post("/", function(req, resp) {
	MongoClient.connect(url, function(err, db) {
		var data = req.body;
		var name = data.user;
		console.log(name + " tries to login");
		var password = data.password;
		MongoClient.connect(url, function(err, db) {
			dd.findUserByName(db, name, function(result) {
				if(result === undefined) {
					console.log("no user found");
					resp.json("failed");
					db.close();
					return;
				}
				if(result.userData.password === password) {
					result.userData.email = result.email;
					var res = {
						userData: result.userData,
						cart: result.cart
					}
					resp.json(result);
					console.log("success");
					db.close();
					return;
				}
				resp.json("failed");
				console.log("wrong password");
				db.close();
				return;
			});
		});
	});
	/*
	var data = req.body;
	console.log(data.user + " tries to login");
	//console.log(data);
	for(var i = 0; i < users.length; i++) {
		if(users[i].userData.email === data.user) {
			if(users[i].userData.password === data.password) {
				resp.json(users[i]);
				console.log("success");
				return;
			}
		}
	}
	console.log("failed");
	resp.send("error");
	*/
});

// update cart
router.put("/cart", function(req, resp) {
	var data = req.body;
	//console.log(data);
	MongoClient.connect(url, data, function(err, db) {
		dd.updateUserCart(db, data, function() {
			resp.send("update success");
			db.close();
		});
	});
	/*
	for(var i = 0; i < users.length; i++) {
		if(users[i].userData.email === data.userName) {
			users[i].cart = data.cart;
			resp.send("update success");
			return ;
		}
	}
	//go thru a for loop to find the one
	resp.send("cannot find the user");
	*/
});

// update user info
router.put("/user", function(req, resp) {
	var data = req.body;
	//console.log(data);
	MongoClient.connect(url, function(err, db) {
		dd.updateUserAll(db, data, function() {
			resp.send("update success");
			db.close();
		});
	});
});

module.exports = router;