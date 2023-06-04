/**
 * Creates a new Storage. A storage uses local storage capabilities to save JSON data
 */
var Storage = (function () {
    "use strict";
    
    /**
     * Returns true if local storage is supported
     */
    function supportsStorage() {
        return window.localStorage !== "undefined" && window.localStorage !== null;
    }
    
    /**
     * Returns true if the string is an integer
     * @param {string} string
     * @return {boolean}
     */
    function isInteger(string) {
        var validChars = "0123456789-", isNumber = true, i, char;
        
        for (i = 0; i < string.length && isNumber === true; i += 1) {
            char = string.charAt(i);
            if (validChars.indexOf(char) === -1) {
                isNumber = false;
            }
        }
        return isNumber;
    }
    
    
    /**
     * @constructor
     * Creates a new storage
     * @param {string} name  The name of the storage
     * @param {boolean=} single  True to have a storage for a single value
     */
    function Storage(name, single) {
        this.name     = name;
        this.single   = single || false;
        this.supports = supportsStorage();
    }
    
    /**
     * Returns the data in the saved format
     * @param {string} name
     * @return {(boolean|number|string|Object)}
     */
    Storage.prototype.get = function (name) {
        var content = null;
        
        if (this.supports && window.localStorage[this.getName(name)]) {
            content = window.localStorage[this.getName(name)];
            if (content === "true" || content === "false") {
                content = content === "true";
            } else if (isInteger(content)) {
                content = parseInt(content, 10);
            } else {
                content = JSON.parse(content);
            }
        }
        return content;
    };
    
    /**
     * Saves the given data as a JSON object
     * @param {(boolean|number|string|Object)} name  If this is a single value Storage use this param for the value
     * @param {(boolean|number|string|Object)} value
     */
    Storage.prototype.set = function (name, value) {
        if (this.supports) {
            if (this.single) {
                value = name;
                name  = "";
            }
            window.localStorage[this.getName(name)] = JSON.stringify(value);
        }
    };
    
    /**
     * Removes the data with the given name
     * @param {string=} name
     */
    Storage.prototype.remove = function (name) {
        if (this.supports) {
            window.localStorage.removeItem(this.getName(name));
        }
    };
    
    
    /**
     * Returns the key for the given name
     * @param {string=} name
     * @return {string}
     */
    Storage.prototype.getName = function (name) {
        return this.name + (name ? "." + name : "");
    };
    
    /**
     * Returns true if local storage is supported
     */
    Storage.prototype.isSupported = function () {
        return this.supports;
    };
    
    
    
    return Storage;
}());
