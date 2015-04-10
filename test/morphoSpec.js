'use strict';

describe('test', function() {
  var a = Morpho.loadFromYaml('x');
  it('lets test', function() {
    expect(a.data).toEqual('x');
  });

  it('lets test', function() {
    expect(a.toCsdl()).toEqual('<ComplexType Name="x" />');
  });
});
