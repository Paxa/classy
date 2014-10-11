var ObjectKit = require('./object_extras');

var colors = require('colors');

var puts = function (str, color) {
  if (color !== undefined) {
    process.stdout.write(String(str)[color] + "\n");
  } else {
    process.stdout.write(String(str) + "\n");
  }
};


Object.ls = function Object_ls (object) {
  puts('-> instance of ' + String(object.constructor.name).bold);

  puts("  variables:");
  ObjectKit.instance_variable_names(object).forEach(function(key) {
    puts("  * " + key, 'green');
  });

  puts("  properties:");
  ObjectKit.properties(object).forEach(function(key) {
    puts("  @ " + key, 'cyan');
  });

  puts("  own methods:");
  ObjectKit.own_methods(object).forEach(function(key) {
    puts("  * " + key, 'green');
  });

  puts("  inherited:");

  var proto = Object.getPrototypeOf(object);

  while (proto) {
    puts('  -> from ' + String(proto.constructor ? proto.constructor.name : proto.name).bold);
    ObjectKit.own_methods(proto).forEach(function(key) {
      puts("    * " + key, 'green');
    });
    ObjectKit.properties(proto).forEach(function(key) {
      puts("    @ " + key, 'cyan');
    });
    proto = Object.getPrototypeOf(proto);
  }
};

//var inherits = require('util').inherits;

var inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  if (typeof superCtor == 'function') {
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  } else {
    ctor.prototype = superCtor;
    Object.defineProperty(ctor.prototype, 'constructor', {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
};

/*
var domain = require('domain');

var Product = function Product () {
  
}

inherits(Product, new domain.Domain);

Product.prototype.code = "SKU-1";
Product.prototype.label = "Mouse";
Product.prototype.register = function () { };
Product.prototype.reduce = function () { };
Product.prototype.increase = function () { };

var p = new Product;
p.imUniq = function () { };

var SubProduct = function SubProduct () {
  
};

inherits(SubProduct, p);

SubProduct.prototype.isSubProduct = function () { };

Object.ls(new SubProduct);
*/