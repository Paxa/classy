var ObjectKit = {};

var isPrototype = function isPrototype (obj) {
  return typeof obj == 'function' && Object.keys(obj.prototype).length > 0;
};

ObjectKit.forEach = function Object_forEach (object, callback) {
  for (var key in object) {
    if (object.hasOwnProperty(key)) callback(key, object[key]);
  }
};


ObjectKit.values = function Object_values (object) {
  var values = [];
  Object.forEach(object, function(key, value) { values.push(value); });
  return values;
};


// standart types + array, null, class, date, regexp
// standarts are: undefined, object, boolean, number, string, function
ObjectKit.realType = function Object_realType (object) {
  if (typeof object == 'object') {
    if (object instanceof Date)        return 'date';
    if (object instanceof RegExp)      return 'regexp';
    if (ObjectKit.isPrototype(object)) return 'class';
    if (Array.isArray(object))         return 'array';
    if (object === null)               return 'null';
  }

  return typeof object;
};


ObjectKit.methods = function Object_methods (object) {
  var methods = [];
  for (var prop in object) {
    if (typeof object[prop] == 'function' && !isPrototype(object[prop])) methods.push(prop);
  }
  return methods;
};


ObjectKit.own_methods = function Object_own_methods (object) {
  var methods = [];
  for (var prop in object) {
    if (object.hasOwnProperty(prop) && typeof object[prop] == 'function' && !isPrototype(object[prop])) methods.push(prop);
  }
  return methods;
};


ObjectKit.properties = function Object_properties (object) {
  var properties;
  if (typeof object == 'object') {
    properties = Object.getOwnPropertyNames(object);
  } else {
    properties = Object.getOwnPropertyNames(Object.getPrototypeOf(object));
  }
  var proto = object.constructor.prototype;

  Object.getOwnPropertyNames(proto).forEach(function(key) {
    if (properties.indexOf(key) == -1) properties.push(key);
  });

  var filtered = [];
  properties.forEach(function(key) {
    var prop = Object.getOwnPropertyDescriptor(object, key) || Object.getOwnPropertyDescriptor(proto, key);
    if (!('value' in prop) || !prop.enumerable) filtered.push(key);
  });

  return filtered;
};

ObjectKit.allProperties = function(object) {
  var props = [];

  do {
    Object.getOwnPropertyNames(object).forEach(function (prop) {
      if (props.indexOf(prop) === -1) props.push(prop);
    });
  } while (object = Object.getPrototypeOf(object));

  return props;
};

ObjectKit.instance_variables = function Object_instance_variables (object) {
  var ivars = {};
  for (var i in object) {
    if (typeof object[i] != 'function' || isPrototype(object[i])) ivars[i] = object[i];
  }
  return ivars;
};

ObjectKit.instance_variable_names = function Object_instance_variable_names (object) {
  var keys = [];
  for (var i in object) {
    if (typeof object[i] != 'function' || isPrototype(object[i])) keys.push(i);
  }
  return keys;
};

ObjectKit.ancestors = function Object_ancestors (object) {
  var lsat = object;
  prototypes = [];

  while (last = Object.getPrototypeOf(last)) {
    prototypes.push(last);
  }

  return prototypes;
};

ObjectKit.isPrototype = isPrototype;
ObjectKit.isConstructor = ObjectKit.isPrototype;

ObjectKit.extendGlobal = function () {
  ObjectKit.forEach(ObjectKit, function (key, value) {
    if (key != 'extendGlobal') Object[key] = value;
  });
};

module.exports = ObjectKit;
