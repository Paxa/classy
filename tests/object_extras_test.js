describe("object extras", function () {
  it("should return enumerable function as own method", function () {
    var obj = {};
    Object.defineProperty(obj, 'notEnumerable', {
      value: function () {},
      enumerable: false
    });
    assert(Object.own_methods(obj), ['notEnumerable']);
  });

  it("should return all method names", function () {
    var Foo = function () { };
    Foo.prototype.fooInstanceMethod = function () {};
    var obj = new Foo();
    obj.objOwnMethod = function () {};

    var globalObjMethods = Object.methods({});
    assert(Object.methods(obj), ['objOwnMethod', 'fooInstanceMethod'].concat(globalObjMethods));
  });

  it("should return own method names", function () {
    var Foo = function () { };
    Foo.prototype.fooInstanceMethod = function () {};
    var obj = new Foo();
    obj.objOwnMethod = function () {};

    assert(Object.own_methods(obj), ['objOwnMethod']);
  });

});