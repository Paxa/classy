require('./object_extras');

var colors = require('colors');

var puts = function (str, color) {
  if (color !== undefined) {
    process.stdout.write(String(str)[color] + "\n");
  } else {
    process.stdout.write(String(str) + "\n");
  }
};

var diff = function (array1, array2) {
  return array1.filter(function(i) {return array2.indexOf(i) < 0; });
};


Object.ls = function Object_ls (object) {
  puts('-> instance of ' + String(object.constructor.name).bold);

  puts("  variables:");
  Object.instance_variable_names(object).forEach(function(key) {
    puts("  * " + key, 'green');
  });

  puts("  properties:");
  Object.properties(object).forEach(function(key) {
    puts("  * " + key, 'green');
  });

  puts("  own methods:");
  Object.own_methods(object).forEach(function(key) {
    puts("  * " + key, 'green');
  });

  puts("  inherited:");
  var proto = object.parentClass || object.constructor.prototype;

  while (proto) {
    puts('-> from ' + String(proto.parentClassName).bold);
    Object.own_methods(proto).forEach(function(key) {
      puts("  * " + key, 'green');
    });

    if (proto.parentClass && proto != proto.parentClass) {
      proto = proto.parentClass;
    } else if (proto.constructor && proto.constructor.prototype === proto) {
      proto = false;
    } else {
      proto = proto.constructor && proto.constructor.prototype;
    }
  }
  /*
  diff(Object.methods(object), Object.own_methods(object)).forEach(function(key) {
    puts("  * " + key, 'green');
  });
  */
};

function inheritFrom(fn1, obj) {
  fn1.prototype = obj;
  fn1.prototype.constructor = fn1;
  Object.defineProperty(fn1.prototype, 'parentClass', {
    get: function() {
      return obj;
    }
  });

  var className = fn1.name;
  Object.defineProperty(fn1.prototype, 'parentClassName', {
    get: function() {
      return className;
    }
  });
}

var domain = require('domain');

var Product = function Product () {
  
}

inheritFrom(Product, new domain.Domain);
//Product.prototype = ;
//Product.prototype.constructor = Product;

Product.prototype.code = "SKU-1";
Product.prototype.label = "Mouse";
Product.prototype.register = function () { };
Product.prototype.reduce = function () { };
Product.prototype.increase = function () { };

var p = new Product;
p.imUniq = function () { };

var SubProduct = function SubProduct () {
  
};

inheritFrom(SubProduct, p);
//SubProduct.prototype = p;
SubProduct.prototype.isSubProduct = function () { };

//console.log((new SubProduct).__proto__);

console.log((new SubProduct).parentClass);
Object.ls(new SubProduct);