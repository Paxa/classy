[![Build Status](https://drone.io/bitbucket.org/paxa/classy/status.png)](https://drone.io/bitbucket.org/paxa/classy/latest)

# Classy #

## `'classy/object_extras'`

Utility functions to have a better touch with objects:

```js
var ObjectKit = require('classy/object_extras');
ObjectKit.extendGlobal();

```

**`extendGlobal`**

extend global variable `Object`

```js
ObjectKit.extendGlobal();
```

```js
// iterates object
Object.forEach(obj, function (key, value) {

});

// get values as array
var obj = {type: 'animal', wear: 'wool', lives: 9};
Object.values(obj) // => ['animal', 'wool', 9];

// more detail type of object
Object.realType(null) // => 'null'
Object.realType(new Date) // => 'date'
Object.realType([]) // => 'array'

// methods of object
Object.methods(obj);

// own properties
Object.properties(obj) // -> return own properties

// all properties of object
Object.allProperties(obj) // -> return all properties of object

// variables
Object.instance_variables(obj)

// array of instance variable names
Object.instance_variable_names(obj)

// same as ruby's ancestors
Object.ancestors(obj) // return array of inherited prototypes

// check if object is constructor
Object.isConstructor(obj);

```

Ruby like classes for Node.js

### Api example

```js
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
console.log('ancestors', Cat.ancestors);
console.log('parentKlass', Cat.parentKlass);
console.log('klass', aCat.klass);
console.log('Class.klass', Cat.klass);
console.log('is_a', aCat.is_a(aCat.klass));
console.log('tap', aCat.tap(function() { console.dir(this); }));
console.log('inspect', aCat.inspect());
console.log('#age', aCat.age);
console.log('#new_age', aCat.age);
```
