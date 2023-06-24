//for storing and retrieving from localStorage

function Storage() {
  this.getItem = function(itemName) {
    var item = localStorage.getItem(itemName);

    return item;
  };

  this.getLength = function() {
    var length = localStorage.length;

    return length;
  };

  this.getItemName = function(keyValue) {
    var name = localStorage.key(keyValue);

    return name;
  };

  this.setItem = function(itemName, itemData) {
    localStorage.setItem(itemName, JSON.stringify(itemData));
  };

  this.clear = function() {
    localStorage.clear();
  };
}
