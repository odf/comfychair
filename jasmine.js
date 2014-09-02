'use strict';

var G = require('./index');


var customMatchers = {
  toSucceedOn: function(generator, shrinker, N) {
    var result = G.check(this.actual, generator, shrinker, N);
    this.message = function() { return result.cause; };
    return result.successful;
  },
  toConformTo: function(model, N) {
    var result = G.checkSystem(this.actual, model, N);
    this.message = function() { return result.cause; };
    return result.successful;
  }
};

beforeEach(function() { this.addMatchers(customMatchers) });
