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
app.controller('home_controller',['$scope',function($scope){
    $scope.Welcome="Hello";
}]);
app.controller('cart_controller',['$scope',function($scope){
    $scope.Welcome="Hello";
}]);