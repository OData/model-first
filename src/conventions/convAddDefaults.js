Morpho.addDefaults = function (model)
{
    var visitor = new Visitor();
    visitor.visitObj(model, {
        'types': function (obj) {
            visitor.visitArr(obj, function (obj) {
                visitor.visitObj(obj, {
                    'properties': function (properties) {
                        visitor.visitArr(properties, function (property) {
                            if (!property.type) {
                                property.type = 'edm.string';
                            }
                        });
                    }
                });
            });
        },
        'container': function (obj) {
            //allows: [read, create, update, delete]
            visitor.visitObj(obj, {
                'entitysets': function (es) {
                    visitor.visitArr(es, function (e) {
                        if (!e.allows)
                            e.allows = ['read'];
                    });
                },
                'singletons': function (es) {
                    visitor.visitArr(es, function (e) {
                        if (!e.allows)
                            e.allows = ['read'];
                    });
                }
            });
        }
    });
};
