var magicListcontrollers = angular.module('magicListcontrollers', []);

magicListcontrollers.controller('signin', ['$scope', 'AppRoute', '$state', '$sessionStorage',
	function($scope, AppRoute, $state, $sessionStorage) {
		$scope.user = {
			email: "",
			password: ""
		}

		$scope.emailIsEmpty=false;
		$scope.passwordIsEmpty=false;
		$scope.userIsNotExist=false;

		$scope.submitForm = function() {
			AppRoute.signin($scope.user)
			.success(function(data) {
                $sessionStorage.user=data;
                $state.go('app');
            })
            .error(function() {
                $scope.userIsNotExist=true;
            });
		};

	}]);

magicListcontrollers.controller('signup', ['$scope', '$state', 'AppRoute', '$sessionStorage',
	function($scope, $state, AppRoute, $sessionStorage) {

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
			if ($scope.user.email) {
			AppRoute.checkEmail( { email: $scope.user.email } )
			.success(function(data) {
                if(data=="exist") {
                	$scope.emailIsAlreadyExist=true;
                }
            });
		}
		}

		$scope.comparePassword = function() {
			return $scope.user.password == $scope.passwordAgain ? false : true;
		};

		$scope.submitForm = function() {
			AppRoute.signup($scope.user)
			.success(function(data) {
                if(data) {
                	$sessionStorage.user=data;
                	$state.go('app');
                }
            })
            .error(function(data) {
                alert(data)
            });
		};

	}]);

magicListcontrollers.controller('app', ['$scope', '$modal', '$log', '$stateParams', 'AppRoute', '$rootScope', '$state',
	function($scope, $modal, $log, $stateParams, AppRoute, $rootScope, $state) {

		$scope.lists = $rootScope.user.lists;
		$scope.currentTaskNumber = null;
		$scope.newTaskName = "";

		if ($stateParams.listId) {
			$scope.currentListNumber = (function(){
				for (var i = 0; i < $scope.lists.length; i++) {
					if ($scope.lists[i]._id == $stateParams.listId) return i;
				}
				return 0;
			})();
		} else {
			$scope.currentListNumber = 0;
		}

		$scope.addActiveClass = function(index) {
			return index==$scope.currentListNumber ? true : false;
		};

		$scope.addTask = function() {
			if($scope.newTaskName && $scope.lists[$scope.currentListNumber]) {

				AppRoute.createTask({ listId: $scope.lists[$scope.currentListNumber]._id, taskName: $scope.newTaskName })
					.success(function(resData) {
                		$rootScope.user.lists[$scope.currentListNumber].tasks.push(resData);             	
            	});

				//$scope.lists[$scope.currentListNumber].tasks.push(task);
				//здесь обновить данные сервера
				$scope.newTaskName="";
			}
		};

		$scope.changeActiveList = function(index) {
			$state.go('app', { listId: $scope.lists[index]._id });
		};

		$scope.addList = function () {

			var modalInstance = $modal.open({
				templateUrl: 'addList.html',
				controller: 'addListCtrl'
			});

			modalInstance.result.then(function (newListName) {

				AppRoute.createList({ listName: newListName, ownerId: $rootScope.user._id })
					.success(function(resData) {
                		$rootScope.user.lists.push(resData);             	
            	});

			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});

		};

		$scope.listConfiguration = function (index) {

			var modalInstance = $modal.open({
      		templateUrl: 'listConfiguration.html',
      		controller: 'listConfigurationCtrl',
      		resolve: {
        		index: function () {
          			return index;
        		}
      		}
    		});

			modalInstance.result.then(function (newListName) {

				AppRoute.changeListName({ listName: newListName, listId: $rootScope.user.lists[index]._id })
					.success(function(resData) {
                		if (resData="success") {
                			$rootScope.user.lists[index].listName = newListName;
                		};             	
            	});

			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});

		};

		$scope.showTaskConfiguration = function (index) {
			return index===$scope.currentTaskNumber ? true : false;
		}

	}]);

magicListcontrollers.controller('addListCtrl', ['$scope', '$modalInstance',
	function ($scope, $modalInstance) {

	$scope.newListName="";
	$scope.save = function () {
		$modalInstance.close($scope.newListName);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);

magicListcontrollers.controller('listConfigurationCtrl', ['$scope', '$rootScope', '$modalInstance', 'index',
	function ($scope, $rootScope, $modalInstance, index) {

	$scope.newListName=$rootScope.user.lists[index].listName;

	$scope.save = function () {
		$modalInstance.close($scope.newListName);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);