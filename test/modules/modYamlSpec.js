'use strict';

describe('Load from Simple YAML test:', function() {
  var input=' \
service: \
  - name: Service0\
types: \
  - name: type1 \
    key: id \
    requiredProperties: name';

  var model = Morpho.loadFromYaml(input);
  xit('Name should match', function() {
    expect(model.name).toEqual('Service0');
  });
  xit('Type count should match', function() {
    expect(model.toJson()).toEqual('{"name":"name","type":["x"],"err":[]}');
  });
  xit('Debug string should match', function() {
    expect(model.toJson()).toEqual('{"name":"name","type":["x"],"err":[]}');
  });
});
