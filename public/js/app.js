var io = io.connect();

var magicListApp = angular.module('magicListApp', [
  'ui.router',
  'ui.bootstrap.modal',
  'magicListcontrollers',
  'AppService',
  'ngStorage',
  'ui.bootstrap.contextMenu',
  'ui.bootstrap.dropdown',
  'magicListDirectives',
  'ui.bootstrap.datepicker',
  'angularFileUpload',
  'magicListFilters'
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