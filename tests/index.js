global.bdd = require('./bdd');
var assets = require('./bdd_assert');

global.describe = bdd.describe;

global.assert = assets.assert;
global.assert_true = assets.assert_true;
global.assert_match = assets.assert_match;

process.on("uncaughtException", function(err) {
  bdd.onError(err);
});


/// Load testable
global.Classy = require("../classy");

/// Load tests
require("./basics_test");

/// Run tests
bdd.runAllCases(function() {
  process.exit(0);
});
