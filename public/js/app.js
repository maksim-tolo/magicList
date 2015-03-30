var io = io.connect();

var magicListApp = angular.module('magicListApp', [
  'ui.router',
  'ui.bootstrap.modal',
  'magicListcontrollers',
  'AppService',
  'ngStorage',
  'ui.bootstrap.contextMenu',
  'ui.bootstrap.dropdown',
  'magicListDirectives'
  ]);

magicListApp.config(['$stateProvider', '$urlRouterProvider',
 function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/login");

  $stateProvider
  .state('login', {
    url: "/login",
    templateUrl: "template/login.html",
    controller: "login"
  })
  .state('signup', {
    url: "/signup",
    templateUrl: "template/signup.html",
    controller: "signup"
  })
  .state('app', {
    url: "/app/:listId",
    templateUrl: "template/app.html",
    controller: "app"
  });

}]);

magicListApp.run(['$rootScope', '$state', '$stateParams', 'SessionService',
  function ($rootScope, $state, $stateParams, SessionService) {
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        SessionService.checkAccess(event, toState, toParams, fromState, fromParams);
      }
    );
  }
]);