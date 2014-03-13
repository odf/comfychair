'use strict';

var G = require('../index');


describe('a simple predicate testing for positivity', function() {
  var pred = function(n) {
    return (n > 0) ? G.success() : G.failure('must be positive');
  };

  describe('applied a natural number generator', function() {
    var gen = function(n) {
      return G.randomInt(1, Math.max(1, n));
    };

    var shrink = function(n) {
      return (n > 1) ? [n-1] : [];
    };

    it('succeeds', function() {
      expect(pred).toSucceedOn(gen, shrink);
      expect(pred).toSucceedOn(gen);
    });
  });
});


describe('a model describing a stack', function() {
  var model = {
    commands: function() {
      return ['push', 'pop', 'empty'];
    },

    randomArgs: function(command, size) {
      if (command == 'push')
        return [G.randomInt(0, size)];
      else
        return [];
    },

    shrinkArgs: function(command, args) {
      if (command == 'push' && args[0] > 0)
        return [[args[0] - 1]];
      else
        return [];
    },

    apply: function(state, command, args) {
      switch(command) {
      case 'init':
        return {
          state: []
        }
      case 'push':
        return {
          state: state.concat(args[0])
        }
      case 'pop':
        if (state.length == 0)
          return {
            state : state,
            thrown: new Error('stack is empty').message
          }
        else
          return {
            state : state.slice(0, state.length-1),
            output: state[state.length-1]
          }
      case 'empty':
        return {
          state : state,
          output: state.length == 0
        }
      }
    }
  };

  describe('with a correct stack implementation', function() {
    var stack = {
      _data: [],

      push: function(x) {
        this._data.push(x);
      },

      pop: function() {
        if (this._data.length == 0)
          throw new Error('stack is empty');
        else
          return this._data.pop();
      },
      
      empty: function() {
        return this._data.length == 0;
      },

      init: function() {
        this._data = [];
      },

      apply: function(command, args) {
        return this[command].apply(this, args);
      }
    };

    it('leads to a passing test', function() {
      expect(stack).toConformTo(model);
    });
  });

  describe('with an incorrect stack implementation', function() {
    var stack = {
      _data: [],

      push: function(x) {
        this._data.push(x);
      },

      pop: function() {
        if (this._data.length == 0)
          throw new Error('stack is empty');
        else
          return this._data.shift();
      },
      
      empty: function() {
        return this._data.length == 0;
      },

      init: function() {
        this._data = [];
      },

      apply: function(command, args) {
        return this[command].apply(this, args);
      }
    };

    it('leads to a failing test', function() {
      expect(stack).not.toConformTo(model);
    });
  });
});
