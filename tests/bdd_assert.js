var asserts = {};

asserts.assert = function assert (var1, var2) {
  if (typeof var1 == 'object') var1 = JSON.stringify(var1);
  if (typeof var2 == 'object') var2 = JSON.stringify(var2);

  if (var1 !== var2) {
    var error = new Error("'asset' failed: " + String(var1) + " is not " + String(var2));
    bdd.onError(error);
    throw bdd.stopCase;
  }
};

asserts.assert_true = function assert_true (value) {
  if (!value) {
    //var stack = new Error().stack;
    //console.log(stack.join("\n"));
    bdd.onError(new Error("'assert_true' failed: expected true, got " + String(value)));
    //throw "'assert_true' failed: expected true, got " + String(value);
    throw bdd.stopCase;
  }
};

asserts.assert_match = function assert_match (string, regexp) {
  if (!string.match(regexp)) {
    bdd.onError(new Error("'assert_match' failed: expected '" + String(string) + "' to match " + regexp));
    throw bdd.stopCase;
  };
};

asserts.assert_contain = function assert_contain (array, element) {
  if (array.indexOf(element) == -1) {
    bdd.onError(new Error("'assert_contain' failed: expected '" + JSON.stringify(array) + "' to contain " + JSON.stringify(element)));
    throw bdd.stopTest;
  };
};

module.exports = asserts;