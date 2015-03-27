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

			changeListName : function(data) {
				return $http.post('/api/changeListName', data);
			},

			removeList : function(data) {
				return $http.post('/api/removeList', data);
			},

			changeTaskStatus : function(data) {
				return $http.post('/api/changeTaskStatus', data);
			},

			getUser : function (data) {
				return $http.post('/api/getUser', data);
			}

		}       

	}]);

AppService.service('SessionService', ['$localStorage', 'AppRoute', '$rootScope', '$state',
	function($localStorage, AppRoute, $rootScope, $state) {

		this.checkAccess = function(event, toState, toParams, fromState, fromParams) {

			if ((toState.name=='login' || toState.name=='signup') && $localStorage.user) {
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
                		$state.go('login');
                	});
			} else if ($localStorage.user) {
				$rootScope.user = $localStorage.user;
			}
        };

    }]);