var app = angular.module('bivatoAPP', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'templates/home.html',
		controller: 'homeController'
	})
	.when('/reserva', {
		templateUrl: 'templates/reserva.html',
		controller: 'reservaController'
	})
	.when('/contato', {
		templateUrl: 'templates/contato.html',
		controller: 'contatoController'
	}).otherwise({
		redirectTo: '/'
	});

	$locationProvider.html5Mode(true);
});