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

  it('should have #instance_variable_names property', function() {
    var Cat = Classy.build('Cat');
    var cat = new Cat;
    assert(cat.instance_variable_names, []);

    cat.isCat = true;
    assert(cat.instance_variable_names, ['isCat']);

    var Dog = Classy.build('Dog', function() {
      this.isDog = true;
      this.isCat = false;
    });
    assert((new Dog).instance_variable_names, ['isDog', 'isCat']);
  });

  it('should have #instance_variables property', function() {
    var Cat = Classy.build('Cat');
    var cat = new Cat;
    assert(cat.instance_variables, {});
    cat.isCat = true;
    assert(cat.instance_variables, {isCat: true});
  });

  it('should have method #inspect', function() {
    var Cat = Classy.build('Cat', function() {
      assert(this.inspect(), "<Cat::Constructor>");
    });
    assert(Cat.inspect(), "<::Cat>");
    var cat = new Cat;
    assert_match(cat.inspect(), /<Cat:\d+\s*>/);
  });
});