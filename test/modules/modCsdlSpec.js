'use strict';

describe('To CSDL test', function() {
  var a = Morpho.loadFromJson('{"types":[{"name":"x","properties":[]}],"err":[]}');

  it('Output is a complex type.', function() {
    expect(a.toCsdl()).toEqual('<ComplexType Name="x" />\n');
  });
});
