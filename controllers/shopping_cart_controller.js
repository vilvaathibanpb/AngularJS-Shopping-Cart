var app=angular.module('shoppingCart_app', ['ngRoute']);
//Routing 
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

//LocalStorage Services
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

//Home_Controller
app.controller('home_controller',['$scope','$http','$localstorage','$rootScopes',function($scope,$http,$localstorage,$rootScopes){
	if($localstorage.getObject("Cart")){
		$scope.cart=$localstorage.getObject("Cart");
	}
	else{
		$scope.cart=[]
	}
	$scope.cartvalue=$scope.cart.length;
	//Add to Cart
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
	
	//Fetch Input data
	$http.get('../data.json').success(function(data) {    
        $scope.dummyproducts=data;
    }).error(function(e){
		alert("Unable to Fetch Data from File");
		console.log("Unable to fetch data from the file");
	});
		$scope.refresh_cache=function($image){
		    $image=$image+"?"+Math.floor(Math.random())+Math.random();
			return $image;			
		};
}]);

//Cart Controller
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
	//Remove product from cart
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
	//Complete Order
	$scope.deletelocalstorage_on_checkout=function(){
		$localstorage.clear();
	}
	//Update Price
	$scope.calculate_price=function($product_id,$product_Price){
		var product;
		$scope.cart.forEach(function(cacheelement) {			
			if(cacheelement.product_id==$product_id){		
				product=$product_Price * cacheelement.quantity;		
			}
		}, this);
		return product;
	}

	//Increment quantity
	$scope.addqty=function($product_id){		
		$scope.cart.forEach(function(cacheelement) {			
			if(cacheelement.product_id==$product_id){
				cacheelement.quantity=cacheelement.quantity + 1;
			}
		}, this);
			$localstorage.setObject("Cart",$scope.cart);
			$rootScopes.store("mycart_count",$scope.cart.length);
			$scope.cartvalue=$scope.cart.length;
	}
	//Decrement quantity
	$scope.subqty=function($product_id){		
		$scope.cart.forEach(function(cacheelement) {			
			if(cacheelement.product_id==$product_id){
				if(cacheelement.quantity - 1 >= 1){
				cacheelement.quantity=cacheelement.quantity - 1;
				}else{
					cacheelement.quantity=1;
				}
			}
		}, this);
		$localstorage.setObject("Cart",$scope.cart);
		$rootScopes.store("mycart_count",$scope.cart.length);
		$scope.cartvalue=$scope.cart.length;
	}
	//Get Quantity
	$scope.getqty=function($product_id){
		var qty;
		$scope.cart.forEach(function(cacheelement) {			
			if(cacheelement.product_id==$product_id){
				qty= cacheelement.quantity;
			}
		}, this);
		if(qty>0){
		return qty;
		}else{
			return 1;
		}
	}
}]);

//RootScope services
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