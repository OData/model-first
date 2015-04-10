'use strict';

describe('Give Morpho a basic x:', function() {
  var a = Morpho.loadFromYaml('x');
  it('the internal object should be correct;', function() {
    expect(a.data).toEqual('x');
  });

  it('the output should be correct.', function() {
    expect(a.toCsdl()).toEqual('<ComplexType Name="x" />');
  });
});
