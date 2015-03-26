var magicListApp = angular.module('magicListApp', [
  'ui.router',
  'ui.bootstrap.modal',
  'magicListcontrollers',
  'ui.bootstrap.transition',
  'AppService',
  'ngStorage',
  'ui.bootstrap.contextMenu'
  ]);

magicListApp.config(['$stateProvider', '$urlRouterProvider',
 function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/signin");

  $stateProvider
  .state('signin', {
    url: "/signin",
    templateUrl: "template/signin.html",
    controller: "signin",
    data: {
      'noLogin': true
    }
  })
  .state('signup', {
    url: "/signup",
    templateUrl: "template/signup.html",
    controller: "signup",
    data: {
      'noLogin': true
    }
  })
  .state('app', {
    url: "/app/:listId",
    templateUrl: "template/app.html",
    controller: "app"
  });

}]);

magicListApp.run(['$rootScope', '$state', '$stateParams', 'SessionService',
  function ($rootScope, $state, $stateParams, SessionService) {

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.user = null;

    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState, fromParams) {
        SessionService.checkAccess(event, toState, toParams, fromState, fromParams);
      }
    );
  }
]);