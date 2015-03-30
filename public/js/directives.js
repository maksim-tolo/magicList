var magicListDirectives = angular.module('magicListDirectives', []);

magicListDirectives.directive('resizable', ['$window',
	function($window) {
	return function($scope) {
		$scope.initializeWindowSize = function() {
			$scope.windowHeight = $window.innerHeight;
			return $scope.windowWidth = $window.innerWidth;
		};
		$scope.initializeWindowSize();
		return angular.element($window).bind('resize', function() {
			$scope.initializeWindowSize();
			return $scope.$apply($scope.showNavbar=false);
		});
	};
}]);