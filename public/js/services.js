var AppService = angular.module('AppService', []);

AppService.factory('AppRoute', ['$http',
	function($http) {

		return {

			signup : function(userData) {
				return $http.post('/signup', userData);
			},

			signin : function(userData) {
				return $http.post('/signin', userData);
			},

			checkEmail : function(email) {
				return $http.get('/api/checkEmail', email);
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
			}

		}       

	}]);

AppService.service('SessionService', ['$injector',
	function($injector) {

		this.checkAccess = function(event, toState, toParams, fromState, fromParams) {
			var $scope = $injector.get('$rootScope'),
			$sessionStorage = $injector.get('$sessionStorage');

			if (toState.data !== undefined) {
				if (toState.data.noLogin !== undefined && toState.data.noLogin) {
            	// если нужно, выполняйте здесь какие-то действия 
            	// перед входом без авторизации
            	if ($scope.$root.user) {
            		event.preventDefault(); //доделать!!!
            		$scope.$state.go('app');
            	};
            }
        } else {
          		// вход с авторизацией
          		if ($sessionStorage.user) {
          			$scope.$root.user = $sessionStorage.user;
          		} else {
           			event.preventDefault();
           			$scope.$state.go('signin');
           		}
           	}
        };
    }]);
