var magicListApp = angular.module('magicListApp', [
  'ui.router',
  'ui.bootstrap.modal',
  'magicListcontrollers',
  'ui.bootstrap.transition'
  ]);

magicListApp.config(['$stateProvider', '$urlRouterProvider',
 function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/lists/");

  $stateProvider
  .state('app', {
    url: "/lists/:listName"
  });

}]);
