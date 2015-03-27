var magicListApp = angular.module('magicListApp', [
  'ui.router',
  'ui.bootstrap.modal',
  'magicListcontrollers',
  'AppService',
  'ngStorage',
  'ui.bootstrap.contextMenu',
  'ui.bootstrap.dropdown'
  ]);

magicListApp.config(['$stateProvider', '$urlRouterProvider',
 function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/signin");

  $stateProvider
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