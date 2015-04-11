var AppService = angular.module('AppService', []);

AppService.factory('AppRoute', ['$http',
	function($http) {

		return {

			signup : function(userData) {
				return $http.post('/signup', userData);
			},

			login : function(userData) {
				return $http.post('/login', userData);
			},

			checkEmail : function(email) {
				return $http.post('/api/checkEmail', email);
			},

			createList : function(data) {
				return $http.put('/api/createList', data);
			},

			createTask : function(data) {
				return $http.put('/api/createTask', data);
			},

			createSubtask : function(data) {
				return $http.put('/api/createSubtask', data);
			},

			changeListName : function(data) {
				return $http.post('/api/changeListName', data);
			},

			removeList : function(data) {
				return $http.post('/api/removeList', data);
			},

			changeTaskStatus : function(data) {
				return $http.post('/api/changeTaskStatus', data);
			},

			addListMember : function(data) {
				return $http.put('/api/addListMember', data);
			},

			getUser : function (data) {
				return $http.post('/api/getUser', data);
			},

			confirmInboxList : function (data) {
				return $http.post('/api/confirmInboxList', data);
			},

			rejectInboxList : function (data) {
				return $http.post('/api/rejectInboxList', data);
			},

			leaveList : function (data) {
				return $http.post('/api/leaveList', data);
			},

			removeUserFromList : function (data) {
				return $http.post('/api/removeUserFromList', data);
			},

			updateDate : function (data) {
				return $http.post('/api/updateDate', data);
			},

			updateDescription : function (data) {
				return $http.post('/api/updateDescription', data);
			},

			changeSubtask : function (data) {
				return $http.post('/api/changeSubtask', data);
			},

			removeFile : function (data) {
				return $http.post('/api/removeFile', data);
			},

			removeTask : function (data) {
				return $http.post('/api/removeTask', data);
			},

			removeSubtask : function (data) {
				return $http.post('/api/removeSubtask', data);
			},

			changeBackground : function (data) {
				return $http.post('/api/changeBackground', data);
			}

		}       

	}]);

AppService.service('SessionService', ['$localStorage', 'AppRoute', '$rootScope', '$state', '$translate',
	function($localStorage, AppRoute, $rootScope, $state, $translate) {

		this.checkAccess = function(event, toState, toParams, fromState, fromParams) {

			if ((toState.name=='home' || toState.name=='signup') && $localStorage.user) {

				if ($localStorage.lang) $translate.use($localStorage.lang);

				AppRoute.getUser({ userId: $localStorage.user._id })
					.success(function(resData) {
						$localStorage.user = resData;
						$rootScope.user = $localStorage.user;
                		event.preventDefault();
                		if($rootScope.user.lists.length) $state.go('app', { listId: $rootScope.user.lists[0]._id });
                		else $state.go('app');
                	})
                	.error(function() {
                		event.preventDefault();
                		$state.go('home');
                	});
			} else if (fromState.name!='app' && $localStorage.user) {

				if ($localStorage.lang) $translate.use($localStorage.lang);

				$translate(['app.modal.addListMembers', 'app.modal.leaveListButton', 'app.modal.changeListMembers', 'app.modal.deleteButton', 'app.modal.renameList']).then(function (translations) {
					$rootScope.addListMembersTranslation = translations['app.modal.addListMembers'];
					$rootScope.leaveListTranslation = translations['app.modal.leaveListButton'];
					$rootScope.changeListMembersTranslation = translations['app.modal.changeListMembers'];
					$rootScope.deleteTranslation = translations['app.modal.deleteButton'];
					$rootScope.renameListTranslation = translations['app.modal.renameList'];
				});

				if (!$rootScope.pageNotReloaded) io.on('updateUser', function() {
    				$rootScope.accountSync();
				});

				$rootScope.user = $localStorage.user;
				$rootScope.rooms = $rootScope.user.lists.map(function(el) {
					return el._id;
				}).concat($rootScope.user.inbox.map(function(el) {
					return el._id;
				}));

				$rootScope.currentTaskNumber = null;

				if (toParams.listId) {
					$rootScope.currentListNumber = (function(){
						for (var i = 0; i < $rootScope.user.lists.length; i++) {
							if ($rootScope.user.lists[i]._id == toParams.listId) return i;
						}
					return 0;
					})();
				} else {
					$rootScope.currentListNumber = 0;
				}

				$rootScope.accountSync = function () {
					AppRoute.getUser({ userId: $rootScope.user._id })
					.success(function(resData) {

						var previousRooms = $rootScope.rooms;
						$localStorage.user = resData;
						$rootScope.user = $localStorage.user;
						var newRooms = $rootScope.user.lists.map(function(el) {
							return el._id;
						}).concat($rootScope.user.inbox.map(function(el) {
							return el._id;
						}));

						for (var i = 0; i < previousRooms.length; i++) {
							var bp = false;
							for (var j = 0; j < newRooms.length; j++) {
								if(previousRooms[i]===newRooms[j]) {
									bp = true;
									newRooms.splice(j, 1)
									break;
								}
							};
							if(!bp) io.emit('leaveListRoom', previousRooms[i]);
						};

						if(newRooms.length) io.emit('listRooms', newRooms);

						$rootScope.rooms = $rootScope.user.lists.map(function(el) {
							return el._id;
						}).concat($rootScope.user.inbox.map(function(el) {
							return el._id;
						}));

						if (!$rootScope.user.lists[$rootScope.currentListNumber]) {

							$rootScope.currentTaskNumber = null;
							$rootScope.currentListNumber=0;
							if($rootScope.user.lists.length) $state.go('app', { listId: $rootScope.user.lists[0]._id });
							else $state.go('app');
						}

						else if (!$rootScope.user.lists[$rootScope.currentListNumber].tasks[$rootScope.currentTaskNumber]) $rootScope.currentTaskNumber=null;
						});
				}

				io.emit('listRooms', $rootScope.rooms);
				io.emit('userRooms', $rootScope.user.email);
			} else if (fromState.name=='app' && toState.name=='app' && toParams.listId!=fromParams.listId && $localStorage.user) {
				$rootScope.currentTaskNumber = null;

				if (toParams.listId) {
					$rootScope.currentListNumber = (function(){
						for (var i = 0; i < $rootScope.user.lists.length; i++) {
							if ($rootScope.user.lists[i]._id == toParams.listId) return i;
						}
					return 0;
					})();
				} else {
					$rootScope.currentListNumber = 0;
				}
			} else if (toState.name=='app' && !$localStorage.user) {
				event.preventDefault();
				$state.go('home');
			} else if ((toState.name=='home' || toState.name=='signup') && !$localStorage.user) {
				if ($localStorage.lang) $translate.use($localStorage.lang);
			}
        };

    }]);