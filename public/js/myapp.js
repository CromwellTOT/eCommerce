var app = angular.module("mainApp", ["ngRoute", "LocalStorageModule", "ngMap", 'ngAnimate', 'ngTouch']);

app.factory("$ds", ["$q", "$http", ds.$itemservice]);

/*
 * http://stackoverflow.com/questions/40670524/how-to-use-route-reload-commonly-for-all-controllers-in-angular-js
 * By refreshing the page you will wipe your $rootscope from memory. Your application restarts.
 * You can use for example $cookies or sessionStorage / localStorage.
 * If you want to detect refresh on your app.run you can do by this way:
 */
// do something when routing
app.run(['$rootScope', '$location', '$window',function($rootScope, $location, $window) { 
    window.onbeforeunload = function() {
        // handle the exit event
        //console.log("1");
    };

    // you can detect change in route
    // redirect back to home page when refresh!!
 	$location.path("home");

    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (!current) {
            // insert segment you want here
            //console.log("3");
        }
        //console.log("4");
    });

}]);


// Main controller
app.controller("mainCtrl", ["$scope", "$http", "$location", "localStorageService", "$ds", "$compile",
			function($scope, $http, $location, localStorageService, $ds, $compile) {

	$scope.login = function(email, password) {
		var email = email || $("#email").val();
		var password = password || $("#password").val();
		var data = {
			user: email,
			password: password
		};
		//console.log("tried to login");
		$http.post("/rest/user/", data).then(
				function success(resp) {
					if(resp.data === "failed") { // login error
						$(".errorMsg").show();
					} else {					// login success
						//var currentUrl = $location.path();
						//console.log(currentUrl);
						// update localstorage
						localStorageService.set("userData", resp.data.userData);
						localStorageService.set("cart", resp.data.cart);
						// bind to scope
						$scope.userData = localStorageService.get("userData");
						localStorageService.bind($scope, "cart");
						// alter frontend page
						closeLoginModal();
						$scope.loginCheck = true;
						// redirect back to home page
						//$location.path(currentUrl);
					}	
				}
			)
	}


	$scope.checkLogin = function() {
		if(localStorageService.get("userData") === null) { // did not login		
			$("#loginDialog").show();
			return false;
		} else {										   // login
			return true;									  
		}
	}

	$scope.signOut = function() {
		//console.log("sign out");
		localStorageService.remove("userData");
		localStorageService.remove("cart");
		$scope.loginCheck = false;
		$location.path("home");
	}

	function closeLoginModal() {
		$("#loginDialog").hide();
		$(".errorMsg").hide();
	}

	// Initialization: check if user has cookie
	var userData = localStorageService.get("userData");
	if(userData === null) {
		// not yet login user
		$scope.loginCheck = false;
	} else {
		// try to login
		$scope.login(userData.email, userData.password);
	}

	$scope.doSearch = function() {
		$location.path("search/" + $scope.queries);
		$scope.queries = "";
	}

	$scope.showDropdownMenu = function(e) {
		var name = $(e.target).parent().data('id');
		if(name === "cart-dropdown-menu" && $scope.cart.length !== 0){
			$("." + name).show();
		} else if(name === "account-dropdown-menu") {
			$("." + name).show();
		}
	}

	$scope.hideDropdownMenu = function(e) {
		var name = $(e.target).parent().data('id');
		if(name === "cart-dropdown-menu"){
			$("." + name).hide();
		} else if(name === "account-dropdown-menu") {
			$("." + name).hide();
		}
	}

	$scope.preview = function(e) {
		var name = $(e.target).parent().next().text();
		//console.log(name);
		$("#previewDialog").show();
		$scope.currentItemName = name;
		//$scope.currentItem = section;
	}

	$scope.findRightPath = function(e) {
		var name = $(e.target).text();
		$ds.getItemTypeByName(name).then(function(type) {
			var url = "/collections/" + type + "/" + name;
			$location.path(url);
		})
		//#/collections/{{types}}/{{item.name}}
	}

	$scope.addToCart = function(e) {
		if($scope.checkLogin()) {
			var name = $(e.target).parent().prevAll("div").eq(1).text();
			var price = $(e.target).parent().prev().text().split(" ")[1];
			//console.log(name);
			//console.log(price);
			var item = {
				"name": name,
				"price": price,
				"number": 1
			}
			checkPush(item);
			synchronizeCart();
		}
	}

	function checkPush(item) {
		var cart = localStorageService.get("cart");
		for(var i = 0; i < cart.length; i++) {
			if(cart[i].name === item.name) {
				$scope.cart[i].number += item.number;
				return ;
			}
		}
		$scope.cart.push(item);
	}

	// deal with cart emit
	$scope.$on("cartChange", function(evt, val) {
		//console.log("main scope cart emit");
		// change the cart in main scope
		$scope.cart = val;
		synchronizeCart();
	})

	// deal with user emit
	$scope.$on("userChange", function(evt, val) {
		//console.log(val);
		// change the userData in main scope
		$scope.userData = val;
		//$scope.$broadcast("updateUserData", val);
	})

	// synchronize with database when cart change
	function synchronizeCart() {
		//console.log($scope.cart);
		var data = {
			"userName": $scope.userData.email,
			"cart": $scope.cart
		}
		$ds.updateCart(data).then(function success(msg) {
			console.log(msg);
		})
	}
	/* to watch one ng-model 
	$scope.$watch("currentItemName", function(newVal, oldVal) {
		console.log(newVal, oldVal);
	});
	*/	
}]);