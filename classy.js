require('./object_extras');

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

require('./object_inspector')(BaseKlass);

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
        return Object.instance_variable_names(this);
      }
    });

    Object.defineProperty(newClass.prototype, 'instance_variables', {
      get: function() {
        return Object.instance_variables(this);
      }
    });

    Object.defineProperty(newClass.prototype, 'methods', {
      get: function () {
        return Object.methods(this);
      }
    });

    Object.defineProperty(newClass.prototype, 'properties', {
      get: function() {
        return Object.properties(this);
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
    newClass.include(ObjectInspector);
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
    newClass.prototype.constructor = newClass;
    //console.log(newClass.toString());
    return newClass;
  },

  constantize: function (name) {
    return classyRegistry[name];
  },
};

Classy.BaseKlass = BaseKlass;

require('./classy_ls')(Classy);

Classy.new = Classy.build;

module.exports = Classy;