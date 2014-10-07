module.exports = function (BaseKlass) {
  // there is a bug if include it to BaseKlass
  var Inspector = {
    inspect: function () {
      // if it's a prototype
      if (this instanceof BaseKlass && this.object_id === undefined) {
        return "<" + this.klassName + "::Constructor>";
      }

      // if it's an instance
      var ivars = [], _this = this;
      this.instance_variable_names.forEach(function(key) {
        ivars.push("" + key + "=" + JSON.stringify(_this[key]));
      });

      return "<" + this.klassName + ":" + this.object_id + " " + ivars.join(", ") + ">";
    },

    isPrototype: function () {
      return this instanceof BaseKlass && this.object_id === undefined;
    },

    isInstance: function () {
      return !this.isPrototype();
    }
  };

  global.ObjectInspector = Inspector;
}