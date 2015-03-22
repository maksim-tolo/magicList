angular.module('AppService', []).factory('AppRoute', ['$http', function($http) {

    return {
        
        get : function() {
            return $http.get('/api/login');
        },

        signup : function(userData) {
            return $http.post('/api/signup', userData);
        },

        signin : function(userData) {
            return $http.post('/api/signin', userData);
        }
    }       

}]);