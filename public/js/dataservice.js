(function(global) {
	var ds = {};
	ds.$itemservice = function($q, $http) {
		return {
			//item 
			getItemByName: function(type, name) {
				var defer = $q.defer();
				$http.get("/rest/item/" + type + "/" +name).then(function(resp) {
					defer.resolve(resp.data);
				});
				return defer.promise;
			},
			getItemTypeByName: function(name) {
				var defer = $q.defer();
				$http.get("/rest/item/type/" + name).then(function(resp) {
					defer.resolve(resp.data);
				});
				return defer.promise;
			},
			getAllItems: function() {
				var defer = $q.defer();
				$http.get("/rest/item").then(function(resp) {
					defer.resolve(resp.data);
				});
				return defer.promise;
			},
			getItemsByType: function(type) {
				var defer = $q.defer();
				$http.get("/rest/item/" + type).then(function(resp) {
					defer.resolve(resp.data);
				});
				return defer.promise;
			},
			getItemsByTime: function(time) {
				var defer = $q.defer();
				$http.get("/rest/item").then(function(resp) {
					defer.resolve(resp.data);
				});
				return defer.promise;
			},
			getItemsBySearch: function(searchCriteria) {
				var defer = $q.defer();
				$http.get("/rest/item/search/" + searchCriteria).then(function(resp) {
					defer.resolve(resp.data);
				});
				/*
				$http.get("/rest/item/search/" + searchCriteria).then(function(resp) {
					defer.resolve(resp.data);
				});
				*/
				return defer.promise;
			},
			//user
			updateCart: function(data) {
				var defer = $q.defer();
				$http.put("rest/user/cart", data).then(function(resp) {
					defer.resolve(resp.data);
				});
				return defer.promise;
			},
			updateUser: function(data) {
				var defer = $q.defer();
				$http.put("rest/user/user", data).then(function(resp) {
					defer.resolve(resp.data);
				});
				return defer.promise;
			}
			/*
			getEmpList: function() {
				var defer = $q.defer();
				$http.get("/rest/es").then(function(resp) {
					defer.resolve(resp.data);
				});
				return defer.promise;
			},
			insertEmp: function(emp) {
				var defer = $q.defer();
				$http.post("/rest/es", emp).then(function(resp) {
					defer.resolve(resp);
				});
				return defer.promise;
			},
			getOneEmp: function(name) {
				var defer = $q.defer();
				$http.get("/rest/es/" + name).then(function(resp) {
					defer.resolve(resp.data);
				});
				return defer.promise;
			},
			updateEmp: function(emp) {
				var defer = $q.defer();
				$http.put("/rest/es", emp).then(function(resp) {
					defer.resolve(resp);
				});
				return defer.promise;
			},
			deleteByName: function(name) {
				var defer = $q.defer();
				$http.delete("/rest/es/" + name).then(function(resp) {
					defer.resolve(resp);
				});
				return defer.promise;
			}
			*/
		}
	};
	ds.noConflict = function() {
		return ds;
	}
	global.ds = ds;
})(window);