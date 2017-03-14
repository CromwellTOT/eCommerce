app.config(["$routeProvider", function($routeProvider) {
	$routeProvider.when("/home", {
		templateUrl: "template/Home.html",
		controller: "homeCtrl"
	}).when("/newArrival", {
		templateUrl: "template/NewArrival.html",
		controller: "newArrivalCtrl"
	}).when("/events", {
		templateUrl: "template/Events.html",
		controller: "eventsCtrl"
	}).when("/collections", {
		templateUrl: "template/Collections.html",
		controller: "collectionsCtrl"
	}).when("/collections/:type", {
		templateUrl: "template/Types.html",
		controller: "typesCtrl"
	}).when("/collections/:type/:name", {
		templateUrl: "template/Details.html",
		controller: "detailsCtrl"
	}).when("/search/:searchCriteria", {
		templateUrl: "template/Search.html",
		controller: "searchCtrl"
	}).when("/contact", {
		templateUrl: "template/Contact.html",
		controller: "contactCtrl"
	}).when("/story", {
		templateUrl: "template/Story.html",
		controller: "storyCtrl"
	}).when("/cart", {
		templateUrl: "template/Cart.html",
		controller: "cartCtrl"
	}).when("/myAccount", {
		templateUrl: "template/MyAccount.html",
		controller: "myAccountCtrl"
	}).when("/registration", {
		templateUrl: "template/Registration.html",
		controller: "registrationCtrl"
	}).otherwise({
		redirectTo: "/home"
	})
}]);

// Home page controller
app.controller("homeCtrl", ["$scope", "$location", "$interval", function($scope, $location, $interval) {
	// auto sliding
	var timer = $interval(function() {
	    	$scope.prevSlide();
	  	}, 5000);

	$scope.$on("$destroy", function() {
		console.log("timer cancelled");
		$interval.cancel(timer);
	})

	$scope.redirectPath = function(e) {
        $location.path($(e.target).data("id"));
    }

    $scope.slides = [
        {image: 'images/newArrival.jpg', href: 'newArrival'},
        {image: 'images/ourStory.jpg', href: 'story'},
        {image: 'images/events.jpg', href: 'events'}
    ];

    $scope.direction = 'left';
    $scope.currentIndex = 0;

    $scope.isCurrentSlideIndex = function (index) {
        return $scope.currentIndex === index;
    };

    $scope.prevSlide = function () {
        $scope.direction = 'left';
        $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
    };

    $scope.nextSlide = function () {
        $scope.direction = 'right';
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
    };
}]);

// New Arrival controller
app.controller("newArrivalCtrl", ["$scope", "localStorageService", "$ds", function($scope, localStorageService, $ds) {
	var config = localStorageService.get("userData");
	$scope.configuration = (config? config.configuration: 15);
	var clientNow = new Date();
	var one_day = 1000 * 60 * 60 * 24;
	$ds.getAllItems().then(
		function success(data) {
			//console.log(typeof data.bangles[0].arrivalTime);
			var res = [];
			var allItems = [];
			//console.log(data);
			for(type in data) {
				Array.prototype.push.apply(allItems, data[type]);
			}
			//console.log(allItems);
			for(var i = 0; i < allItems.length; i++) {
				//console.log(allItems[i].arrivalTime);
				var itemTime = new Date(allItems[i].arrivalTime);
				var diff = Math.floor((clientNow - itemTime) / one_day);
				console.log("Arrived " + diff + " days ago");
				if(diff <= $scope.configuration) {
					res.push(allItems[i]);
				}
			}
			$scope.items = res;
		}, function error() {
			console.log("error");
		}
	);
}]);

// Events page controller
app.controller("eventsCtrl", ["$scope", function($scope) {
	$scope.location = "Events";
}]);

// Collections page controller
app.controller("collectionsCtrl", ["$http", "$ds", "$scope", function($http, $ds, $scope) {
	$ds.getAllItems().then(
		function success(data) {
			var res = [];
			//console.log(data);
			for(type in data) {
				Array.prototype.push.apply(res, data[type]);
			}
			$scope.items = res;
		}, function error() {
			console.log("error");
		}
	);
}]);

// Collections types page controller
app.controller("typesCtrl", ["$scope", "$ds", "$routeParams", function($scope, $ds, $routeParams) {
	var type = $routeParams.type;
	$scope.types = type;
	$ds.getItemsByType(type).then(
		function success(data) {
			$scope.items = data;
		}, function error() {
			console.log("error");
		}
	);
}]);

// Collections details page controller
app.controller("detailsCtrl", ["$scope", "$ds", "$routeParams", "$ds", "localStorageService", function($scope, $ds, $routeParams, $ds, localStorageService) {
	var type = $routeParams.type.toLowerCase();
	var name = $routeParams.name;
	// http request
	$scope.type = type;
	$scope.name = name;
	$ds.getItemByName(type, name).then(function(data) {
		$scope.price = data.price;
	});
	$scope.addToCart = function(e) {
		var quantity = parseInt($(e.target).prevAll("div").eq(0).find("input").val());
		if($scope.checkLogin()) {
			var item = {
				"name": $scope.name,
				"price": $scope.price,
				"number": quantity
			}
			checkPush(item);
			$scope.$emit("cartChange", $scope.cart);
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
}]);

// Search page controller
app.controller("searchCtrl", ["$scope", "$http", "$ds", "$routeParams", function($scope, $http, $ds, $routeParams) {
	var queries = $routeParams.searchCriteria.toLowerCase();
	$ds.getItemsBySearch(queries).then(
		function success(data) {
			//console.log(data);
			$scope.items = data;
		}, function error() {
			console.log("error");
		}
	);
}]);

// Contact us page controller
app.controller("contactCtrl", ["$scope", function($scope) {
	$scope.location = "Contact Us";
	$scope.send = function() {
		alert("sent an email");
	}
	$scope.positions = [{
		lat: 40.756166,
		lng: -73.981877
	}];
}]);

// Our Story page controller
app.controller("storyCtrl", ["$scope", function($scope) {
	$scope.location = "Our Story";
}]);

// Registration page controller
app.controller("registrationCtrl", ["$scope", function($scope) {
	// close login modal
	$("#loginDialog").hide();
	$(".errorMsg").hide();
	$scope.random = parseInt(Math.random(0.1, 0.9999) * 10000) + "";
	$scope.register = function(e) {
		var div = $(e.target).parent();
		if(div.prev().find("input").eq(1).val() === $scope.random) {
			alert("Registered!");
		} else {
			alert("wrong input!");
		}
	}
}]);

// Cart page controller
app.controller("cartCtrl", ["$scope", "localStorageService", function($scope, localStorageService) {
	$scope.judge = false; // To avoid ajax call in the first initialzation process
	if($scope.cart.length === 0) {
		$("#cartTable").empty().append("No items in cart");
		$("#checkOut").remove();
	};

	$scope.doDelete = function(i) {
		//console.log(i);
		$scope.cart.splice(i, 1);
	};

	$scope.getTotalValue = function() {
		var sum = 0;
		for(var i = 0; i < $scope.cart.length; i++) {
			sum += $scope.cart[i].price * $scope.cart[i].number;
		}
		return sum;
	};

	$scope.$watchCollection("cart", function(newCart) {
		if($scope.count) { 
			// synchronize with localstorage
			localStorageService.set("cart", newCart);
			// send emit
			$scope.$emit("cartChange", newCart);
		}	
		$scope.count = true;
	});
}]);


// my account page controller
app.controller("myAccountCtrl", ["$scope", "localStorageService", "$ds", function($scope, localStorageService, $ds) {
	$scope.init = false; // to prevent initialization ajax call
	$scope.user = localStorageService.get("userData");
	$scope.user.configuration += "";
    $scope.availableOptions = [
		{id: '5', name: '5 days'},
		{id: '10', name: '10 days'},
		{id: '15', name: '1/2 months'},
		{id: '30', name: '1 month'},
		{id: '90', name: '3 months'}
    ];
	$scope.$watch("user.configuration", function(newVal) {
		var configuration = parseInt(newVal);
		if($scope.init) {
			// create the new user info
			var newUser = {
				"nickName": $scope.user.nickName,
				"email": $scope.user.email,
				"password": $scope.user.password,
				"configuration": configuration
			}
			// update local storage
			localStorageService.set("userData", newUser);
			// send an ajax call to update DB
			updateUser(newUser);
		} else {
			$scope.init = true;
		}
	});
	$scope.updateUserEmail = function(e) {
		var newEmail = $(e.target).parent().prev().prev().find("input").val();
		var confirmEmail = $(e.target).parent().prev().find("input").val();
		if(newEmail === confirmEmail) {
			var newUser = {
				"nickName": $scope.user.nickName,
				"email": newEmail,
				"password": $scope.user.password,
				"configuration":  $scope.user.configuration
			}
			// update local storage
			localStorageService.set("userData", newUser);
			// send an ajax call to update DB
			updateUser(newUser);
		} else {}
	};
	$scope.updateUserPassword = function(e) {
		// check if password match!
		var password = $(e.target).parent().prev().prev().prev().find("input").val();
		var data = {
			user: localStorageService.get("userData").email,
			password: password
		};
		//console.log("tried to login");
		$http.post("/rest/user/", data).then(
				function success(resp) {
					if(resp.data === "failed") { // login error
						alert("wrong current password");
					} else {					// login success
						var newPassword = $(e.target).parent().prev().prev().find("input").val();
						var confirmPassword = $(e.target).parent().prev().find("input").val();
						if(newPassword === confirmPassword) {
							var newUser = {
								"nickName": $scope.user.nickName,
								"email": $scope.user.email,
								"password": newPassword,
								"configuration":  $scope.user.configuration
							}
							// update local storage
							localStorageService.set("userData", newUser);
							// send an ajax call to update DB
							updateUser(newUser);
						} else {
							alert("two new passwords don't match!");
						}
					}			
				}
			)
	};
	$scope.updateUserInfo = function(e) {
		var newNickName = $(e.target).parent().prev().find("input").val();
		// create the new user info
		var newUser = {
			"nickName": newNickName,
			"email": $scope.user.email,
			"password": $scope.user.password,
			"configuration":  $scope.user.configuration
		}
		// update with main scope
		$scope.$emit("userChange", newUser);
		// update in scope
		$scope.user = newUser;
		// update local storage
		localStorageService.set("userData", newUser);
		// send an ajax call to update DB
		updateUser(newUser);
	}
	$scope.toggle = function(e) {
		$(e.target).children("span").toggleClass("rotate");
		$("." + $(e.target).data('id')).toggle(500);
	}
	function updateUser(newUser) {
		var sentData = {
			email: newUser.email,
			userData: {
				nickName: newUser.nickName,
				password: newUser.password,
				configuration: newUser.configuration
			},
			cart: localStorageService.get("cart")
		}
		$ds.updateUser(sentData).then(function success(data) {
			alert("updated!");
			console.log(data);
		}, function error(data) {
			alert("failed...");
			console.log(data);
		});
	}
}]);