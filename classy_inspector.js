module.exports = function (Classy) {
  // there is a bug if include it to BaseKlass

  var isPrototype = function isPrototype (obj) {
    return obj instanceof Classy.BaseKlass && obj.object_id === undefined;
  };

  var Inspector = {
    inspect: function () {
      // if it's a prototype
      if (isPrototype(this)) {
        return "<" + this.klassName + "::Constructor>";
      }

      // if it's an instance
      var ivars = [], _this = this;
      this.instance_variable_names.forEach(function(key) {
        ivars.push("" + key + "=" + JSON.stringify(_this[key]));
      });

      return "<" + this.klassName + ":" + this.object_id + " " + ivars.join(", ") + ">";
    },

    /*
    isPrototype: function () {
      return this instanceof BaseKlass && this.object_id === undefined;
    },

    isInstance: function () {
      return !this.isPrototype();
    }
    */
  };

  return Inspector;
}