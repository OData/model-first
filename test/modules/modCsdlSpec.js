'use strict';

describe('To CSDL test', function() {
  var a = Morpho.loadFromJson('{"types":[{"name":"x","properties":[]}],"err":[]}');

  it('Empty complex type should work.', function() {
    expect(a.toCsdl()).toEqual('<ComplexType Name="x" />\n');
  });
  
  var b = Morpho.loadFromJson('{"types":[{"name":"x","properties":[{"name":"p1","type":"int32"},{"name":"p2"}]}],"err":[]}');
  
  xit('Normal complex type should work.', function() {
    expect(b.toCsdl()).toEqual('<ComplexType Name="x" />\n');
  });
});
