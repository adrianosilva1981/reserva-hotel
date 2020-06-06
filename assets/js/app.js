var app = angular.module('bivatoAPP', ['ngRoute']);
var openSidebar = false;

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

app.run(function($rootScope, $location) {
	$rootScope.$on("$locationChangeStart", function(event, next, current) {
		if(openSidebar) {
			$("#sidebar .content").hide();
			openSidebar = false;
		}
    });
});

$('#open-side-bar').click(() => {
	openSidebar = !openSidebar;
	if(openSidebar) $("#sidebar .content").show();
	else $("#sidebar .content").hide();
});

