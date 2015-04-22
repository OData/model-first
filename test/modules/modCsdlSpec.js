'use strict';

describe('To CSDL test', function() {
  it('Empty complex type should work.', function() {
    var json = '{"types":[{"name":"x","properties":[]}]}';
    expect(json2Csdl(json)).toEqual('<ComplexType Name="x" />\n');
  });


  xit('Normal complex type should work.', function() {
    var json = '{"types":[{"name":"x","properties":[{"name":"p1","type":"int32"},{"name":"p2"}]}]}';
    expect(json2Csdl(json)).toEqual('<ComplexType Name="x" />\n');
  });
});


var morpho = new Morpho(window.morphoTestConfig);
function json2Csdl(input){
  return morpho.convert(input, 'json', 'csdl').result;
}
