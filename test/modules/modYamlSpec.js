'use strict';

describe('[YAML] api section test', function () {
    var input = '\
api:\n\
  name: Service0\n\
  version: 3';

    it('api name should match', function () {
        var model = Morpho.convertFrom.yaml.call(Morpho, input, {}, {});
        expect(model.api.name).toEqual('Service0');
    });

    it('api version without current format should match', function () {
        var model = Morpho.convertFrom.yaml.call(Morpho, input, {}, {});
        expect(model.api.version).toEqual(3);
    });

    it('api info object fields should match',
            fromYamlApiTest(
                    'api:\n\
          name: TripPin OData Reference Service\n\
          version:\n\
            current: 1.2.3\n\
          description: TripPin is a fictional reference service demonstrating the capabilities of OData v4.\n\
          termsOfService: http://swagger.io/terms/\n\
          contact:\n\
            name: API Support\n\
            url: http://www.swagger.io/support\n\
            email: support@swagger.io\n\
          license:\n\
            name: Apache 2.0\n\
            url: http://www.apache.org/licenses/LICENSE-2.0.html',
                    {
                        'name': 'TripPin OData Reference Service',
                        'version': {
                            'current': '1.2.3'
                        },
                        'description': 'TripPin is a fictional reference service demonstrating the capabilities of OData v4.',
                        'termsOfService': 'http://swagger.io/terms/',
                        'contact': {
                            'name': 'API Support',
                            'url': 'http://www.swagger.io/support',
                            'email': 'support@swagger.io'
                        },
                        'license': {
                            'name': 'Apache 2.0',
                            'url': 'http://www.apache.org/licenses/LICENSE-2.0.html'
                        }
                    })
            );
});

describe('[YAML] Primitive type definitions test', function () {
    var typesWithYAML = '\
    types:\n\
      - name: myType\n\
        requiredProperties:\n\
          - name: myProp1_1\n\
            type: binary\n\
          - name: myProp1_2\n\
            type: Binary\n\
          - name: myProp1_3\n\
            type: edm.binary\n\
          - name: myProp1_4\n\
            type: Edm.Binary\n\
          - name: myProp2_1\n\
            type: bool\n\
          - name: myProp2_2\n\
            type: Bool\n\
          - name: myProp2_3\n\
            type: boolean\n\
          - name: myProp2_4\n\
            type: Boolean\n\
          - name: myProp2_5\n\
            type: edm.boolean\n\
          - name: myProp2_6\n\
            type: Edm.Boolean\n\
          - name: myProp3_1\n\
            type: byte\n\
          - name: myProp3_2\n\
            type: Byte\n\
          - name: myProp3_3\n\
            type: edm.byte\n\
          - name: myProp3_4\n\
            type: Edm.Byte\n\
          - name: myProp4_1\n\
            type: date\n\
          - name: myProp4_2\n\
            type: Date\n\
          - name: myProp4_3\n\
            type: edm.date\n\
          - name: myProp4_4\n\
            type: Edm.Date\n\
          - name: myProp5_1\n\
            type: dateTimeOffset\n\
          - name: myProp5_2\n\
            type: DateTimeOffset\n\
          - name: myProp5_3\n\
            type: edm.datetimeoffset\n\
          - name: myProp5_4\n\
            type: Edm.DateTimeOffset\n\
          - name: myProp6_1\n\
            type: decimal\n\
          - name: myProp6_2\n\
            type: Decimal\n\
          - name: myProp6_3\n\
            type: edm.decimal\n\
          - name: myProp6_4\n\
            type: Edm.Decimal\n\
          - name: myProp7_1\n\
            type: double\n\
          - name: myProp7_2\n\
            type: Double\n\
          - name: myProp7_3\n\
            type: edm.double\n\
          - name: myProp7_4\n\
            type: Edm.Double\n\
          - name: myProp8_1\n\
            type: duration\n\
          - name: myProp8_2\n\
            type: Duration\n\
          - name: myProp8_3\n\
            type: edm.duration\n\
          - name: myProp8_4\n\
            type: Edm.Duration\n\
          - name: myProp9_1\n\
            type: guid\n\
          - name: myProp9_2\n\
            type: Guid\n\
          - name: myProp9_3\n\
            type: edm.guid\n\
          - name: myProp9_4\n\
            type: Edm.Guid\n\
          - name: myProp10_1\n\
            type: short\n\
          - name: myProp10_2\n\
            type: Short\n\
          - name: myProp10_3\n\
            type: edm.int16\n\
          - name: myProp10_4\n\
            type: Edm.Int16\n\
          - name: myProp11_1\n\
            type: int\n\
          - name: myProp11_2\n\
            type: Int\n\
          - name: myProp11_3\n\
            type: integer\n\
          - name: myProp11_4\n\
            type: Integer\n\
          - name: myProp11_5\n\
            type: edm.int32\n\
          - name: myProp11_6\n\
            type: Edm.Int32\n\
          - name: myProp12_1\n\
            type: long\n\
          - name: myProp12_2\n\
            type: Long\n\
          - name: myProp12_3\n\
            type: edm.int64\n\
          - name: myProp12_4\n\
            type: Edm.Int64\n\
          - name: myProp13_1\n\
            type: sbyte\n\
          - name: myProp13_2\n\
            type: Sbyte\n\
          - name: myProp13_3\n\
            type: edm.sbyte\n\
          - name: myProp13_4\n\
            type: Edm.Sbyte\n\
          - name: myProp14_1\n\
            type: single\n\
          - name: myProp14_2\n\
            type: Single\n\
          - name: myProp14_3\n\
            type: float\n\
          - name: myProp14_4\n\
            type: Float\n\
          - name: myProp14_5\n\
            type: edm.single\n\
          - name: myProp14_6\n\
            type: Edm.Single\n\
          - name: myProp15_1\n\
            type: stream\n\
          - name: myProp15_2\n\
            type: Stream\n\
          - name: myProp15_3\n\
            type: edm.stream\n\
          - name: myProp15_4\n\
            type: Edm.Stream\n\
          - name: myProp16_1\n\
            type: string\n\
          - name: myProp16_2\n\
            type: String\n\
          - name: myProp16_3\n\
            type: edm.string\n\
          - name: myProp16_4\n\
            type: Edm.String\n\
          - name: myProp17_1\n\
            type: timeOfDay\n\
          - name: myProp17_2\n\
            type: TimeOfDay\n\
          - name: myProp17_3\n\
            type: edm.timeofday\n\
          - name: myProp17_4\n\
            type: Edm.TimeOfDay\n\
          - name: myProp18_1\n\
            type: geography\n\
          - name: myProp18_2\n\
            type: Geography\n\
          - name: myProp18_3\n\
            type: edm.geography\n\
          - name: myProp18_4\n\
            type: Edm.Geography\n\
          - name: myProp19_1\n\
            type: geographyPoint\n\
          - name: myProp19_2\n\
            type: GeographyPoint\n\
          - name: myProp19_3\n\
            type: edm.geographypoint\n\
          - name: myProp19_4\n\
            type: Edm.GeographyPoint\n\
          - name: myProp20_1\n\
            type: geographyLineString\n\
          - name: myProp20_2\n\
            type: GeographyLineString\n\
          - name: myProp20_3\n\
            type: edm.geographylinestring\n\
          - name: myProp20_4\n\
            type: Edm.GeographyLineString\n\
          - name: myProp21_1\n\
            type: geographyPolygon\n\
          - name: myProp21_2\n\
            type: GeographyPolygon\n\
          - name: myProp21_3\n\
            type: edm.geographypolygon\n\
          - name: myProp21_4\n\
            type: Edm.GeographyPolygon\n\
          - name: myProp22_1\n\
            type: geographyMultiPoint\n\
          - name: myProp22_2\n\
            type: GeographyMultiPoint\n\
          - name: myProp22_3\n\
            type: edm.geographymultipoint\n\
          - name: myProp22_4\n\
            type: Edm.GeographyMultiPoint\n\
          - name: myProp23_1\n\
            type: geographyMultiLineString\n\
          - name: myProp23_2\n\
            type: GeographyMultiLineString\n\
          - name: myProp23_3\n\
            type: edm.geographymultilinestring\n\
          - name: myProp23_4\n\
            type: Edm.GeographyMultiLineString\n\
          - name: myProp24_1\n\
            type: geographyMultiPolygon\n\
          - name: myProp24_2\n\
            type: GeographyMultiPolygon\n\
          - name: myProp24_3\n\
            type: edm.geographymultipolygon\n\
          - name: myProp24_4\n\
            type: Edm.GeographyMultiPolygon\n\
          - name: myProp25_1\n\
            type: geographyCollection\n\
          - name: myProp25_2\n\
            type: GeographyCollection\n\
          - name: myProp25_3\n\
            type: edm.geographycollection\n\
          - name: myProp25_4\n\
            type: Edm.GeographyCollection\n\
          - name: myProp26_1\n\
            type: geometry\n\
          - name: myProp26_2\n\
            type: Geometry\n\
          - name: myProp26_3\n\
            type: edm.geometry\n\
          - name: myProp26_4\n\
            type: Edm.Geometry\n\
          - name: myProp27_1\n\
            type: geometryPoint\n\
          - name: myProp27_2\n\
            type: GeometryPoint\n\
          - name: myProp27_3\n\
            type: edm.geometrypoint\n\
          - name: myProp27_4\n\
            type: Edm.GeometryPoint\n\
          - name: myProp28_1\n\
            type: geometryLineString\n\
          - name: myProp28_2\n\
            type: GeometryLineString\n\
          - name: myProp28_3\n\
            type: edm.geometrylinestring\n\
          - name: myProp28_4\n\
            type: Edm.GeometryLineString\n\
          - name: myProp29_1\n\
            type: geometryPolygon\n\
          - name: myProp29_2\n\
            type: GeometryPolygon\n\
          - name: myProp29_3\n\
            type: edm.geometrypolygon\n\
          - name: myProp29_4\n\
            type: Edm.GeometryPolygon\n\
          - name: myProp30_1\n\
            type: geometryMultiPoint\n\
          - name: myProp30_2\n\
            type: GeometryMultiPoint\n\
          - name: myProp30_3\n\
            type: edm.geometrymultipoint\n\
          - name: myProp30_4\n\
            type: Edm.GeometryMultiPoint\n\
          - name: myProp31_1\n\
            type: geometryMultiLineString\n\
          - name: myProp31_2\n\
            type: GeometryMultiLineString\n\
          - name: myProp31_3\n\
            type: edm.geometrymultilinestring\n\
          - name: myProp31_4\n\
            type: Edm.GeometryMultiLineString\n\
          - name: myProp32_1\n\
            type: geometryMultiPolygon\n\
          - name: myProp32_2\n\
            type: GeometryMultiPolygon\n\
          - name: myProp32_3\n\
            type: edm.geometrymultipolygon\n\
          - name: myProp32_4\n\
            type: Edm.GeometryMultiPolygon\n\
          - name: myProp33_1\n\
            type: geometryCollection\n\
          - name: myProp33_2\n\
            type: GeometryCollection\n\
          - name: myProp33_3\n\
            type: edm.geometrycollection\n\
          - name: myProp33_4\n\
            type: Edm.GeometryCollection\n\
    ';
    var typesWithJSON = [
        {
            'properties': [
                {'name': 'myProp1_1', 'type': 'edm.binary'},
                {'name': 'myProp1_2', 'type': 'edm.binary'},
                {'name': 'myProp1_3', 'type': 'edm.binary'},
                {'name': 'myProp1_4', 'type': 'edm.binary'},
                {'name': 'myProp2_1', 'type': 'edm.boolean'},
                {'name': 'myProp2_2', 'type': 'edm.boolean'},
                {'name': 'myProp2_3', 'type': 'edm.boolean'},
                {'name': 'myProp2_4', 'type': 'edm.boolean'},
                {'name': 'myProp2_5', 'type': 'edm.boolean'},
                {'name': 'myProp2_6', 'type': 'edm.boolean'},
                {'name': 'myProp3_1', 'type': 'edm.byte'},
                {'name': 'myProp3_2', 'type': 'edm.byte'},
                {'name': 'myProp3_3', 'type': 'edm.byte'},
                {'name': 'myProp3_4', 'type': 'edm.byte'},
                {'name': 'myProp4_1', 'type': 'edm.date'},
                {'name': 'myProp4_2', 'type': 'edm.date'},
                {'name': 'myProp4_3', 'type': 'edm.date'},
                {'name': 'myProp4_4', 'type': 'edm.date'},
                {'name': 'myProp5_1', 'type': 'edm.datetimeoffset'},
                {'name': 'myProp5_2', 'type': 'edm.datetimeoffset'},
                {'name': 'myProp5_3', 'type': 'edm.datetimeoffset'},
                {'name': 'myProp5_4', 'type': 'edm.datetimeoffset'},
                {'name': 'myProp6_1', 'type': 'edm.decimal'},
                {'name': 'myProp6_2', 'type': 'edm.decimal'},
                {'name': 'myProp6_3', 'type': 'edm.decimal'},
                {'name': 'myProp6_4', 'type': 'edm.decimal'},
                {'name': 'myProp7_1', 'type': 'edm.double'},
                {'name': 'myProp7_2', 'type': 'edm.double'},
                {'name': 'myProp7_3', 'type': 'edm.double'},
                {'name': 'myProp7_4', 'type': 'edm.double'},
                {'name': 'myProp8_1', 'type': 'edm.duration'},
                {'name': 'myProp8_2', 'type': 'edm.duration'},
                {'name': 'myProp8_3', 'type': 'edm.duration'},
                {'name': 'myProp8_4', 'type': 'edm.duration'},
                {'name': 'myProp9_1', 'type': 'edm.guid'},
                {'name': 'myProp9_2', 'type': 'edm.guid'},
                {'name': 'myProp9_3', 'type': 'edm.guid'},
                {'name': 'myProp9_4', 'type': 'edm.guid'},
                {'name': 'myProp10_1', 'type': 'edm.int16'},
                {'name': 'myProp10_2', 'type': 'edm.int16'},
                {'name': 'myProp10_3', 'type': 'edm.int16'},
                {'name': 'myProp10_4', 'type': 'edm.int16'},
                {'name': 'myProp11_1', 'type': 'edm.int32'},
                {'name': 'myProp11_2', 'type': 'edm.int32'},
                {'name': 'myProp11_3', 'type': 'edm.int32'},
                {'name': 'myProp11_4', 'type': 'edm.int32'},
                {'name': 'myProp11_5', 'type': 'edm.int32'},
                {'name': 'myProp11_6', 'type': 'edm.int32'},
                {'name': 'myProp12_1', 'type': 'edm.int64'},
                {'name': 'myProp12_2', 'type': 'edm.int64'},
                {'name': 'myProp12_3', 'type': 'edm.int64'},
                {'name': 'myProp12_4', 'type': 'edm.int64'},
                {'name': 'myProp13_1', 'type': 'edm.sbyte'},
                {'name': 'myProp13_2', 'type': 'edm.sbyte'},
                {'name': 'myProp13_3', 'type': 'edm.sbyte'},
                {'name': 'myProp13_4', 'type': 'edm.sbyte'},
                {'name': 'myProp14_1', 'type': 'edm.single'},
                {'name': 'myProp14_2', 'type': 'edm.single'},
                {'name': 'myProp14_3', 'type': 'edm.single'},
                {'name': 'myProp14_4', 'type': 'edm.single'},
                {'name': 'myProp14_5', 'type': 'edm.single'},
                {'name': 'myProp14_6', 'type': 'edm.single'},
                {'name': 'myProp15_1', 'type': 'edm.stream'},
                {'name': 'myProp15_2', 'type': 'edm.stream'},
                {'name': 'myProp15_3', 'type': 'edm.stream'},
                {'name': 'myProp15_4', 'type': 'edm.stream'},
                {'name': 'myProp16_1', 'type': 'edm.string'},
                {'name': 'myProp16_2', 'type': 'edm.string'},
                {'name': 'myProp16_3', 'type': 'edm.string'},
                {'name': 'myProp16_4', 'type': 'edm.string'},
                {'name': 'myProp17_1', 'type': 'edm.timeofday'},
                {'name': 'myProp17_2', 'type': 'edm.timeofday'},
                {'name': 'myProp17_3', 'type': 'edm.timeofday'},
                {'name': 'myProp17_4', 'type': 'edm.timeofday'},
                {'name': 'myProp18_1', 'type': 'edm.geography'},
                {'name': 'myProp18_2', 'type': 'edm.geography'},
                {'name': 'myProp18_3', 'type': 'edm.geography'},
                {'name': 'myProp18_4', 'type': 'edm.geography'},
                {'name': 'myProp19_1', 'type': 'edm.geographypoint'},
                {'name': 'myProp19_2', 'type': 'edm.geographypoint'},
                {'name': 'myProp19_3', 'type': 'edm.geographypoint'},
                {'name': 'myProp19_4', 'type': 'edm.geographypoint'},
                {'name': 'myProp20_1', 'type': 'edm.geographylinestring'},
                {'name': 'myProp20_2', 'type': 'edm.geographylinestring'},
                {'name': 'myProp20_3', 'type': 'edm.geographylinestring'},
                {'name': 'myProp20_4', 'type': 'edm.geographylinestring'},
                {'name': 'myProp21_1', 'type': 'edm.geographypolygon'},
                {'name': 'myProp21_2', 'type': 'edm.geographypolygon'},
                {'name': 'myProp21_3', 'type': 'edm.geographypolygon'},
                {'name': 'myProp21_4', 'type': 'edm.geographypolygon'},
                {'name': 'myProp22_1', 'type': 'edm.geographymultipoint'},
                {'name': 'myProp22_2', 'type': 'edm.geographymultipoint'},
                {'name': 'myProp22_3', 'type': 'edm.geographymultipoint'},
                {'name': 'myProp22_4', 'type': 'edm.geographymultipoint'},
                {'name': 'myProp23_1', 'type': 'edm.geographymultilinestring'},
                {'name': 'myProp23_2', 'type': 'edm.geographymultilinestring'},
                {'name': 'myProp23_3', 'type': 'edm.geographymultilinestring'},
                {'name': 'myProp23_4', 'type': 'edm.geographymultilinestring'},
                {'name': 'myProp24_1', 'type': 'edm.geographymultipolygon'},
                {'name': 'myProp24_2', 'type': 'edm.geographymultipolygon'},
                {'name': 'myProp24_3', 'type': 'edm.geographymultipolygon'},
                {'name': 'myProp24_4', 'type': 'edm.geographymultipolygon'},
                {'name': 'myProp25_1', 'type': 'edm.geographycollection'},
                {'name': 'myProp25_2', 'type': 'edm.geographycollection'},
                {'name': 'myProp25_3', 'type': 'edm.geographycollection'},
                {'name': 'myProp25_4', 'type': 'edm.geographycollection'},
                {'name': 'myProp26_1', 'type': 'edm.geometry'},
                {'name': 'myProp26_2', 'type': 'edm.geometry'},
                {'name': 'myProp26_3', 'type': 'edm.geometry'},
                {'name': 'myProp26_4', 'type': 'edm.geometry'},
                {'name': 'myProp27_1', 'type': 'edm.geometrypoint'},
                {'name': 'myProp27_2', 'type': 'edm.geometrypoint'},
                {'name': 'myProp27_3', 'type': 'edm.geometrypoint'},
                {'name': 'myProp27_4', 'type': 'edm.geometrypoint'},
                {'name': 'myProp28_1', 'type': 'edm.geometrylinestring'},
                {'name': 'myProp28_2', 'type': 'edm.geometrylinestring'},
                {'name': 'myProp28_3', 'type': 'edm.geometrylinestring'},
                {'name': 'myProp28_4', 'type': 'edm.geometrylinestring'},
                {'name': 'myProp29_1', 'type': 'edm.geometrypolygon'},
                {'name': 'myProp29_2', 'type': 'edm.geometrypolygon'},
                {'name': 'myProp29_3', 'type': 'edm.geometrypolygon'},
                {'name': 'myProp29_4', 'type': 'edm.geometrypolygon'},
                {'name': 'myProp30_1', 'type': 'edm.geometrymultipoint'},
                {'name': 'myProp30_2', 'type': 'edm.geometrymultipoint'},
                {'name': 'myProp30_3', 'type': 'edm.geometrymultipoint'},
                {'name': 'myProp30_4', 'type': 'edm.geometrymultipoint'},
                {'name': 'myProp31_1', 'type': 'edm.geometrymultilinestring'},
                {'name': 'myProp31_2', 'type': 'edm.geometrymultilinestring'},
                {'name': 'myProp31_3', 'type': 'edm.geometrymultilinestring'},
                {'name': 'myProp31_4', 'type': 'edm.geometrymultilinestring'},
                {'name': 'myProp32_1', 'type': 'edm.geometrymultipolygon'},
                {'name': 'myProp32_2', 'type': 'edm.geometrymultipolygon'},
                {'name': 'myProp32_3', 'type': 'edm.geometrymultipolygon'},
                {'name': 'myProp32_4', 'type': 'edm.geometrymultipolygon'},
                {'name': 'myProp33_1', 'type': 'edm.geometrycollection'},
                {'name': 'myProp33_2', 'type': 'edm.geometrycollection'},
                {'name': 'myProp33_3', 'type': 'edm.geometrycollection'},
                {'name': 'myProp33_4', 'type': 'edm.geometrycollection'}],
            'name': 'myType'
        }];

    it('Define properties with primitive type using normal format should work well.', fromYamlTypeTest(typesWithYAML, typesWithJSON));

    typesWithYAML = '\
    types:\n\
      - name: myType\n\
        requiredProperties:\n\
          - name: myProp1\n\
            type: Edm.TEST\n\
          - name: myProp2\n\
            type: edm.type\n\
          - name: myProp3\n\
            type: myType\n\
    ';
    typesWithJSON = [
        {
            'properties': [
                {'name': 'myProp1', 'type': 'Edm.TEST'},
                {'name': 'myProp2', 'type': 'edm.type'},
                {'name': 'myProp3', 'type': 'myType'}],
            'name': 'myType'
        }];

    it('Define properties with undefined (user-defined) type should work well.', fromYamlTypeTest(typesWithYAML, typesWithJSON));

    typesWithYAML = '\
    types:\n\
      - name: myType\n\
        requiredProperties:\n\
          - name: myProp1\n\
            type: EDm.sTRing\n\
          - name: myProp2\n\
            type: EDM.GEOMETRYPOLYGON\n\
          - name: myProp3\n\
            type: Int16\n\
          - name: myProp4\n\
            type: Int32\n\
          - name: myProp5\n\
            type: Int64\n\
    ';
    typesWithJSON = [
        {
            'properties': [
                {'name': 'myProp1', 'type': 'edm.string'},
                {'name': 'myProp2', 'type': 'edm.geometrypolygon'},
                {'name': 'myProp3', 'type': 'edm.int16'},
                {'name': 'myProp4', 'type': 'edm.int32'},
                {'name': 'myProp5', 'type': 'edm.int64'}],
            'name': 'myType'
        }];

    it('Define properties with primitive type using abnormal format should work well.', fromYamlTypeTest(typesWithYAML, typesWithJSON));
});

describe('[YAML] Type section test', function () {

    it('Enum with values should work',
            fromYamlTypeTest(
                    '\
            types:\n\
              - name: personGender\n\
                members:\n\
                  - name: unknown\n\
                    value: 0\n\
                  - name: female\n\
                    value: -1\n\
                  - name: male\n\
                    value: 2\n\
                flags: false\n\
                underlyingType: int',
                    [{
                            'name': 'personGender',
                            'members': [{'name': 'unknown', 'value': 0}, {'name': 'female', 'value': -1}, {
                                    'name': 'male',
                                    'value': 2
                                }],
                            'flags': false,
                            'underlyingType': 'edm.int32'
                        }]));

    it('Enum without values should work',
            fromYamlTypeTest(
                    '\
            types:\n\
              - name: personGender\n\
                members: [unknown, female, male]',
                    [{'name': 'personGender', 'members': [{'name': 'unknown'}, {'name': 'female'}, {'name': 'male'}]}]));

    it('Single property should work.',
            fromYamlTypeTest(
                    '\
            types:\n\
              - name: type1\n\
                requiredProperties: p1\n',
                    [{'properties': [{'name': 'p1'}], 'name': 'type1'}]));

    it('Multiple properties should work,using -.',
            fromYamlTypeTest(
                    '\
            types:\n\
              - name: type1\n\
                requiredProperties:\n\
                  - p1\n\
                  - p3\n',
                    [{'properties': [{'name': 'p1'}, {'name': 'p3'}], 'name': 'type1'}]));

    it('Multiple properties should work,using [].',
            fromYamlTypeTest(
                    '\
            types:\n\
              - name: type1\n\
                requiredProperties: [p1, p3]\n',
                    [{'properties': [{'name': 'p1'}, {'name': 'p3'}], 'name': 'type1'}]));

    it('Property with facets should work.',
            fromYamlTypeTest(
                    '\
            types:\n\
              - name: type1\n\
                requiredProperties:\n\
                  - name: p1\n\
                    type: int\n',
                    [{'properties': [{'name': 'p1', 'type': 'edm.int32'}], 'name': 'type1'}]));

    it('Combined Property case should work.',
            fromYamlTypeTest(
                    '\
            types:\n\
              - name: type1\n\
                requiredProperties:\n\
                  - name: p1\n\
                    type: long\n\
                  - p2',
                    [{'properties': [{'name': 'p1', 'type': 'edm.int64'}, {'name': 'p2'}], 'name': 'type1'}]));

    it('Combined Property case should work, default type should be set.',
            fromYamlTypeTest(
                    '\
            types:\n\
              - name: type1\n\
                requiredProperties:\n\
                  - name: p1\n\
                    type: long\n\
                  - p2',
                    [{
                            'properties': [
                                {'name': 'p1', 'type': 'edm.int64'},
                                {'name': 'p2', 'type': 'edm.string'}
                            ], 'name': 'type1'
                        }],
                    true));

    it('Key and Nullable facets should work.',
            fromYamlTypeTest(
                    '\
            types:\n\
              - name: type1\n\
                key: [s1, s2]\n\
                optionalProperties:\n\
                  - name: p1\n\
                    type: long\n',
                    [{
                            'properties': [
                                {'name': 's1', 'isKey': true},
                                {'name': 's2', 'isKey': true},
                                {'name': 'p1', 'type': 'edm.int64', 'isNullable': true}
                            ],
                            'name': 'type1'
                        }
                    ]));

    it('Combined Property case should work.',
            fromYamlTypeTest(
                    '\
            types:\n\
              - name: type1\n\
                requiredProperties:\n\
                  - name: p1\n\
                    type: long\n\
                  - p2\n',
                    [{
                            'properties': [
                                {'name': 'p1', 'type': 'edm.int64'},
                                {'name': 'p2'}],
                            'name': 'type1'
                        }]));

    it('Combined Property case should work, default type should be set.',
            fromYamlTypeTest(
                    '\
            types:\n\
              - name: type1\n\
                optionalProperties: [op1, op2]\n\
                requiredProperties:\n\
                  - name: p1\n\
                    type: long\n\
                  - p2\n',
                    [{
                            'properties': [
                                {'name': 'op1', 'isNullable': true, 'type': 'edm.string'},
                                {'name': 'op2', 'isNullable': true, 'type': 'edm.string'},
                                {'name': 'p1', 'type': 'edm.int64'},
                                {'name': 'p2', 'type': 'edm.string'}],
                            'name': 'type1'
                        }], true));

    it('Type Inheritance should work',
            fromYamlTypeTest(
                    '\
            types:\n\
              - name: planItem\n\
                key: planItemId\n\
                optionalProperties:\n\
                  - confirmationCode\n\
                  - name: startsAt\n\
                    type: dateTimeOffset\n\
                  - name: endsAt\n\
                    type: dateTimeOffset\n\
                  - name: duration\n\
                    type: duration\n\
              - name: publicTransportation\n\
                baseType: planItem\n\
                optionalProperties: seatNumber\n\
              - name: flight\n\
                baseType: publicTransportation\n\
                requiredProperties: flightNumber\n\
                optionalProperties:\n\
                  - name: from\n\
                    type: airport\n\
                  - name: to\n\
                    type: airport\n\
                  - name: airline\n\
                    type: airline\n\
              - name: event\n\
                baseType: planItem\n\
                dynamic: true\n\
                optionalProperties:\n\
                  - description\n\
                  - name: occursAt\n\
                    type: eventLocation\n',
                    [{
                            'properties': [
                                {
                                    'name': 'planItemId',
                                    'isKey': true,
                                    'type': 'edm.string'
                                },
                                {
                                    'name': 'confirmationCode',
                                    'isNullable': true,
                                    'type': 'edm.string'
                                },
                                {
                                    'name': 'startsAt',
                                    'type': 'edm.datetimeoffset',
                                    'isNullable': true
                                },
                                {
                                    'name': 'endsAt',
                                    'type': 'edm.datetimeoffset',
                                    'isNullable': true
                                },
                                {
                                    'name': 'duration',
                                    'type': 'edm.duration',
                                    'isNullable': true
                                }
                            ],
                            'name': 'planItem'
                        },
                        {
                            'properties': [
                                {
                                    'name': 'seatNumber',
                                    'isNullable': true,
                                    'type': 'edm.string'
                                }
                            ],
                            'name': 'publicTransportation',
                            'baseType': 'planItem'
                        },
                        {
                            'properties': [
                                {
                                    'name': 'flightNumber',
                                    'type': 'edm.string'
                                },
                                {
                                    'name': 'from',
                                    'type': 'airport',
                                    'isNullable': true
                                },
                                {
                                    'name': 'to',
                                    'type': 'airport',
                                    'isNullable': true
                                },
                                {
                                    'name': 'airline',
                                    'type': 'airline',
                                    'isNullable': true
                                }
                            ],
                            'name': 'flight',
                            'baseType': 'publicTransportation'
                        },
                        {
                            'properties': [
                                {
                                    'name': 'description',
                                    'isNullable': true,
                                    'type': 'edm.string'
                                },
                                {
                                    'name': 'occursAt',
                                    'type': 'eventLocation',
                                    'isNullable': true
                                }
                            ],
                            'name': 'event',
                            'baseType': 'planItem'
                        }], true));
});

// Testing for operations
// 1. Testing for all kinds of actions.
describe('[YAML] Actions test', function () {
    var unboundActionWithYAML = '\
    root:\n\
      # Unbound Action\n\
      - name: actionTest\n\
        params:\n\
          - name: p1\n\
            type: int\n\
          - name: str1\n\
          - str2';
    var unboundActionWithJSON =
            {
                'operations': [
                    {
                        'type': 'Action',
                        'operationType': 'Unbound',
                        'name': 'actionTest',
                        'params': [
                            {
                                'name': 'p1',
                                'type': 'edm.int32'
                            },
                            {
                                'name': 'str1',
                                'type': 'edm.string'
                            },
                            {
                                'name': 'str2',
                                'type': 'edm.string'
                            }]
                    }
                ]
            };

    it('Unbound action without return types should work', fromYamlRootTest(unboundActionWithYAML, unboundActionWithJSON));

    var boundActionWithYAML = '\
    types:\n\
      - operations:\n\
          - name: actionTest\n\
            params:\n\
              - name: p1\n\
                type: int\n\
              - name: str1\n\
              - str2';
    var boundActionWithJSON = [
        {
            'properties': [
                {
                    'name': 'actionTest',
                    'type': 'Action',
                    'params': [
                        {
                            'name': 'p1',
                            'type': 'edm.int32'
                        },
                        {
                            'name': 'str1',
                            'type': 'edm.string'
                        },
                        {
                            'name': 'str2',
                            'type': 'edm.string'
                        }],
                    'operationType': 'Bound'
                }
            ]
        }];

    it('Bound action without return types should work', fromYamlTypeTest(boundActionWithYAML, boundActionWithJSON));
});

// 2. Testing for all kinds of functions.
describe('[YAML] Functions test', function () {

    var unboundFunctionWithYAML = '\
    root:\n\
      - name: functionTest\n\
        params:\n\
          - name: friend\n\
            type: person\n\
        returns: person[]';
    var unboundFunctionWithJSON =
            {
                'operations': [
                    {
                        'type': 'Function',
                        'operationType': 'Unbound',
                        'name': 'functionTest',
                        'params': [
                            {
                                'name': 'friend',
                                'type': 'person'
                            }],
                        'returns': {
                            'type': 'person',
                            'isCollection': true
                        }
                    }
                ]
            };

    it('Unbound function with a return type should work', fromYamlRootTest(unboundFunctionWithYAML, unboundFunctionWithJSON));

    var boundFunctionWithYAML = '\
    types:\n\
      - operations:\n\
          - name: functionTest\n\
            params:\n\
              - name: id\n\
                type: int64\n\
            returns: string';
    var boundFunctionWithJSON = [
        {
            'properties': [
                {
                    'name': 'functionTest',
                    'type': 'Function',
                    'params': [
                        {
                            'name': 'id',
                            'type': 'edm.int64'
                        }],
                    'returns': {
                        'type': 'edm.string'
                    },
                    'operationType': 'Bound'
                }
            ]
        }];

    it('Bound function with a return type should work', fromYamlTypeTest(boundFunctionWithYAML, boundFunctionWithJSON));
});

describe('[YAML] Root section tests', function () {
    it('EntitySet should work', fromYamlRootTest(
            '\
        root:\n\
          # Collection\n\
          - name: things\n\
            url: things # Optional\n\
            type: thing[]\n\
            allows: [read, create, update, delete, query, order, page] # Optional\n\
          # Singleton\n\
          - name: me\n\
            type: user\n\
          # Operation\n\
          - name: getFavoriteThings\n\
            params: # Optional\n\
              - name: userId\n\
                type: integer # Optional\n\
            returns: thing[] # Optional\n',
            {
                'entitysets': [{
                        'name': 'things',
                        'type': 'thing',
                        'allows': ['read', 'create', 'update', 'delete', 'query', 'order', 'page']
                    }],
                'singletons': [{'name': 'me', 'type': 'user'}],
                'operations': [{
                        'type': 'Function',
                        'operationType': 'Unbound',
                        'name': 'getFavoriteThings',
                        'params': [{
                                'name': 'userId',
                                'type': 'edm.int32'
                            }],
                        'returns': {
                            'type': 'thing',
                            'isCollection': true
                        }
                    }]
            }));

    it('Empty EntitySet should work', fromYamlRootTest(
            '\
        root:\n\
          - name: things\n\
            url: things\n\
            type: thing[]\n\
          - name: thingsNew\n\
            type: things[]\n\
            allows: [create, update] \n',
            {
                'entitysets': [{
                        'name': 'things',
                        'type': 'thing'
                    },
                    {
                        'name': 'thingsNew',
                        'type': 'things',
                        'allows': ['create', 'update']
                    }]
            }));
});

describe('[YAML] Error test', function () {
    it('Error check', function () {
        var input = '\
types:\n\
  - name: type1\n\
    requiredProperties:\n\
      -name: p1\n\
        type: long\n\
      - p2';
        Morpho.convert(input, 'yaml', 'json', defaultConfig, function (errors) {
            expect(errors.length).toEqual(1);
            var error = errors[0];
            expect(error.lineNumber).toEqual(4);
            expect(error.message).toEqual('bad indentation of a mapping entry');
        });
    });
});

var defaultConfig = {addDefaults: true, format: true};

function fromYamlRootTest(input, root) {
    return fromYamlTest(input, root, 'container');
}

function fromYamlTypeTest(input, types, addDefaults) {
    return fromYamlTest(input, types, 'types', addDefaults);
}

function fromYamlApiTest(input, api, addDefaults) {
    return fromYamlTest(input, api, 'api', addDefaults);
}

function fromYamlTest(input, json, section, addDefaults) {
    return function () {
        var actual = Morpho.convert(input, 'yaml', 'json', {addDefaults: addDefaults, returnJSON: true}).model;
        if (section)
            actual = actual[section];

        expect('\n' + JSON.stringify(actual)).toEqual('\n' + JSON.stringify(json));
    };
}
