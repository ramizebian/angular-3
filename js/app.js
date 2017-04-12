(function() {

'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', foundItems);



//NarrowItDownController Controller
//------------------------------------------------------------------
NarrowItDownController.$inject =['MenuSearchService'];
function NarrowItDownController (MenuSearchService){
	var menu = this;
	menu.searchTerm = '';


	//Get Matched items
	//------------------------------------------	
	menu.narrowsearch = function () {
    if(menu.searchTerm === "") {
      menu.items=[];
      return;
    }
    var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
    promise.then(function (response) {
      menu.items = response;
    })
    .catch(function (error) {
      console.log(error);
    })
  }
	//------------------------------------------	

	//Remove Item
	//------------------------------------------	
	menu.removeItem = function (index) {
		menu.items.splice(index, 1);
	};
	//------------------------------------------	
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
		    var items = result.data.menu_items;

		    // return matched items
		    for (var i = 0; i < data.length; i++) {
		    	if(items[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) >=0 ) {
		    		foundItems.push(items[i]);
		    	}
		    }
		    return foundItems;
	});

	}
}
//------------------------------------------------------------------


//Found items directive
//------------------------------------------------------------------
function foundItems() {
	 var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      found: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'list',
    bindToController: true
  }
  return ddo;
}
//------------------------------------------------------------------


//Found items directive Controller
//------------------------------------------------------------------
function FoundItemsDirectiveController() {
   var list = this;

  console.log(list);

  list.isEmpty= function () {
    return list.found != undefined && list.found.length === 0;
  }
}
//------------------------------------------------------------------

}());
