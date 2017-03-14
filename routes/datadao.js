var dd = {};

// for user operation
dd.findUserByName = function(db, name, callback) {
	var collection = db.collection("user").find({email: name});
	var result;
	collection.each(function(err, doc) {
		if (doc !== null) {
			result = doc;
		} else{
			callback(result);
		}
	});
};

dd.updateUserAll = function(db, data, callback) {
	var collection = db.collection("user");
	delete data._id;
	collection.replaceOne({
		email: data.email
	}, data, function(err, res) {
		callback();
	});
};

dd.updateUserCart = function(db, data, callback) {
	var collection = db.collection("user");
	//delete data._id;
	collection.update(
		{'email': data.userName},
		{$set:{'cart': data.cart}},
		data, function(err, res) {
			callback();
		});
};





/*
dd.findAll = function(db, callback) {
	var collection = db.collection("emp").find();
	var result = [];
	collection.each(function(err, doc) {
		if (doc !== null) {
			result.push(doc);
		} else {
			callback(result);
		}
	});
};

dd.findByName = function(db, name, callback) {
	var collection = db.collection("emp").find({name: name});
	var result;
	collection.each(function(err, doc) {
		if (doc !== null) {
			result = doc;
		} else{
			callback(result);
		}
	});
};

dd.insert = function(db, data, callback) {
	var collection = db.collection("emp");
	collection.insertOne(data, function(err, res) {
		callback();
	});
};

dd.update = function(db, data, callback) {
	var collection = db.collection("emp");
	delete data._id;
	collection.replaceOne({
		name: data.name
	}, data, function(err, res) {
		callback();
	});
};

dd.delete = function(db, name, callback) {
	var collection = db.collection("emp");
	collection.deleteOne({
		name: name
	}, function(err, res) {
		callback();
	});
};
*/
module.exports = dd;