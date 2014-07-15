describe("Classy #inspect method", function () {
  it('should have method #inspect', function() {
    var Cat = Classy.build('Cat', function() {
      assert(this.inspect(), "<Cat::Constructor>");
    });
    assert(Cat.inspect(), "<::Cat>");
    var cat = new Cat;
    assert_match(cat.inspect(), /<Cat:\d+\s*>/);
  });
});