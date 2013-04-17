// Extensions of core JavaScript classes.
/**
 * Does array contain parameter.
 * @param  {String/Number/Object} Value to look for in the array.
 * @return {[type]}   [description]
 */
Array.prototype.contains = function (v) {
    for (var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

/**
 * Returns array of unique values in array.
 * @return {[type]} [description]
 */
Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr;
};

/**
 * Removes element from array.
 * @param  {[type]} from [description]
 * @param  {[type]} to   [description]
 * @return {[type]}      [description]
 * 
 * // Remove the second item from the array
 * array.remove(1);
 * // Remove the second-to-last item from the array
 * array.remove(-2);
 * // Remove the second and third items from the array
 * array.remove(1,2);
 * // Remove the last and second-to-last items from the array
 * array.remove(-2,-1);
 */
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

/**
 * Returns a random element form the array
 * @return {Value} Returns the array value.
 */
Array.prototype.randomElement = function() {
    return this[Math.floor(Math.random() * this.length)];
};
