var magicListcontrollers = angular.module('magicListcontrollers', []);

magicListcontrollers.controller('signup', ['$scope', '$http', '$state',
	function($scope, $http, $state) {

		$scope.user={
			firstName: '',
			lastName: '',
			email: '',
			password: ''
		};

		$scope.passwordAgain='';

		$scope.firstNameIsEmpty=false;
		$scope.lastNameIsEmpty=false;
		$scope.emailIsEmpty=false;
		$scope.emailIsValid=false;
		$scope.passwordIsEmpty=false;
		$scope.passwordIsShort=false;
		$scope.passwordsIsComply=false;
		$scope.emailIsAlreadyExist=false;

		$scope.checkEmail = function() {
			//проверка на занятость имейла
		}

		$scope.comparePassword = function() {
			return $scope.user.password == $scope.passwordAgain ? false : true;
		};

		$scope.submitForm = function() {
			$http.post('/api/signup', $scope.user)

			.success(function(data) {
				$state.go('app');
			});
		};

	}]);

magicListcontrollers.controller('signin', ['$scope',
	function($scope) {

		$scope.email = "";
		$scope.password = "";

		$scope.emailIsEmpty=false;
		$scope.passwordIsEmpty=false;

		$scope.submitForm = function() {
			//отправка формы
		}
	}]);

magicListcontrollers.controller('app', ['$scope',
	function($scope) {

		$scope.displayTaskProperties = false;
		$scope.newTaskName="";
		$scope.addTask = function() {
			alert($scope.newTaskName);
		};

	}]);