describe('Classy basics', function() {
  it('create class and run initializer', function () {

    var Cat = Classy.build('Cat', function (proto, mutator) {
      proto.init_ran = false;
      proto.initialize = function() {
        this.init_ran = true;
      };
    });

    assert_true((new Cat).init_ran);
  });

  it('create class and have "this" as constructor', function () {

    var Cat = Classy.build('Cat', function (proto, mutator) {
      this.init_ran = false;
      this.initialize = function() {
        this.init_ran = true;
      };
    });

    assert_true((new Cat).init_ran);
  });

  it('should give uniq object_id to every instance', function() {
    var Cat = Classy.build('Cat');
    var cat1 = new Cat;
    var cat2 = new Cat;
    assert_true(cat1.object_id != cat2.object_id);
  });

  it('should make class as named function', function() {
    var Cat = Classy.build('Cat');
    assert(Cat.name, 'Cat');
  });

  it('should #is_a() to detect class', function() {
    var Cat = Classy.build('Cat');
    var Dog = Classy.build('Dog');
    assert((new Cat).is_a(Cat), true);
    assert((new Cat).is_a(Dog), false);
  });

  it('should have method tap', function() {
    var cat = new (Classy.build('Cat'));
    var returning = cat.tap(function() {
      assert(this, cat);
    });

    assert(returning, cat)
  });

  it('should have #klass property', function() {
    var Cat = Classy.build('Cat');
    var cat = new Cat;
    assert(cat.klass, Cat);
  });

  it('should have #klassName property', function() {
    var Cat = Classy.build('Cat');
    var cat = new Cat;
    assert(cat.klassName, 'Cat');
  });
});