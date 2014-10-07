Object.forEach = function Object_forEach (object, callback) {
  for (var key in object) {
    if (object.hasOwnProperty(key)) callback(key, object[key]);
  }
};


Object.methods = function Object_methods (object) {
  var methods = [];
  for (var prop in object) {
    if (typeof object[prop] == 'function') methods.push(prop);
  }
  return methods;
};


Object.own_methods = function Object_own_methods (object) {
  var methods = [];
  for (var prop in object) {
    if (object.hasOwnProperty(prop) && typeof object[prop] == 'function') methods.push(prop);
  }
  return methods;
};


Object.properties = function Object_properties (object) {
  var properties = Object.getOwnPropertyNames(object);
  var proto = object.constructor.prototype;

  Object.getOwnPropertyNames(proto).forEach(function(key) {
    if (properties.indexOf(key) == -1) properties.push(key);
  });

  var filtered = [];
  properties.forEach(function(key) {
    var prop = Object.getOwnPropertyDescriptor(object, key) || Object.getOwnPropertyDescriptor(proto, key);
    if (!('value' in prop)) filtered.push(key);
  });

  return filtered;
};


Object.instance_variables = function Object_instance_variables (object) {
  var ivars = {};
  for (var i in object) {
    if (typeof object[i] != 'function') ivars[i] = object[i];
  }
  return ivars;
};


Object.instance_variable_names = function Object_instance_variable_names (object) {
  var keys = [];
  for (var i in object) {
    if (typeof object[i] != 'function') keys.push(i);
  }
  return keys;
}
