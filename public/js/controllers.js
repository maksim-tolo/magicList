var magicListcontrollers = angular.module('magicListcontrollers', []);

magicListcontrollers.controller('home', ['$scope', 'AppRoute', '$state',
	function($scope, AppRoute, $state) {

		AppRoute.get()
			.success(function(data) {
                if(data=="logged") $state.go('app');
            });
		
	}]);

magicListcontrollers.controller('signin', ['$scope', 'AppRoute', '$rootScope', '$state',
	function($scope, AppRoute, $rootScope, $state) {
		$scope.user = {
			email: "",
			password: ""
		}

		$scope.emailIsEmpty=false;
		$scope.passwordIsEmpty=false;

		$scope.submitForm = function() {
			AppRoute.signin($scope.user)
			.success(function(data) {
                if(data) {
                	$rootScope.user=data;
                	$state.go('app');
                }
            });
		};

	}]);

magicListcontrollers.controller('signup', ['$scope', '$state', 'AppRoute', '$rootScope',
	function($scope, $state, AppRoute, $rootScope) {

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
			AppRoute.signup($scope.user)
			.success(function(data) {
                if(data) {
                	$rootScope.user=data;
                	$state.go('app');
                }
            })
            .error(function(data) {
                alert(data)
            });
		};

	}]);

magicListcontrollers.controller('app', ['$scope', '$modal', '$log', '$stateParams', 'AppRoute', '$rootScope',
	function($scope, $modal, $log, $stateParams, AppRoute, $rootScope) {

		$scope.lists = $rootScope.user.lists;
		$scope.displayTaskProperties = false;
		$scope.newTaskName = "";
		$scope.currentListNumber = 0;
		$scope.activeListNode = "";

		$scope.addActiveClassOnLoad = function() {
			if (!$scope.activeListNode && $scope.lists.length && !$stateParams.listName) {
				$scope.activeListNode = document.querySelector(".lists").children[0];
				$scope.activeListNode.classList.add('active');
			};
			if (!$scope.activeListNode && $scope.lists.length && $stateParams.listName) {
				
			}
		};

		function List() {
			this.owner = "";
			this.listName = "";
			this.members = [];
			this.tasks = [];
		}

		function Task() {
			this.taskName = "";
			this.complited = "";
			this.attachments = [];
			this.description = "";
			this.deadline = "";
			this.subtasks = [];
		};

		function SubTask() {
			this.subtasksName = "";
			this.complited=false;
		};

		$scope.addTask = function() {
			if($scope.newTaskName && $scope.lists[$scope.currentListNumber]) {
				var task = new Task();
				task.taskName=$scope.newTaskName;
				if (!$scope.lists) {

				};
				$scope.lists[$scope.currentListNumber].tasks.push(task);
				//здесь обновить данные сервера
				$scope.newTaskName="";
			}
		};

		$scope.activeList = function(e, currentList) {
			if($scope.activeListNode) angular.element($scope.activeListNode).removeClass('active');
			$scope.activeListNode = e.target;
			angular.element($scope.activeListNode).addClass('active');
			$scope.currentListNumber = $scope.lists.indexOf(currentList);
			alert($stateParams.listName)
		};

		$scope.open = function (size) {

			var modalInstance = $modal.open({
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
				size: size
			});

			modalInstance.result.then(function (newListName) {
				var list = new List;
				list.listName = newListName;
				$scope.lists.push(list);

			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});

		};
	}]);

magicListcontrollers.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

	$scope.newListName="";
	$scope.save = function () {
		$modalInstance.close($scope.newListName);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
});