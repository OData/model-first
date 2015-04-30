'use strict';

describe('[Swagger] To Swagger test', function() {
  xit('Empty complex type should work.', function() {

  var jsonModel = 
    {
      'types':
      [
        {
          'name'        : 'pet',
          'properties'  : 
          [
            {
              'name'    : 'id'
            }
          ]
        }
      ]
    };

    expect(json2Swagger(jsonModel)).toEqual('<ComplexType Name="x" />\n');
  });
});


var morpho = new Morpho(window.morphoTestConfig);
function json2Swagger(input){
  return Morpho.convert(JSON.stringify(input), 'json', 'swagger').model;
}
