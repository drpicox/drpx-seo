/*
The MIT License (MIT)

Copyright (c) 2015 David Rodenas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function(angular,window) {

	angular
		.module('drpxSeo',['ngRoute'])
		.config(locationConfig)
		.run(escapedFragmentHandler)
		.run(routeChangeHandler)
		.directive('title', titleDirective)
		.directive('meta', metaDirective);


	// relevant properties for metas and title
	var properties = ['title','description','keywords'];
	// original values for each property
	var originals = {};

	// Configures $location to use hashPrefix (escaped_fragment)
	locationConfig.$inject = ['$locationProvider'];
	function locationConfig  ( $locationProvider ) {
		$locationProvider.hashPrefix('!');
	}

	// Handles the initial query parameter ?_escaped_fragment_= 
	// to redirect to the expected path
	// (this is the emulation/trick which makes google believe 
	// that you have prepared the right web in servr)
	escapedFragmentHandler.$inject = ['$location'];
	function escapedFragmentHandler  ( $location ) {
		var escapedFragment = getQueryParam('_escaped_fragment_');
		if (escapedFragment) {
			$location.path(escapedFragment);
		}
	}

	// Computes interpolations of the current route
	routeChangeHandler.$inject = ['$interpolate','$rootScope'];
	function routeChangeHandler  ( $interpolate , $rootScope ) {

		$rootScope.$on('$routeChangeSuccess', resolve);

		function resolve(ev, current) {
			var context = angular.extend({}, current.params, current.locals);

			angular.forEach(properties, function(property) {				
				var expr = current[property];
				context.original = originals[property];
				if (expr) {
					current[property] = $interpolate(expr)(context);
				}
			});
		}
	}

	// replaces <title> text by current route title
	titleDirective.$inject = ['$route'];
	function titleDirective  ( $route ) {
		var directive = {
			restrict: 'E',
			link: link,
		};

		return directive;

		function link(scope, element) {
			var original = element.text();

			originals.title = original;
			scope.$watch(function() {
				return $route.current && $route.current.title;
			}, function(newTitle) {
				element.text(newTitle || original);
			});
		}
	}

	// replaces <meta content="..."> value with by current route
	metaDirective.$inject = ['$route'];
	function metaDirective  ( $route ) {
		var directive = {
			restrict: 'E',
			link: link,
		};

		return directive;

		function link(scope, element, attrs) {
			var i, l, name, original;

			name = attrs.name;
			for (i = 0, l = properties.length; i < l && properties[i] !== name; i++) {}
			if (i === l) { return; }

			original = attrs.content;
			originals[name] = original;
			scope.$watch(function() {
				return $route.current && $route.current[name];
			}, function(newContent) {
				attrs.$set('content', newContent || original);
			});
		}
	}

	// Read query params from url
	function getQueryParam(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (decodeURIComponent(pair[0]) === variable) {
				return decodeURIComponent(pair[1]);
			}
		}
	}

})(angular,window);
