var app=angular.module('shoppingCart_app', ['ngRoute']);
app.config(function($routeProvider) {
	$routeProvider
		.when('/home', {
			templateUrl: './views/home.html',
			controller: 'home_controller'
		})
		.when('/cart', {
			templateUrl: './views/cart.html',
			controller: 'cart_controller'
		})
		.otherwise({
			redirectTo: '/home'
		});
});
// app.run(function ($rootScope) {
//     $rootScope.$on('$localstorage.set', function (event, data) {
//         console.log("$localstorage.set", data);
//     });
// 	$rootScope.$on('$localstorage.get', function (event, data) {
//         console.log("$localstorage.get", data);
//     });
// 	$rootScope.$on('$localstorage.setObject', function (event, data) {
//         console.log("$localstorage.setObject", data);
//     });
// 	$rootScope.$on('$localstorage.getObject', function (event, data) {
//         console.log("$localstorage.getObject", data);
//     });
// 	$rootScope.$on('$localstorage.remove', function (event, data) {
//         console.log("$localstorage.remove", data);
//     });
// 	$rootScope.$on('$localstorage.clear', function (event, data) {
//         console.log("$localstorage.clear", data);
//     });
// });
app.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || false;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      if($window.localStorage[key] != undefined){
        return JSON.parse( $window.localStorage[key] || false );
      }
      return false;   
    },
    remove: function(key){
      $window.localStorage.removeItem(key);
    },
    clear: function(){
      $window.localStorage.clear();
    }
  }
}]);

app.controller('home_controller',['$scope','$http','$localstorage','$rootScopes',function($scope,$http,$localstorage,$rootScopes){
	if($localstorage.getObject("Cart")){
		$scope.cart=$localstorage.getObject("Cart");
	}
	else{
		$scope.cart=[]
	}
	$scope.cartvalue=$scope.cart.length;
	$scope.addtocart=function($productid){
		var id =$productid;
		var exist = $scope.cart.some(function (el) {
			return el.product_id === $productid;
		});
		if(!exist){ 
			$scope.cart.push({ product_id: $productid, quantity: 1 }); 
		}else{
			$scope.cart.forEach(function(element) {
				if(element.product_id===$productid){
					element.quantity=element.quantity+1;
				}
			}, this);
		}
		$localstorage.setObject("Cart",$scope.cart);
		$rootScopes.store("mycart_count",$scope.cart.length);
	};
	$http.get('../data.json').success(function(data) {    
        $scope.dummyproducts=data;
    }).error(function(e){
		alert("Unable to Fetch Data from File");
		console.log("Unable to fetch data from the file");
	});
		$scope.refresh_cache=function($image){
		    $image=$image+"?"+Math.floor(Math.random())+Math.random();
			return $image;
			// return n;
		};
}]);
app.controller('cart_controller',['$scope','$localstorage','$http','$rootScopes',function($scope,$localstorage,$http,$rootScopes){
    if($localstorage.getObject("Cart")){
		$scope.cart=$localstorage.getObject("Cart");
	}
	else{
		$scope.cart=[]
	}
	$scope.productList=[];
	$scope.cartvalue=$scope.cart.length;
	$http.get('../data.json').success(function(data) {    
        $scope.dummyproducts=data;
    }).error(function(e){
		alert("Unable to Fetch Data from File");
		console.log("Unable to fetch data from the file");
	});

	if($scope.cartvalue>0){
		$scope.dummyproducts.forEach(function(element) {
			$scope.cart.forEach(function(cacheelement) {
				if(cacheelement.product_id==element.product_id){
					$scope.productList.push(element);			
				}
			}, this);
		}, this);
	}else{
		$scope.productList=[];
	}
	$scope.remove=function($productid){
		$scope.cart.forEach(function(element) {
			if(element.product_id==$productid){
				var index = $scope.cart.indexOf(element);
					if (index > -1) {
						$scope.cart.splice(index, 1);
					}
			}
		}, this);
		$scope.productList.forEach(function(element) {
			if(element.product_id==$productid){
				var index = $scope.productList.indexOf(element);
					if (index > -1) {
						$scope.productList.splice(index, 1);
					}
			}
		}, this);
		$localstorage.setObject("Cart",$scope.cart);
		$rootScopes.store("mycart_count",$scope.cart.length);
		$scope.cartvalue=$scope.cart.length;
	}
	$scope.deletelocalstorage_on_checkout=function(){
		$localstorage.clear();
	}
	$scope.calculate_price=function($product_id,$product_Price){
		var product;
		$scope.cart.forEach(function(cacheelement) {
			console.log(cacheelement.product_id+" current but specified is "+$product_id+"and"+$product_Price+"is price and quantity is "+cacheelement.quantity);
			if(cacheelement.product_id==$product_id){
				console.log($product_Price+"is price and quantity inside  is "+cacheelement.quantity);
				product=$product_Price * cacheelement.quantity;		
			}
		}, this);
		return product;
	}
}]);

// // app.run(function ($rootScope) {
// //     $rootScope.$on('$rootScopes.stored', function (event, data) {
// //         console.log("$rootScopes.stored", data);
// //     });
// // });
app.factory('$rootScopes', function ($rootScope) {
    var mem = {};
 
    return {
        store: function (key, value) {
            mem[key] = value;
        },
        get: function (key) {
			if(mem[key]){
				return mem[key];
			}
			return false;
        }
    };
});