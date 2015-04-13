'use strict';

describe('Load from YAML tests:', function() {
  var a = Morpho.loadFromYaml('x');
  it('Input is simple string', function() {
    expect(a.type).toEqual(['x']);
  });
});
