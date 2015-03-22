var magicListApp = angular.module('magicListApp', [
  'ui.router',
  'ui.bootstrap.modal',
  'magicListcontrollers',
  'ui.bootstrap.transition',
  'AppService'
  ]);

magicListApp.config(['$stateProvider', '$urlRouterProvider',
 function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/home");

  $stateProvider
  .state('home', {
    url: "/home",
    templateUrl: "template/home.html",
    controller: "home"
  })
  .state('signin', {
    url: "/signin",
    templateUrl: "template/signin.html",
    controller: "signin"
  })
  .state('signup', {
    url: "/signup",
    templateUrl: "template/signup.html",
    controller: "signup"
  })
  .state('app', {
    url: "/app/:listName",
    templateUrl: "template/app.html",
    controller: "app"
  });

}]);