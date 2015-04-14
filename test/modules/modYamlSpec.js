'use strict';

describe('Load from Simple YAML test:', function() {
  var input='\
service:\n\
  name: Service0\n\
types:\n\
  - name: type1\n\
    key: id\n\
    requiredProperties: name\n';

  var model = Morpho.loadFromYaml(input);
  it('Service name should match', function() {
    expect(model.service.name).toEqual('Service0');
  });
  xit('Type count should match', function() {
    expect(model.toJson()).toEqual('{"name":"name","type":["x"],"err":[]}');
  });
  xit('Debug string should match', function() {
    expect(model.toJson()).toEqual('{"name":"name","type":["x"],"err":[]}');
  });
});
