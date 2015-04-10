var magicListcontrollers = angular.module('magicListcontrollers', []);

magicListcontrollers.controller('home', ['$scope', 'AppRoute', '$state', '$localStorage', '$rootScope', '$window',
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

magicListcontrollers.controller('app', ['$scope', '$modal', '$log', 'AppRoute', '$rootScope', '$state', '$localStorage', '$upload',
	function($scope, $modal, $log, AppRoute, $rootScope, $state, $localStorage, $upload) {

		$scope.minDate = new Date;
		$scope.newTaskName = "";
		$scope.newSubtaskName = "";
		$scope.showComplitedTasks = false;
		
		$scope.$watch('files', function () {
        	$scope.upload($scope.files);
    	});

    	$scope.upload = function (files) {
        	if (files && files.length) {
            	for (var i = 0; i < files.length; i++) {
                	var file = files[i];
                	$upload.upload({
                    	url: '/upload',
                    	fields: {'taskId': $rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber]._id},
                    	file: file
                	}).progress(function (evt) {
                    	var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    	console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                	}).success(function (data, status, headers, config) {
                		$rootScope.user.lists[$rootScope.currentListNumber]=data;
                    	console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    	io.emit('update', $rootScope.user.lists[$rootScope.currentListNumber]._id);
                	});
            	}
        	}
    	};

		$scope.addActiveClass = function(index) {
			return index==$rootScope.currentListNumber ? true : false;
		};

		$scope.addTask = function() {
			if($scope.newTaskName && $rootScope.user.lists[$rootScope.currentListNumber]) {

				AppRoute.createTask({ listId: $rootScope.user.lists[$rootScope.currentListNumber]._id, taskName: $scope.newTaskName })
					.success(function(resData) {
                		$rootScope.user.lists[$rootScope.currentListNumber].tasks.push(resData);
                		io.emit('update', $rootScope.user.lists[$rootScope.currentListNumber]._id);             	
            	});

				$scope.newTaskName="";
			}
		};

		$scope.changeActiveList = function(index) {
			if (index!=$rootScope.currentListNumber) {
				$rootScope.currentTaskNumber = null;
				$rootScope.currentListNumber = index;
				$state.go('app', { listId: $rootScope.user.lists[index]._id });
			}
		};

		$scope.addList = function () {

			var modalInstance = $modal.open({
				templateUrl: 'addList.html',
				controller: 'addListCtrl'
			});

			modalInstance.result.then(function (newListName) {

				AppRoute.createList({ listName: newListName, ownerId: $rootScope.user._id, ownerEmail: $rootScope.user.email })
					.success(function(resData) {
						$rootScope.rooms.push(resData._id);
                		$rootScope.user.lists.push(resData);
                		io.emit('userRooms', resData._id);
                		$rootScope.currentListNumber=$rootScope.user.lists.length-1;
                		$rootScope.currentTaskNumber = null;
                		if($rootScope.user.lists.length===1) $state.go('app', { listId: $rootScope.user.lists[0]._id });
                		else $state.go('app', { listId: resData._id });
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
						io.emit('leaveListRoom', $rootScope.user.lists[index]._id);
                		if ($rootScope.currentListNumber==$rootScope.user.lists.length-1) {
                			if ($rootScope.user.lists.length==1) $rootScope.currentListNumber=0;
                			else $rootScope.currentListNumber--;
                		};
                		$rootScope.user.lists.splice(index, 1);
                		$rootScope.currentTaskNumber = null;
                		$rootScope.rooms = $rootScope.user.lists.map(function(el) {
							return el._id;
						}).concat($rootScope.user.inbox.map(function(el) {
							return el._id;
						}));
            	});

			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});

		};

		$scope.showTaskConfiguration = function (index) {
			return index===$rootScope.currentTaskNumber ? true : false;
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
			AppRoute.changeTaskStatus({ taskId: $rootScope.user.lists[$rootScope.currentListNumber].tasks[index]._id, currentTaskStatus: $rootScope.user.lists[$rootScope.currentListNumber].tasks[index].complited })
				.success(function() {
         			$rootScope.user.lists[$rootScope.currentListNumber].tasks[index].complited=!$rootScope.user.lists[$rootScope.currentListNumber].tasks[index].complited;
         			io.emit('update', $rootScope.user.lists[$rootScope.currentListNumber]._id);
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
						io.emit('leaveListRoom', $rootScope.user.lists[index]._id);
                		if ($rootScope.currentListNumber==$rootScope.user.lists.length-1) {
                			if ($rootScope.user.lists.length==1) $rootScope.currentListNumber=0;
                			else $rootScope.currentListNumber--;
                		};
                		$rootScope.user.lists.splice(index, 1);
                		$rootScope.rooms = $rootScope.user.lists.map(function(el) {
							return el._id;
						}).concat($rootScope.user.inbox.map(function(el) {
							return el._id;
						}));
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
			$rootScope.pageNotReloaded=true;
			$localStorage.user=null;
			$state.go('home');
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
					io.emit('leaveListRoom', inboxList._id);
					io.emit('update', inboxList._id);
					$rootScope.user.inbox=$rootScope.user.inbox.filter(function(el) {
						if (el._id!=inboxList._id) return el;
					});

					$rootScope.rooms = $rootScope.user.lists.map(function(el) {
						return el._id;
					}).concat($rootScope.user.inbox.map(function(el) {
						return el._id;
					}));
                });
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
			if (!$rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber].deadline) $rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber].deadline="";
			AppRoute.updateDate( { taskId: $rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber]._id, newDate: $rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber].deadline } )
				.success(function() {
					io.emit('update', $rootScope.user.lists[$rootScope.currentListNumber]._id);
            	});
		}

		$scope.updateDescription = function () {
			if(!$rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber].description) $rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber].description="";
			AppRoute.updateDescription( { taskId: $rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber]._id, newDescription: $rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber].description } )
				.success(function() {
					io.emit('update', $rootScope.user.lists[$rootScope.currentListNumber]._id);
            	});
		}

		$scope.addSubtask = function() {
			if($scope.newSubtaskName) {

				AppRoute.createSubtask({ taskId: $rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber]._id, subtaskName: $scope.newSubtaskName })
					.success(function(resData) {
                		$rootScope.user.lists[$rootScope.currentListNumber]=resData;
                		io.emit('update', $rootScope.user.lists[$rootScope.currentListNumber]._id);             	
            	});

				$scope.newSubtaskName="";
			}
		};

		$scope.changeSubtaskStatus = function(index) {

			var subtasks = $rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber].subtasks;
			subtasks[index].complited=!subtasks[index].complited;

			AppRoute.changeSubtask({ taskId: $rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber]._id, subtasks: subtasks })
				.success(function() {
         			$rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber].subtasks[index].complited=subtasks[index].complited;
         			io.emit('update', $rootScope.user.lists[$rootScope.currentListNumber]._id);
            });
		}

		$scope.changeSubtask = function (index) {
			AppRoute.changeSubtask({ taskId: $rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber]._id, subtasks: $rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber].subtasks })
				.success(function() {
         			io.emit('update', $rootScope.user.lists[$rootScope.currentListNumber]._id);
            });
		}

		$scope.checkAttachments = function (el) {
			return el.extension == ('jpg'||'png'||'jpeg') ? true : false;
		}

		$scope.removeFile = function (file, index, size) {

			var modalInstance = $modal.open({
      		templateUrl: 'delete.html',
      		controller: 'deleteCtrl',
      		size: size
    		});

			modalInstance.result.then(function () {

				AppRoute.removeFile({ taskId: $rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber]._id, file: file })
				.success(function() {
					$rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber].attachments.splice(index, 1);
         			io.emit('update', $rootScope.user.lists[$rootScope.currentListNumber]._id);
            });

			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});

		}

		$scope.removeSubtask = function (subtask, index, size) {

			var modalInstance = $modal.open({
      		templateUrl: 'delete.html',
      		controller: 'deleteCtrl',
      		size: size
    		});

			modalInstance.result.then(function () {

				AppRoute.removeSubtask({ subtask: subtask, taskId: $rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber]._id })
				.success(function() {
					$rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber].subtasks.splice(index, 1);
         			io.emit('update', $rootScope.user.lists[$rootScope.currentListNumber]._id);
            });

			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});

		}

		$scope.removeTask = function (size) {

			var modalInstance = $modal.open({
      		templateUrl: 'delete.html',
      		controller: 'deleteCtrl',
      		size: size
    		});

			modalInstance.result.then(function () {

				AppRoute.removeTask({ task: $rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber] })
				.success(function() {
					$rootScope.user.lists[$rootScope.currentListNumber].tasks.splice($rootScope.currentTaskNumber, 1);
					$rootScope.currentTaskNumber=null;
         			io.emit('update', $rootScope.user.lists[$rootScope.currentListNumber]._id);
            });

			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});

		}

		$scope.changeBackground = function() {

			var modalInstance = $modal.open({
      		templateUrl: 'changeBackground.html',
      		controller: 'changeBackgroundCtrl'
    		});

			modalInstance.result.then(null, function () {
				$log.info('Modal dismissed at: ' + new Date());
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

magicListcontrollers.controller('deleteCtrl', ['$scope', '$modalInstance',
	function ($scope, $modalInstance) {

	$scope.save = function () {
		$modalInstance.close();
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

	$scope.index=index;
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

magicListcontrollers.controller('changeBackgroundCtrl', ['$scope', '$modalInstance', '$rootScope', 'AppRoute',
	function ($scope, $modalInstance, $rootScope, AppRoute) {

	$scope.applyBackground = function(newBackground) {
		AppRoute.changeBackground({userId: $rootScope.user._id, newBackground: newBackground})
		.success(function() {
			$rootScope.user.background = newBackground;
		})
	}

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

}]);