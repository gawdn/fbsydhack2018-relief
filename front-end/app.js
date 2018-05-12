(function () {
'use strict';

angular.module('ReliefSearchApp', [])
.controller('ReliefSearchController', ShoppingListController)
.provider('ReliefSearch', ShoppingListProvider)
.config(Config);

Config.$inject = ['ReliefSearchProvider'];
function Config(ShoppingListProvider) {
  ShoppingListProvider.defaults.maxItems = 5;
}

ShoppingListController.$inject = ['ReliefSearch'];
function ShoppingListController(ShoppingList) {
  var list = this;

  list.items = ReliefSearch.getItems();

  list.itemName = "";
  list.itemQuantity = "";

  list.addItem = function () {
    try {
      ReliefSearch.addItem(list.itemName, list.itemQuantity);
    } catch (error) {
      list.errorMessage = error.message;
    }
  };

  list.removeItem = function (itemIndex) {
    ReliefSearch.removeItem(itemIndex);
  };
}


// If not specified, maxItems assumed unlimited
function ReliefSearchService(maxItems) {
  var service = this;

  // List of shopping items
  var items = [];

  service.addItem = function (itemName, quantity) {
    if ((maxItems === undefined) ||
        (maxItems !== undefined) && (items.length < maxItems)) {
      var item = {
        name: itemName,
        quantity: quantity
      };
      items.push(item);
    }
    else {
      throw new Error("Max items (" + maxItems + ") reached.");
    }
  };

  service.removeItem = function (itemIndex) {
    items.splice(itemIndex, 1);
  };

  service.getItems = function () {
    return items;
  };
}


function ReliefSearchProvider() {
  var provider = this;

  provider.defaults = {
    maxItems: 100
  };

  provider.$get = function () {
    var shoppingList = new ShoppingListService(provider.defaults.maxItems);

    return shoppingList;
  };
}

})();
