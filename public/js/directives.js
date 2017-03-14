// customize loading page directive
app.directive('loading', ['$http', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) 
        // this scope is the same as the mainCtrl's $scope
        // because it did not create its own scope
        // use scope: {}, to create its own scope!
        {
            scope.isLoading = function () {   	
                return $http.pendingRequests.length > 1;
            };
            /*
            function getMethod(arr) {
            	scope.array = []
            	arr.forEach(function(obj) {
            		console.log(obj);
            		scope.array.push(obj.method);
            	}); 	
            }
			*/
            scope.$watch(scope.isLoading, function (v)
            {
                if(v){
                    elm.show();
                }else{
                    elm.fadeOut(1000);
                }
            });
        }
    };

}]);

// to watch quantity change 
app.directive('watcher', function () {
    return {
        restrict: 'A',
        require : 'ngModel',
        link : function (scope, element, attrs, ngModelCtrl) {
            element.bind('change', function(){
				scope.$emit("cartChange", scope.cart);
			});;
        }
    } 
});

// customize back-to-top directive
app.directive('backToTop', function(){
	return {
		restrict: 'E',
		replace: true, 
		template: '<div class="back-to-top"><i class="fa fa-chevron-up"></i></div>', 
		link: function(scope, element, attrs) {
			$(window).scroll(function(){

				if ($(window).scrollTop() <= 0) {
					$(element).fadeOut();
				}
				else {
					$(element).fadeIn();
				}

			});
			$(element).on('click', function(){
				$('html, body').animate({ scrollTop: 0 }, 'fast');
			});
		}
	}

});

// customize items-list directive
app.directive('itemsList', function(){
	return {
		restrict: 'E', 
		replace: true,
		templateUrl: "/template/itemsList.html", 
		link: function(scope, element, attrs) {
			/*
			scope.$watch("results", function(newVal) {
				if(newVal.length == 0) {
					$("#showOnZero").show();
				} else {
					$("#showOnZero").hide();
				}
			});
			*/
			scope.min = 0;
			scope.max = 10000;
			scope.propertyName = 'name';
			scope.reverse = true;
			scope.sortBy = function(propertyName) {
				scope.reverse = (scope.propertyName === propertyName) ? !scope.reverse : false;
    			scope.propertyName = propertyName;
			}
		}
	}
})  

app.filter("myFilter", function() {
	return function(data, min, max) {
		//console.log(data);
		//console.log(min, max);
		if(data) {
			var res = [];
			if(min <= max && Number.isInteger(min) && Number.isInteger(max)) {
				/*console.log(data);
				angular.forEach(data, function(item) {
					//console.log(item);
					if(item.price >= min && item.price <= max) {
						res.push(item);
					}
					return res;
				});
				*/
				return data.filter(function(item){
					if (item.price >= min && item.price <= max) {
						return true;
					}
				});
			}		
		}
		return data;
	}
})

app.directive("navRightBar", ["$compile", function($compile) {
	var templateList = [
		// NotLoginRightBarNav
		`
		<ul class="nav navbar-nav navbar-right">
			<li>
				<a href="" ng-click="checkLogin()">Hello Guest, Login</a>
			</li>
		</ul>
		`,
		// LoginRightBarNav
		`
		<ul class="nav navbar-nav navbar-right">
			<li data-id="account-dropdown-menu" ng-mouseover="showDropdownMenu($event)" ng-mouseleave="hideDropdownMenu($event)">
				<a disabled>Welcome, {{userData.nickName}}</a>
				<ul class="dropdown-menu account-dropdown-menu">
					<li>
						<a href="#/myAccount">My Account</a>
					</li>
					<li>
						<a href="" ng-click="signOut()">Sign Out</a>
					</li>
				</ul>
			</li>
			<li data-id="cart-dropdown-menu" ng-mouseover="showDropdownMenu($event)" ng-mouseleave="hideDropdownMenu($event)">
				<a>Cart({{cart.length}})</a>
				<ul class="dropdown-menu cart-dropdown-menu" style="width: 200px">
					<li ng-repeat="item in cart" class="row text-center hoverTurnGray">
						<div class="col-sm-6"><img class="img-responsive" ng-src="images/collections/thumbnail/{{item.name}}.png"></div>
						<div class="col-sm-6">
							<div style="padding-top: 20px;">{{item.name}}</div>
							<div>{{item.price  | currency}}</div>
						</div>
					</li>
					<li><a href="#/cart" class="btn">Check Out</a></li>
				</ul>
			</li>
		</ul>
		`
	];
	return {
		restrict: "E",
		template: templateList[0],
		link: function(scope, elem, attr) {
			scope.$watch("loginCheck", function(val) {
				if(val) {
					elem.html(templateList[1]);
					$compile(elem.contents())(scope);
				} else {
					elem.html(templateList[0]);
					$compile(elem.contents())(scope);
				}
			})
		}
	}
}]);

app.animation('.slide-animation', function () {
    return {
        beforeAddClass: function (element, className, done) {
            var scope = element.scope();

            if (className == 'ng-hide') {
                var finishPoint = element.parent().width();
                if(scope.direction !== 'right') {
                    finishPoint = -finishPoint;
                }
                TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
            }
            else {
                done();
            }
        },
        removeClass: function (element, className, done) {
            var scope = element.scope();

            if (className == 'ng-hide') {
                element.removeClass('ng-hide');

                var startPoint = element.parent().width();
                if(scope.direction === 'right') {
                    startPoint = -startPoint;
                }

                TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
            }
            else {
                done();
            }
        }
    };
});

/* customize nav-bar-right directive
app.directive('navBarRight', function(){
	return {
		restrict: 'E', 
		templateUrl: "/template/navBarRight.html", 
		link: function(scope, element, attrs) {

		}
	}
})  
*/

// customize user service
/* changed to local storage
app.service("$user", function() {
	this.userName = "";
	this.cart = [];
});
*/