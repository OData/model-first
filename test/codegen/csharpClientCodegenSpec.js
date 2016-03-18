describe('[Client CodeGen] CSharp test', function () {
    var codegen = require('../../src/codegen/modules/csharpClientCodegen');
    var genEnumType;
    var genByKey;
    var namespaceName = 'ODataV4Client.Proxies.TripPin';

    beforeEach(function () {
        genEnumType = codegen.genEnumType;
        genByKey =  codegen.genByKey;
    });

    it('generation for enum type.', function () {
        var enumTypeObj = {
            name: 'personGender',
            members: [
                {
                    name: 'unknown',
                    value: 0
                },
                {
                    name: 'female',
                    value: 1
                },
                {
                    name: 'male',
                    value: 2
                }
            ],
            flags: false,
            underlyingType: 'edm.int32'
        };

        var expected =
                '[global::Microsoft.OData.Client.OriginalNameAttribute("PersonGender")]\n\
public enum PersonGender: int\n\
{\n\
[global::Microsoft.OData.Client.OriginalNameAttribute("Unknown")]\n\
Unknown = 0,\n\
[global::Microsoft.OData.Client.OriginalNameAttribute("Female")]\n\
Female = 1,\n\
[global::Microsoft.OData.Client.OriginalNameAttribute("Male")]\n\
Male = 2\n\
}\n\n';
        var actual = genEnumType(enumTypeObj);

        expect(actual).toEqual(expected);
    });
    
        it('generation for ByKey funtions for each entity type.', function () {
        var typesObj = {
'types': [
    {
      'properties': [
        {
          'name': 'planItemId',
          'isKey': true,
          'type': 'edm.int32'
        },
        {
          'name': 'confirmationCode',
          'isKey': true,
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
    }
]};

        var expected =
                '\
        /// <summary>\n\
        /// Get an entity of type global::ODataV4Client.Proxies.TripPin.PlanItem as global::ODataV4Client.Proxies.TripPin.PlanItemSingle specified by key from an entity set\n\
        /// </summary>\n\
        /// <param name="source">source entity set</param>\n\
        /// <param name="keys">dictionary with the names and values of keys</param>\n\
        public static global::ODataV4Client.Proxies.TripPin.PlanItemSingle ByKey(this global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.PlanItem> source, global::System.Collections.Generic.Dictionary<string, object> keys)\n\
        {\n\
            return new global::ODataV4Client.Proxies.TripPin.PlanItemSingle(source.Context, source.GetKeyPath(global::Microsoft.OData.Client.Serializer.GetKeyString(source.Context, keys)));\n\
        }\n\
        /// <summary>\n\
        /// Get an entity of type global::ODataV4Client.Proxies.TripPin.PlanItem as global::ODataV4Client.Proxies.TripPin.PlanItemSingle specified by key from an entity set\n\
        /// </summary>\n\
        /// <param name="source">source entity set</param>\n\
        /// <param name="planItemId">The value of planItemId</param>\n\
        /// <param name="confirmationCode">The value of confirmationCode</param>\n\
        public static global::ODataV4Client.Proxies.TripPin.PlanItemSingle ByKey(this global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.PlanItem> source,\n\
            int planItemId, string confirmationCode)\n\
        {\n\
            global::System.Collections.Generic.Dictionary<string, object> keys = new global::System.Collections.Generic.Dictionary<string, object>\n\
            {\n\
                { "PlanItemId", planItemId },\n\
                { "ConfirmationCode", confirmationCode }\n\
            };\n\
            return new global::ODataV4Client.Proxies.TripPin.PlanItemSingle(source.Context, source.GetKeyPath(global::Microsoft.OData.Client.Serializer.GetKeyString(source.Context, keys)));\n\
        }\n\
        /// <summary>\n\
        /// Get an entity of type global::ODataV4Client.Proxies.TripPin.Event as global::ODataV4Client.Proxies.TripPin.EventSingle specified by key from an entity set\n\
        /// </summary>\n\
        /// <param name="source">source entity set</param>\n\
        /// <param name="keys">dictionary with the names and values of keys</param>\n\
        public static global::ODataV4Client.Proxies.TripPin.EventSingle ByKey(this global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.Event> source, global::System.Collections.Generic.Dictionary<string, object> keys)\n\
        {\n\
            return new global::ODataV4Client.Proxies.TripPin.EventSingle(source.Context, source.GetKeyPath(global::Microsoft.OData.Client.Serializer.GetKeyString(source.Context, keys)));\n\
        }\n\
        /// <summary>\n\
        /// Get an entity of type global::ODataV4Client.Proxies.TripPin.Event as global::ODataV4Client.Proxies.TripPin.EventSingle specified by key from an entity set\n\
        /// </summary>\n\
        /// <param name="source">source entity set</param>\n\
        /// <param name="planItemId">The value of planItemId</param>\n\
        /// <param name="confirmationCode">The value of confirmationCode</param>\n\
        public static global::ODataV4Client.Proxies.TripPin.EventSingle ByKey(this global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.Event> source,\n\
            int planItemId, string confirmationCode)\n\
        {\n\
            global::System.Collections.Generic.Dictionary<string, object> keys = new global::System.Collections.Generic.Dictionary<string, object>\n\
            {\n\
                { "PlanItemId", planItemId },\n\
                { "ConfirmationCode", confirmationCode }\n\
            };\n\
            return new global::ODataV4Client.Proxies.TripPin.EventSingle(source.Context, source.GetKeyPath(global::Microsoft.OData.Client.Serializer.GetKeyString(source.Context, keys)));\n\
        }\n';
        var actual = genByKey(typesObj.types, namespaceName);

        expect(actual).toEqual(expected);
    });
});