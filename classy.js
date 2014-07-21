var renameFunction = function (name, fn) {
    return (new Function("return function (call) { return function " + name +
        " () { return call(this, arguments) }; };")())(Function.apply.bind(fn));
};

var lastObjectId = 0;
var classyRegistry = {};

function assignObjectid(newObject) {
  !function (objId) {
    Object.defineProperty(newObject, 'object_id', {
      get: function() {
        return objId;
      }
    });
  }(lastObjectId += 1);
}

var BaseKlass = function BaseClass () {};
!function(p) {
  p.is_a = function(klass) {
    return this.klass == klass;
  };

  p.tap = function (callback) {
    callback.call(this, this);
    return this;
  };

  p.initialize = function() {};

}(BaseKlass.prototype);

BaseKlass.KlassMethods = {
  inspect: function() {
    return "<::" + this.name + ">";
  },

  include: function include (module1, module2, module3) {
    for (var i = 0; i < arguments.length; i++) {
      Classy.extend(this.prototype, arguments[i]);
    }
  },

  extend: function extend (module) {
    Classy.extend(this, module);
  },

  classEval: function classEval (callback) {
    callback.call(this.prototype, this.prototype, Classy);
  }
};

BaseKlass.inspect = function() {
  return "<::" + BaseKlass.name + ">";
};

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

var Classy = {
  build: function (name, callback) {
    var newClass = this.buildUpPrototype(name);
    classyRegistry[name] = newClass;
    newClass.classEval = function(callback) {
      callback.call(newClass, newClass.prototype);
    };

    newClass.extend = function (someModule) {
      Classy.extend(newClass.prototype, someModule);
    };

    newClass.allocate = function () {
      newObject = Object.create(newClass.prototype);
      assignObjectid(newObject);
      return newObject;
    };

    Object.defineProperty(newClass.prototype, 'instance_variable_names', {
      get: function() {
        var keys = [];
        for (var i in this) {
          if (typeof this[i] != 'function') keys.push(i);
        }
        return keys;
        //return Object.keys(this);
      }
    });

    Object.defineProperty(newClass.prototype, 'instance_variables', {
      get: function() {
        var ivars = {};
        for (var i in this) {
          if (typeof this[i] != 'function') ivars[i] = this[i];
        }
        return ivars;
        //return Object.keys(this);
      }
    });

    Object.defineProperty(newClass.prototype, 'methods', {
      get: function () {
        var methods = [];
        for (var prop in this) {
          if (typeof this[prop] == 'function') methods.push(prop);
        }
        return methods;
      }
    });

    Object.defineProperty(newClass.prototype, 'properties', {
      get: function() {
        var properties = Object.getOwnPropertyNames(this);
        Object.getOwnPropertyNames(newClass.prototype).forEach(function(key) {
          if (properties.indexOf(key) == -1) properties.push(key);
        });

        return properties.filter(function(key) {
          var prop = Object.getOwnPropertyDescriptor(this, key) || Object.getOwnPropertyDescriptor(this.klass.prototype, key);
          return !('value' in prop); // && ('get' in prop || 'set' in prop);
        }.bind(this));
      }
    });

    Object.defineProperty(newClass, 'superclass', {
      get: function() {
        return BaseKlass;
      }
    });

    // TODO show real ancesstors
    Object.defineProperty(newClass, 'ancesstors', {
      get: function() {
        return [newClass.superclass].concat([newClass]);
      }
    });

    Object.defineProperty(newClass.prototype, 'klass', {
      get: function() {
        return newClass;
      }
    });

    Object.defineProperty(newClass, 'klass', {
      get: function() {
        return BaseKlass;
      }
    });

    Object.defineProperty(newClass.prototype, 'klassName', {
      get: function() {
        return newClass.name;
      }
    });

    Classy.extend(newClass, BaseKlass.KlassMethods);
    newClass.include(Inspector);
    //newClass.extend(Inspector);

    callback && callback.call(newClass.prototype, newClass.prototype, Classy);

    return newClass;
  },

  // extend object
  extend: function(target, module) {
    for (var prop in module) {
      //console.log('extend', prop, module[prop]);
      if (module.hasOwnProperty(prop)) target[prop] = module[prop];
    }
    return target;
  },

  // extend class (prototype)
  include: function(target, module){
    
  },

  classEval: function(callback) {
    
  },

  getter: function(target, name, fn) {
    Object.defineProperty(target, name, {
      get: fn
    });
  },

  setter: function(target, name, fn) {
    Object.defineProperty(target, name, {
      set: fn
    });
  },

  aliasMethod: function (klass, new_method, old_method) {
    klass[new_method] = klass[old_method];
  },

  aliasProperty: function(target, new_prop, old_prop) {
    Object.defineProperty(target, new_prop, {
      set: function(value) {
        return target[old_prop] = value;
      },
      get: function() {
        return target[old_prop];
      }
    });
  },

  buildUpPrototype: function(name) {
    var newClass = eval("(function " + name + " () { assignObjectid(this); this.initialize.apply(this, arguments); })");
    newClass.prototype = new BaseKlass;
    newClass.isKlass = true;
    //console.log(newClass.toString());
    return newClass;
  },

  constantize: function (name) {
    return classyRegistry[name];
  },
};

Classy.BaseKlass = BaseKlass;

// look see

var colors = require('colors');

var puts = function (str, color) {
  if (color !== undefined) {
    process.stdout.write(String(str)[color] + "\n");
  } else {
    process.stdout.write(String(str) + "\n");
  }
};

function printDebug (object) {
  // CLASS VARIABLES
  puts("    variables:");
  for (var key in object) {
    if (typeof object[key] != 'function') {
      puts("      " + key, 'green');
    }
  }

  // CLASS METHODS (static)
  puts("    methods:");
  for (var key in object) {
    if (typeof object[key] == 'function') {
      puts("      " + key, 'green');
    }
  }

  // CLASS PROPERTIES
  puts("    properties:");
  if (object.isKlass) {
    var properties = Object.getOwnPropertyNames(object);
    if (object.isKlass) {
      properties = properties.concat(Object.getOwnPropertyNames(object.superclass));
    }
    properties.forEach(function(key) {
      var prop = Object.getOwnPropertyDescriptor(object, key) || Object.getOwnPropertyDescriptor(object.klass.prototype, key);
      if (prop && !('value' in prop)) {
        puts("      " + key, 'green');
      }
    });
  } else {
    object.properties.forEach(function(key) {
      puts("      " + key, 'green');
    });
  }
}

Classy.ls = function (object) {
  if (object.isKlass) {
    puts(JSON.stringify(object.name) + " is a class.", 'bold');
    puts("  # class");
    printDebug(object);

    puts("  # instance");
    printDebug(object.prototype);

  } else if (object.isPrototype()) {
    
  } else if (object.isInstance()) {
    
  }
};

Classy.new = Classy.build;

module.exports = Classy;