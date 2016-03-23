var config = require('../../src/codegen/config');

var fullNamespace='Microsoft.OData.SampleService.Models.TripPin';
var castToMethodGenerator = require('../../src/codegen/modules/castToMethod');

// Need user configure or we got from the ymal?
var languageDependentNamespace = config.Constants.Code.DefaultNamespace;

describe('[Client CodeGen] CastTo Method', function () {

    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    }

    fit('Entitysets should match.', function () {
        var model = {
          "types": [
            {
              "properties": [
                {
                  "name": "address",
                  "type": "edm.string"
                },
                {
                  "name": "city",
                  "type": "city"
                }
              ],
              "name": "location"
            },
            {
              "properties": [
                {
                  "name": "planItemId",
                  "isKey": true,
                  "type": "edm.string"
                },
                {
                  "name": "confirmationCode",
                  "isNullable": true,
                  "type": "edm.string"
                },
                {
                  "name": "startsAt",
                  "type": "edm.datetimeoffset",
                  "isNullable": true
                },
                {
                  "name": "endsAt",
                  "type": "edm.datetimeoffset",
                  "isNullable": true
                },
                {
                  "name": "duration",
                  "type": "edm.duration",
                  "isNullable": true
                }
              ],
              "name": "planItem"
            },
            {
              "properties": [
                {
                  "name": "seatNumber",
                  "isNullable": true,
                  "type": "edm.string"
                }
              ],
              "name": "publicTransportation",
              "baseType": "planItem"
            },
            {
              "properties": [
                {
                  "name": "flightNumber",
                  "type": "edm.string"
                },
                {
                  "name": "from",
                  "type": "airport",
                  "isNullable": true
                },
                {
                  "name": "to",
                  "type": "airport",
                  "isNullable": true
                },
                {
                  "name": "airline",
                  "type": "airline",
                  "isNullable": true
                }
              ],
              "name": "flight",
              "baseType": "publicTransportation"
            },
            {
              "properties": [
                {
                  "name": "description",
                  "isNullable": true,
                  "type": "edm.string"
                },
                {
                  "name": "occursAt",
                  "type": "eventLocation",
                  "isNullable": true
                }
              ],
              "name": "event",
              "baseType": "planItem"
            },
          ]
        };
        var expected ='\
        /// <summary>\n\
        /// Cast an entity of type global::OData.Service.V4.Client.planItem to its derived type global::OData.Service.V4.Client.publicTransportation\n\
        /// </summary>\n\
        /// <param name="source">source entity</param>\n\
        public static global::OData.Service.V4.Client.publicTransportationSingle CastToPublicTransportation(this global::Microsoft.OData.Client.DataServiceQuerySingle<global::OData.Service.V4.Client.planItem> source)\n\
        {\n\
            global::Microsoft.OData.Client.DataServiceQuerySingle<global::OData.Service.V4.Client.publicTransportation> query = source.CastTo<global::OData.Service.V4.Client.publicTransportation>();\n\
            return new global::OData.Service.V4.Client.publicTransportationSingle(source.Context, query.GetPath(null));\n\
        }\n\
        /// <summary>\n\
        /// Cast an entity of type global::OData.Service.V4.Client.publicTransportation to its derived type global::OData.Service.V4.Client.flight\n\
        /// </summary>\n\
        /// <param name="source">source entity</param>\n\
        public static global::OData.Service.V4.Client.flightSingle CastToFlight(this global::Microsoft.OData.Client.DataServiceQuerySingle<global::OData.Service.V4.Client.publicTransportation> source)\n\
        {\n\
            global::Microsoft.OData.Client.DataServiceQuerySingle<global::OData.Service.V4.Client.flight> query = source.CastTo<global::OData.Service.V4.Client.flight>();\n\
            return new global::OData.Service.V4.Client.flightSingle(source.Context, query.GetPath(null));\n\
        }\n\
        /// <summary>\n\
        /// Cast an entity of type global::OData.Service.V4.Client.planItem to its derived type global::OData.Service.V4.Client.flight\n\
        /// </summary>\n\
        /// <param name="source">source entity</param>\n\
        public static global::OData.Service.V4.Client.flightSingle CastToFlight(this global::Microsoft.OData.Client.DataServiceQuerySingle<global::OData.Service.V4.Client.planItem> source)\n\
        {\n\
            global::Microsoft.OData.Client.DataServiceQuerySingle<global::OData.Service.V4.Client.flight> query = source.CastTo<global::OData.Service.V4.Client.flight>();\n\
            return new global::OData.Service.V4.Client.flightSingle(source.Context, query.GetPath(null));\n\
        }\n\
        /// <summary>\n\
        /// Cast an entity of type global::OData.Service.V4.Client.planItem to its derived type global::OData.Service.V4.Client.@event\n\
        /// </summary>\n\
        /// <param name="source">source entity</param>\n\
        public static global::OData.Service.V4.Client.eventSingle CastToEvent(this global::Microsoft.OData.Client.DataServiceQuerySingle<global::OData.Service.V4.Client.planItem> source)\n\
        {\n\
            global::Microsoft.OData.Client.DataServiceQuerySingle<global::OData.Service.V4.Client.@event> query = source.CastTo<global::OData.Service.V4.Client.@event>();\n\
            return new global::OData.Service.V4.Client.eventSingle(source.Context, query.GetPath(null));\n\
        }\n';

        var actual = castToMethodGenerator.generateCastTo(model);
        expect(actual).toEqual(expected);
    });    
});
