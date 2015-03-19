var magicListApp = angular.module('magicListApp', []);

magicListApp.controller('signin', ['$scope',
	function($scope) {

		$scope.email = "";
		$scope.password = "";

		$scope.emailIsEmpty=false;
		$scope.passwordIsEmpty=false;

		$scope.submitForm = function() {
			//отправка формы
		}
	}]);
