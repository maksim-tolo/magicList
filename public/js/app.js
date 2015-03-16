var magicListApp = angular.module('magicListApp', [
  'ui.router',
  'magicListcontrollers'
  ]);

magicListApp.config(['$stateProvider', '$urlRouterProvider',
 function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/signin");

  $stateProvider
  .state('notAuthenticated', {
    url: "/signin",
    templateUrl: "partials/signin.html",
    controller: "signin"
  })
  .state('signup', {
    url: "/signup",
    templateUrl: "partials/signup.html",
    controller: "signup"
  })
  .state('app', {
    url: "/app",
    templateUrl: "partials/app.html",
    controller: "app"
  });

}]);
