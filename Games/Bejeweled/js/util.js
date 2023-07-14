/**
 * Returns a DOM object or an array of DOM objects, depending on the argument (id, class, or tag name)
 */
function get(id) {
	var elem = document.querySelectorAll(id);
	if (elem.length < 2)
		return elem[0] || document.querySelector(id);
	return elem;
}

/**
 * Removes an element from the page
 */
function remove (elem) {
	if (elem.parentNode) {
		elem.parentNode.removeChild(elem);
	}
}

/**
 * Returns the length of an object (associative array)
 */
Object.getLength = function(obj) {
	var length = 0;
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			length++;
		}
	}
	return length;
};

/**
 * Checks if two arrays (one dimension) are equals
 */
Array.equals = function(arr1, arr2) {
	if (!arr1 || !arr2 || arr1.length != arr2.length) {
		return false;
	}
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	};
	return true;
};