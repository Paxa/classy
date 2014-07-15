var reporter = require('./bdd_reporter');

var allCases = [];

var bdd = {
  reporter: reporter,
  onError: function (exception) {
    if (!currentCase) throw exception;
    bdd.reporter.reportError(currentCase, exception);
  },
  current_context: [],
  current_context_fn: []
};

var asyncRun = function (fn) {
  // try to find first if function accept arguments
  return fn.toString().match(/^function\s*([\w\d_]+)?\s*\(([\w\d_]+)\)\s*{/)
};

var currentCase;

var runCase = function (it_case, callback) {
  currentCase = it_case;
  if (asyncRun(it_case.runner)) {
    !function () {

      var waiter = setTimeout(function() {
        it_case.status = 'failed';
        bdd.reporter.reportError(it_case, new Error("spec timed out"));
        callback();
      }, 5000);

      var done = function () {
        clearTimeout(waiter);
        it_case.status = 'pass';
        callback();
      };

      try {
        it_case.runner(done);
        bdd.reporter.reportGood(it_case);
      } catch (e) {
        clearTimeout(waiter);
        it_case.status = 'failed';
        bdd.reporter.reportError(it_case, e);
        callback();
      }
    }();
  } else {
    try {
      it_case.runner();
      bdd.reporter.reportGood(it_case);
    } catch (e) {
      it_case.status = 'failed';
      bdd.reporter.reportError(it_case, e);
    }
    callback();
  }
};

bdd.runAllCases = function (callback) {
  var lastContext = [];

  bdd.reporter.started(allCases);

  var current_i = -1;
  var runNext = function runNext () {
    if (allCases[current_i + 1]) {
      current_i += 1;
      var theCase = allCases[current_i];
      if (theCase.context.toString() != lastContext.toString()) {
        lastContext = theCase.context;
        bdd.reporter.newContext(theCase.context);
      }
      runCase(allCases[current_i], runNext);
    } else {
      bdd.reporter.finished(allCases);
      //puts("-- finish\n");
      callback && callback();
    }
  };

  runNext();
};

bdd.describe = function describe (context, callback) {
  bdd.current_context = [context];
  bdd.current_context_fn = callback;
  //console.log(callback.toString());
  with (bdd) {
    eval("!" + callback.toString() + "()");
  }
};

bdd.it = function it (name, runner) {
  var it_case = {
    context: bdd.current_context.slice(0),
    context_fn: bdd.current_context_fn,
    name: name,
    runner: runner,
    status: 'defined', // status = defined, running, pass, failed
  }; 

  allCases.push(it_case);
};

module.exports = bdd;