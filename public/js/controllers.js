var magicListcontrollers = angular.module('magicListcontrollers', []);

magicListcontrollers.controller('login', ['$scope', 'AppRoute', '$state', '$localStorage', '$rootScope',
	function($scope, AppRoute, $state, $localStorage, $rootScope) {
		$scope.user = {
			email: "",
			password: ""
		}

		$scope.emailIsEmpty=false;
		$scope.passwordIsEmpty=false;
		$scope.userIsNotExist=false;

		$scope.submitForm = function() {
			AppRoute.login($scope.user)
			.success(function(data) {
                $localStorage.user=data;
                $rootScope.user=$localStorage.user;
                if($rootScope.user.lists.length) $state.go('app', { listId: $rootScope.user.lists[0]._id });
                else $state.go('app');
            })
            .error(function() {
                $scope.userIsNotExist=true;
            });
		};

	}]);

magicListcontrollers.controller('signup', ['$scope', '$state', 'AppRoute', '$localStorage', '$rootScope',
	function($scope, $state, AppRoute, $localStorage, $rootScope) {

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
                if(data) {
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
                	$localStorage.user=data;
                	$rootScope.user=$localStorage.user;
                	$state.go('app');
                }
            });
		};

	}]);

magicListcontrollers.controller('app', ['$scope', '$modal', '$log', '$stateParams', 'AppRoute', '$rootScope', '$state', '$localStorage',
	function($scope, $modal, $log, $stateParams, AppRoute, $rootScope, $state, $localStorage) {

		$scope.lists = $rootScope.user.lists;
		$scope.currentTaskNumber = null;
		$scope.newTaskName = "";
		$scope.showComplitedTasks = false;

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

				AppRoute.createList({ listName: newListName, ownerId: $rootScope.user._id, ownerEmail: $rootScope.user.email })
					.success(function(resData) {
                		$rootScope.user.lists.push(resData);
                		if($rootScope.user.lists.length===1) $state.go('app', { listId: $scope.lists[0]._id });
            	});

			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});

		};

		$scope.renameList = function (index) {

			var modalInstance = $modal.open({
      		templateUrl: 'renameList.html',
      		controller: 'renameListCtrl',
      		resolve: {
        		index: function () {
          			return index;
        		}
      		}
    		});

			modalInstance.result.then(function (newListName) {

				AppRoute.changeListName({ listName: newListName, listId: $rootScope.user.lists[index]._id })
					.success(function() {
                		$rootScope.user.lists[index].listName = newListName;           	
            	});

			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});

		};

		$scope.removeList = function (size, index) {

			var modalInstance = $modal.open({
      		templateUrl: 'removeList.html',
      		controller: 'removeListCtrl',
      		size: size,
      		resolve: {
        		index: function () {
          			return index;
        		}
      		}
    		});

			modalInstance.result.then(function () {

				AppRoute.removeList({ listId: $rootScope.user.lists[index]._id })
					.success(function(resData) {
                		if ($scope.currentListNumber==$rootScope.user.lists.length-1) {
                			if ($rootScope.user.lists.length==1) $scope.currentListNumber=0;
                			else $scope.currentListNumber--;
                		};
                		$rootScope.user.lists.splice(index, 1);           	
            	});

			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});

		};

		$scope.showTaskConfiguration = function (index) {
			return index===$scope.currentTaskNumber ? true : false;
		};

		$scope.menuOptions = function (index) {

			var action = $scope.addListMembers;
			var actionName = 'Добавить участников';
			var action2 = $scope.leaveList;
			var action2Name = 'Покинуть';

			if($rootScope.user.lists[index].owner==$rootScope.user._id) {
				//actionName = 'Изменить участников';
				action2Name = 'Удалить';
				//action = $scope.changeListMembers;
				action2 = $scope.removeList;			
			};

			return [
				[$rootScope.user.lists[index].listName, function () {
        		$scope.changeActiveList(index);
    			}],
    			null,
    			['Переименовать', function () {
        			$scope.renameList(index);
    			}],
    			[actionName, function () {
        			action(index);
   				}],
    			[action2Name, function () {
        			action2('sm', index);
   				}]
			];
		};

		$scope.changeTaskStatus = function (index) {
			AppRoute.changeTaskStatus({ taskId: $rootScope.user.lists[$scope.currentListNumber].tasks[index]._id })
				.success(function() {
         			$rootScope.user.lists[$scope.currentListNumber].tasks[index].complited=!$rootScope.user.lists[$scope.currentListNumber].tasks[index].complited;
            });
		};

		$scope.calcNumberOfActiveTasks = function (list) {
			if($scope.lists.length) {
				return list.tasks.filter(function(el) {
					if (!el.complited) return el;
				}).length;
			}
		};

		$scope.addListMembers = function (index) {
			var modalInstance = $modal.open({
				templateUrl: 'addListMembers.html',
				controller: 'addListMembersCtrl',
				resolve: {
        		index: function () {
          			return index;
        		}
      		}
			});

			modalInstance.result.then(function (newListMembers) {

				AppRoute.addListMembersRequest({ listMembers: newListMembers })
					.success(function(resData) {
                		$rootScope.user.lists.push(resData);
                		if($rootScope.user.lists.length===1) $state.go('app', { listId: $scope.lists[0]._id });
            	});

			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		}

		$scope.endSession = function () {
			$localStorage.user=null;
			$state.go('login');
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

magicListcontrollers.controller('renameListCtrl', ['$scope', '$rootScope', '$modalInstance', 'index',
	function ($scope, $rootScope, $modalInstance, index) {

	$scope.newListName=$rootScope.user.lists[index].listName;

	$scope.save = function () {
		$modalInstance.close($scope.newListName);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);

magicListcontrollers.controller('removeListCtrl', ['$scope', '$rootScope', '$modalInstance', 'index',
	function ($scope, $rootScope, $modalInstance, index) {

	$scope.listName='"'+$rootScope.user.lists[index].listName+'"';

	$scope.save = function () {
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);

magicListcontrollers.controller('addListMembersCtrl', ['$scope', '$modalInstance', '$rootScope', 'index',
	function ($scope, $modalInstance, $rootScope, index) {

	$scope.listMembers = $rootScope.user.lists[index].membersEmail;

	$scope.save = function () {
		$modalInstance.close($scope.newListName);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);