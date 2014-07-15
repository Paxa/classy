[![Build Status](https://drone.io/bitbucket.org/paxa/classy/status.png)](https://drone.io/bitbucket.org/paxa/classy/latest)

# Classy #

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
console.log('ancesstors', Cat.ancesstors);
console.log('parentKlass', Cat.parentKlass);
console.log('klass', aCat.klass);
console.log('Class.klass', Cat.klass);
console.log('is_a', aCat.is_a(aCat.klass));
console.log('tap', aCat.tap(function() { console.dir(this); }));
console.log('inspect', aCat.inspect());
console.log('#age', aCat.age);
console.log('#new_age', aCat.age);
```