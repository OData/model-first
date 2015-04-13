'use strict';

describe('To CSDL test', function() {
  var a = Morpho.loadFromYaml('x');

  it('Output is a complex type.', function() {
    expect(a.toCsdl()).toEqual('<ComplexType Name="x" />');
  });
});
