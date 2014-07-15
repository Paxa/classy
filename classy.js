var renameFunction = function (name, fn) {
    return (new Function("return function (call) { return function " + name +
        " () { return call(this, arguments) }; };")())(Function.apply.bind(fn));
};

var lastObjectId = 0;

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

  p.klass = BaseKlass;
}(BaseKlass.prototype);

BaseKlass.KlassMethods = {
  inspect: function() {
    return "<::" + this.name + ">";
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
    //console.dir(this);
    this.instance_variable_names.forEach(function(key) {
      //console.log(key, JSON.stringify(_this[key]));
      ivars.push("" + key + "=" + JSON.stringify(_this[key]));
    });

    return "<" + this.klassName + ":" + this.object_id + " " + ivars.join(", ") + ">";
  }
};

var Classy = {
  build: function (name, callback) {
    var newClass = this.buildUpPrototype(name);

    newClass.classEval = function(callback) {
      callback.call(this, this.prototype);
    };

    newClass.extend = function (someModule) {
      Classy.extend(this.prototype, someModule);
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

    Object.defineProperty(newClass, 'parentKlass', {
      get: function() {
        return BaseKlass;
      }
    });

    // TODO show real ancesstors
    Object.defineProperty(newClass, 'ancesstors', {
      get: function() {
        return [newClass.parentKlass].concat([newClass]);
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
    newClass.extend(Inspector);

    callback && callback.call(newClass.prototype, newClass.prototype, Classy);

    return newClass;
  },

  // extend object
  extend: function(target, module) {
    for (var prop in module) {
      //console.log('extend', prop, module[prop]);
      target[prop] = module[prop];
    }
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
    var newClass = eval("(function " + name + " () { assignObjectid(this); this.initialize.call(this, arguments); })");
    newClass.prototype = new BaseKlass;
    //console.log(newClass.toString());
    return newClass;
  }
};
/*
//// api example

var Animal = {
  isAnimal: true,

};

var Cat = Classy.build('Cat', function (proto, mutator) {
  this.extend(Animal);

  proto.initialize = function() {
    this.birthtime = new Date;
  };

  mutator.getter(proto, 'age', function() {
    return new Date() - this.birthtime;
  });

  mutator.aliasProperty(proto, 'new_age', 'age');

  ['left', 'right'].forEach(function(side) {
    proto[side + 'Hand'] = side + " hand";
  });
});

Cat.classEval(function(proto) {
  proto.tailMode = "down";

  proto.tailUp = function () {
    this.tailMode = "up";
  };

  proto.tailDown = function () {
    this.tailMode = "down";
  };

  proto.moveTail = function() {
    this.tailMode = this.tailMode == "up" ? "down" : "up"
  }
});

var aCat = new Cat;

console.log('klassName', aCat.klassName);
console.log('instance_variables', aCat.instance_variables);
console.log('object_id', aCat.object_id);
console.log('object_id', (new Cat).object_id);
console.log('ancesstors', Cat.ancesstors);
console.log('parentKlass', Cat.parentKlass);
console.log('klass', aCat.klass);
console.log('Class.klass', Cat.klass);
console.log('is_a', aCat.is_a(aCat.klass));
console.log('tap', aCat.tap(function() { console.dir(this); }));
console.log('inspect', aCat.inspect());
console.log('#age', aCat.age);
console.log('#new_age', aCat.age);
*/

module.exports = Classy;