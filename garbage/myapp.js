$scope.login = function(email, password) { // this dont have hoisting feature
		var email = email || $("#email").val();
		var password = password || $("#password").val();
		var data = {
			user: email,
			password: password
		};
		//console.log(data);
		$http.post("/rest/user/", data).then(
				function success(resp) {
					if(resp.data === "error") { // login error
						$(".errorMsg").show();
					} else {					// login success
						localStorageService.set("userData", resp.data.userData);
						localStorageService.set("cart", resp.data.cart);
						localStorageService.bind($scope, "userData");
						// close login modal
						$("#loginDialog").hide();
						// erase error message wheather or not it showed
						$(".errorMsg").hide();
						//console.log(resp.data);
						// change hello message to welcome the user
						$("#hello").empty().append("<a disabled>Welcome, " + $scope.userData.nickName + "!</a>");
						// define local variables
						localStorageService.bind($scope, "cart");
						//console.log($scope.cartLength);
						$location.path("home");
					}			
				}
			)
	};

	// Initialization
	if(!angular.equals(localStorageService.get("userData"), {})){  
		// id exists
		var user = localStorageService.get("userData");
		$scope.login(user.email, user.password);
	}
	$scope.cartLength = $scope.cart.length;

	$scope.logintoloadmoreproduct = function(e) {
		if(angular.equals($scope.userData, {})){	
			$("#loginDialog").show();
		} else {
			var event = $(e.target).data('id');
			if(event === "cart") {
				$location.path("cart");
			} else if(event === "MyAccount") {
				$location.path("myAccount");
			}	
		}
	}

	$scope.doSearch = function() {
		//console.log($scope.queries);
		//console.log($location.path());
		$location.path("search/" + $scope.queries);
		$scope.queries = "";
		/*
		$rootScope.searchCriteria = $scope.queries;
		if($location.path() !== "#/search") {
			$location.path("#/search");
		}
		$scope.queries = "";
		*/
	}

	$scope.showDropdownMenu = function() {
		if($scope.cart.length !== 0) {
			$(".cart-dropdown-menu").show();
		}
	}

	$scope.hideDropdownMenu = function() {
		$(".cart-dropdown-menu").hide();
	}