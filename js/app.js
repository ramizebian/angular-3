(function () {
	
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");


//NarrowItDownController Controller
//------------------------------------------------------------------
NarrowItDownController.$inject =['MenuSearchService'];
function NarrowItDownController (MenuSearchService){
	var menu = this;
	menu.searchTerm = '';

	//Get Matched items
	menu.getMatchedMenuItems = function(searchTerm){
		if (menu.searchTerm != ''){
			var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
			promise.then(function (response) {
				menu.found = response;
			});
		}
		else{
			menu.found = [];
		}
	};

	//Remove Item
	menu.removeItem = function (index) {
		menu.found.splice(index, 1);
	};
}
//------------------------------------------------------------------

//MenuSearchService Service
//------------------------------------------------------------------
MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  		var service = this;

		service.getMatchedMenuItems = function (searchTerm) {

			return $http({
					method: 'GET',
					url: (ApiBasePath + "/menu_items.json")
				}).then(function (result) {

			    var foundItems = [];
			    var data = result.data.menu_items;

			    // return matched items
			    for (var i = 0; i < data.length; i++) {
			    	if (data[i].description.includes(searchTerm)) {
			    		foundItems.push(data[i]);
			    	}
			    }
			    return foundItems;
		    });

		};
		return service;
  	};
//------------------------------------------------------------------


//Found items directive
//------------------------------------------------------------------
function FoundItemsDirective() {
	var ddo = {
		templateUrl: 'foundItems.html',
		restrict: 'E',
		scope: {
			foundItems: '<',
			myTitle: '@title',
			onRemove: '&'
		},
	};

	return ddo;
}
//------------------------------------------------------------------

})();