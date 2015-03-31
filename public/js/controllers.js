var magicListcontrollers = angular.module('magicListcontrollers', []);

magicListcontrollers.controller('login', ['$scope', 'AppRoute', '$state', '$localStorage', '$rootScope', '$window',
	function($scope, AppRoute, $state, $localStorage, $rootScope, $window) {
		$scope.user = {
			email: "",
			password: ""
		}

		$scope.emailIsEmpty=false;
		$scope.passwordIsEmpty=false;
		$scope.userIsNotExist=false;
		$scope.showNavbar=false;

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

		io.on('updateUser', function() {
    		$scope.accountSync();
		});

		$scope.minDate = new Date;
		$scope.newTaskName = "";
		$scope.showComplitedTasks = false;
		$scope.currentTaskNumber = null;
		$scope.rooms = $rootScope.user.lists.map(function(el) {
			return el._id;
		}).concat($rootScope.user.inbox.map(function(el) {
			return el._id;
		}));

		io.emit('listRooms', $scope.rooms);
		io.emit('userRooms', $rootScope.user.email);

		if ($stateParams.listId) {
			$scope.currentListNumber = (function(){
				for (var i = 0; i < $rootScope.user.lists.length; i++) {
					if ($rootScope.user.lists[i]._id == $stateParams.listId) return i;
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
			if($scope.newTaskName && $rootScope.user.lists[$scope.currentListNumber]) {

				AppRoute.createTask({ listId: $rootScope.user.lists[$scope.currentListNumber]._id, taskName: $scope.newTaskName })
					.success(function(resData) {
                		$rootScope.user.lists[$scope.currentListNumber].tasks.push(resData);
                		io.emit('update', $rootScope.user.lists[$scope.currentListNumber]._id);             	
            	});

				$scope.newTaskName="";
			}
		};

		$scope.changeActiveList = function(index) {
			$state.go('app', { listId: $rootScope.user.lists[index]._id });
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
                		if($rootScope.user.lists.length===1) $state.go('app', { listId: $rootScope.user.lists[0]._id });
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
                		io.emit('update', $rootScope.user.lists[index]._id);           	
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
						io.emit('update', $rootScope.user.lists[index]._id);
                		if ($scope.currentListNumber==$rootScope.user.lists.length-1) {
                			if ($rootScope.user.lists.length==1) $scope.currentListNumber=0;
                			else $scope.currentListNumber--;
                		};
                		$rootScope.user.lists.splice(index, 1);
                		$scope.currentTaskNumber = null;
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
				actionName = 'Изменить участников';
				action2Name = 'Удалить';
				action = $scope.changeListMembers;
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

		$scope.changeListMembers = function (index) {
			var modalInstance = $modal.open({
      		templateUrl: 'changeListMembers.html',
      		controller: 'changeListMembersCtrl',
      		resolve: {
        		index: function () {
          			return index;
        		}
      		}
    		});

			modalInstance.result.then(null, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});

		}

		$scope.changeTaskStatus = function (index) {
			AppRoute.changeTaskStatus({ taskId: $rootScope.user.lists[$scope.currentListNumber].tasks[index]._id })
				.success(function() {
         			$rootScope.user.lists[$scope.currentListNumber].tasks[index].complited=!$rootScope.user.lists[$scope.currentListNumber].tasks[index].complited;
         			io.emit('update', $rootScope.user.lists[$scope.currentListNumber]._id);
            });
		};

		$scope.calcNumberOfActiveTasks = function (list) {
			if($rootScope.user.lists.length) {
				return list.tasks.filter(function(el) {
					if (!el.complited) return el;
				}).length;
			}
		};

		$scope.leaveList = function (size, index) {

			var modalInstance = $modal.open({
      		templateUrl: 'leaveList.html',
      		controller: 'leaveListCtrl',
      		size: size,
      		resolve: {
        		index: function () {
          			return index;
        		}
      		}
    		});

			modalInstance.result.then(function () {

				AppRoute.leaveList({ userEmail: $rootScope.user.email, listId: $rootScope.user.lists[index]._id })
					.success(function() {
						io.emit('update', $rootScope.user.lists[index]._id);
                		if ($scope.currentListNumber==$rootScope.user.lists.length-1) {
                			if ($rootScope.user.lists.length==1) $scope.currentListNumber=0;
                			else $scope.currentListNumber--;
                		};
                		$rootScope.user.lists.splice(index, 1);      		 
            	});

			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});

		}

		$scope.addListMembers = function (index) {
			var modalInstance = $modal.open({
				templateUrl: 'addListMembers.html',
				controller: 'changeListMembersCtrl',
				resolve: {
        		index: function () {
          			return index;
        		}
      		}
			});

			modalInstance.result.then(null, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		}

		$scope.endSession = function () {
			$localStorage.user=null;
			$state.go('login');
		}

		$scope.accountSync = function () {
			AppRoute.getUser({ userId: $rootScope.user._id })
				.success(function(resData) {
					$localStorage.user = resData;
					$rootScope.user = $localStorage.user;

					$scope.rooms = $rootScope.user.lists.map(function(el) {
						return el._id;
					}).concat($rootScope.user.inbox.map(function(el) {
						return el._id;
					}));

					if($rootScope.user.inbox.length) io.emit('listRooms', $scope.rooms);
                });
		}

		$scope.confirmInboxList = function (inboxList) {
			AppRoute.confirmInboxList({ userEmail: $rootScope.user.email, listId: inboxList._id })
				.success(function() {
					io.emit('update', inboxList._id);
					inboxList.members.push($rootScope.user._id);
					$rootScope.user.lists.push(inboxList);
					$rootScope.user.inbox=$rootScope.user.inbox.filter(function(el) {
						if (el._id!=inboxList._id) return el;
					});
                });
		}

		$scope.rejectInboxList = function (inboxList) {
			AppRoute.rejectInboxList({ userEmail: $rootScope.user.email, listId: inboxList._id })
				.success(function() {
					io.emit('update', inboxList._id);
					$rootScope.user.inbox=$rootScope.user.inbox.filter(function(el) {
						if (el._id!=inboxList._id) return el;
					});
                });
		}

		$scope.showTaskProperties = function (taskNumber) {
			$scope.currentTaskNumber=taskNumber;
		}

		$scope.openDatepicker = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.openedDatepicker = true;
		};

		$scope.dateOptions = {
			startingDay: 1
		};

		$scope.updateDate = function () {
			if (!$rootScope.user.lists[$scope.currentListNumber].tasks[$scope.currentTaskNumber].deadline) $rootScope.user.lists[$scope.currentListNumber].tasks[$scope.currentTaskNumber].deadline="";
			AppRoute.updateDate( { taskId: $rootScope.user.lists[$scope.currentListNumber].tasks[$scope.currentTaskNumber]._id, newDate: $rootScope.user.lists[$scope.currentListNumber].tasks[$scope.currentTaskNumber].deadline } )
				.success(function() {
					io.emit('update', $rootScope.user.lists[$scope.currentListNumber]._id);
            	});
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

magicListcontrollers.controller('changeListMembersCtrl', ['$scope', '$modalInstance', '$rootScope', 'index', 'AppRoute',
	function ($scope, $modalInstance, $rootScope, index, AppRoute) {

	$scope.listMembers = $rootScope.user.lists[index].membersEmail;
	$scope.newMemberEmail="";
	$scope.userIsNotExist=false;
	$scope.userIsAlreadyInList=false;

	$scope.addMember = function () {
		for (var i = 0; i < $rootScope.user.lists[index].membersEmail.length; i++) {
			if ($scope.newMemberEmail == $rootScope.user.lists[index].membersEmail[i]) {
				$scope.userIsAlreadyInList=true;
				return;
			}
		};
		AppRoute.checkEmail( { email: $scope.newMemberEmail } )
			.success(function(data) {
                if(data) {
                	AppRoute.addListMember( { listId: $rootScope.user.lists[index]._id, userEmail: $scope.newMemberEmail } )
						.success(function() {
							$rootScope.user.lists[index].membersEmail.push($scope.newMemberEmail);
							$scope.newMemberEmail="";
							io.emit('update', $scope.newMemberEmail);
							io.emit('update', $rootScope.user.lists[index]._id);

            			});
                }
                else $scope.userIsNotExist=true;
            });
	}

	$scope.removeUserFromList = function (userEmail) {
		if (userEmail==$rootScope.user.email) return;
		AppRoute.removeUserFromList({ userEmail: userEmail, listId: $rootScope.user.lists[index]._id })
			.success(function(data) {
				io.emit('update', $rootScope.user.lists[index]._id);
        		$rootScope.user.lists[index].membersEmail=$rootScope.user.lists[index].membersEmail.filter(function(el) {
					if (el!=userEmail) return el;
				});
				$scope.listMembers = $rootScope.user.lists[index].membersEmail;
				$rootScope.user.lists[index].members=$rootScope.user.lists[index].members.filter(function(el) {
					if (el!=data) return el;
				});
        });
	}

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);

magicListcontrollers.controller('leaveListCtrl', ['$scope', '$rootScope', '$modalInstance', 'index',
	function ($scope, $rootScope, $modalInstance, index) {

	$scope.listName='"'+$rootScope.user.lists[index].listName+'"';

	$scope.save = function () {
		$modalInstance.close();
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);