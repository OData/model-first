var config = require('./config');
var EntityContainer = config.Constants.Code.EntityContainer;

// Need user configure or we got from the ymal?
var languageDependentNamespace = config.Constants.Code.DefaultNamespace;
var entityContainerGenerator = require('../../src/codegen/modules/entityContainerGenerator');
describe('[Client CodeGen] Entity Container', function () {

    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    }

    it('Entitysets should match.', function () {
        var entityContainer = {
            'entitysets': [
                {
                    'name': 'airports',
                    'type': 'airport',
                    'allows': [
                        'read'
                    ]
                }
            ],
            'singletons':[],
            'operations':[]
        };
        var expected ='\
        /// <summary>\n\
        /// There are no comments for Airports in the schema.\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("airports")]\n\
        public global::Microsoft.OData.Client.DataServiceQuery<Airpo> Airports\n\
        {\n\
            get\n\
            {\n\
                if ((this._Airports == null))\n\
                {\n\
                    this._Airports = base.CreateQuery<Airpo>(Airports);\n\
                }\n\
                return this._Airports;\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        private global::Microsoft.OData.Client.DataServiceQuery<Airpo> _Airports;\n\
        /// <summary>\n\
        /// There are no comments for Airports in the schema.\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        public void AddToAirports(Airpo airpo)\n\
        {\n\
            base.AddObject("Airports", airpo);\n\
        }\n';
        TestEntityContainer(entityContainer, expected);
    });

    it('Singletons should match.', function () {
        var entityContainer = {
            'entitysets': [],
            'singletons': [
              {
                'name': 'me',
                'type': 'person',
                'allows': [
                  'read'
                ]
              }
            ],
            'operations': []
        };
        var expected ='\
        /// <summary>\n\
        /// There are no comments for Me in the schema.\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("me")]\n\
        public PersonSingle Me\n\
        {\n\
            get\n\
            {\n\
                if ((this._Me == null))\n\
                {\n\
                    this._Me = new PersonSingle(this, "me");\n\
                }\n\
                return this._Me;\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        private PersonSingle _Me;\n';
        TestEntityContainer(entityContainer, expected);
    });

    it('Functions return values should match.', function () {
        var entityContainer = {
            'entitysets': [],
            'singletons': [],
            'operations': [{
                'type': 'Function',
                'operationType': 'Unbound',
                'name': 'getNearestAirport',
                'returns': {
                    'type': 'airport',
                    'isCollection': true
                }
            }]
        };
        var expected ='\
        /// <summary>\n\
        /// There are no comments for GetNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::Microsoft.OData.Client.DataServiceQuery<global::{0}.Airport> GetNearestAirport()\n\
        {\n\
            return this.CreateFunctionQuery<global::{0}.Airport>("", "getNearestAirport", false);\n\
        }\n'.format(languageDependentNamespace);

        TestEntityContainer(entityContainer, expected);

        entityContainer = {
            'entitysets': [],
            'singletons': [],
            'operations': [{
                'type': 'Function',
                'operationType': 'Unbound',
                'name': 'getNearestAirport',
                'returns': {
                    'type': 'edm.double',
                    'isCollection': true
                }
            }]
        };

        expected ='\
        /// <summary>\n\
        /// There are no comments for GetNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::Microsoft.OData.Client.DataServiceQuery<double> GetNearestAirport()\n\
        {\n\
            return this.CreateFunctionQuery<double>("", "getNearestAirport", false);\n\
        }\n';

        TestEntityContainer(entityContainer, expected);

        entityContainer = {
            'entitysets': [],
            'singletons': [],
            'operations': [{
                'type': 'Function',
                'operationType': 'Unbound',
                'name': 'getNearestAirport',
                'returns': {
                    'type': 'airport',
                    'isCollection': false
                }
            }]
        };

        expected ='\
        /// <summary>\n\
        /// There are no comments for GetNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::{0}.AirportSingle GetNearestAirport()\n\
        {\n\
            return new global::{0}.AirportSingle(this.CreateFunctionQuerySingle<global::{0}.Airport>("", "getNearestAirport", false));\n\
        }\n'.format(languageDependentNamespace);

        TestEntityContainer(entityContainer, expected);

        entityContainer = {
            'entitysets': [],
            'singletons': [],
            'operations': [{
                'type': 'Function',
                'operationType': 'Unbound',
                'name': 'getNearestAirport',
                'returns': {
                    'type': 'edm.double',
                    'isCollection': false,
                    'isNullable': true,
                }
            }]
        };

        expected ='\
        /// <summary>\n\
        /// There are no comments for GetNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::Microsoft.OData.Client.DataServiceQuerySingle<global::System.Nullable<double>> GetNearestAirport()\n\
        {\n\
            return this.CreateFunctionQuerySingle<global::System.Nullable<double>>("", "getNearestAirport", false);\n\
        }\n';

        TestEntityContainer(entityContainer, expected);

        entityContainer = {
            'entitysets': [],
            'singletons': [],
            'operations': [{
                'type': 'Function',
                'operationType': 'Unbound',
                'name': 'getNearestAirport',
                'returns': {
                    'type': 'edm.double',
                    'isCollection': false,
                    'isNullable': false,
                }
            }]
        };

        expected ='\
        /// <summary>\n\
        /// There are no comments for GetNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::Microsoft.OData.Client.DataServiceQuerySingle<double> GetNearestAirport()\n\
        {\n\
            return this.CreateFunctionQuerySingle<double>("", "getNearestAirport", false);\n\
        }\n';

        TestEntityContainer(entityContainer, expected);
    });

    it('Functions parameters should match.', function () {
        var entityContainer = {
            'entitysets': [],
            'singletons': [],
            'operations': [{
                'type': 'Function',
                'operationType': 'Unbound',
                'name': 'getNearestAirport',
                'params': [
                    {
                        'name': 'lat',
                        'type': 'trip',
                        'isNullable': false
                    },
                    {
                        'name': 'lon',
                        'type': 'edm.double',
                        'isCollection': false
                    }
                ],
                'returns': {
                    'type': 'edm.double'
                }
            }]
        };
        var expected ='\
        /// <summary>\n\
        /// There are no comments for GetNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::Microsoft.OData.Client.DataServiceQuerySingle<double> GetNearestAirport(global::{0}.Trip lat, double lon, bool useEntityReference = false)\n\
        {\n\
            return this.CreateFunctionQuerySingle<double>("", "getNearestAirport", false, new global::Microsoft.OData.Client.UriEntityOperationParameter("lat", lat, useEntityReference),\n\
                    new global::Microsoft.OData.Client.UriOperationParameter("lon", lon));\n\
        }\n'.format(languageDependentNamespace);
        TestEntityContainer(entityContainer, expected);


        entityContainer = {
            'entitysets': [],
            'singletons': [],
            'operations': [{
                'type': 'Function',
                'operationType': 'Unbound',
                'name': 'getNearestAirport',
                'params': [
                    {
                        'name': 'lat',
                        'type': 'trip',
                        'isCollection': true
                    },
                    {
                        'name': 'lon1',
                        'type': 'edm.double',
                        'isCollection': true
                    },
                    {
                        'name': 'lon2',
                        'type': 'edm.double',
                        'isNullable': true
                    }
                ],
                'returns': {
                    'type': 'edm.double'
                }
            }]
        };
        expected ='\
        /// <summary>\n\
        /// There are no comments for GetNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::Microsoft.OData.Client.DataServiceQuerySingle<double> GetNearestAirport(global::System.Collections.Generic.ICollection<global::{0}.Trip> lat, global::System.Collections.Generic.ICollection<double> lon1, global::System.Nullable<double> lon2, bool useEntityReference = false)\n\
        {\n\
            return this.CreateFunctionQuerySingle<double>("", "getNearestAirport", false, new global::Microsoft.OData.Client.UriEntityOperationParameter("lat", lat, useEntityReference),\n\
                    new global::Microsoft.OData.Client.UriOperationParameter("lon1", lon1),\n\
                    new global::Microsoft.OData.Client.UriOperationParameter("lon2", lon2));\n\
        }\n'.format(languageDependentNamespace);

        TestEntityContainer(entityContainer, expected);
    });

    it('Actions should match.', function () {
        var entityContainer = {
            'entitysets': [],
            'singletons': [],
            'operations': [{
                'type': 'Function',
                'operationType': 'Unbound',
                'name': 'getNearestAirport',
                'params': [
                    {
                        'name': 'lat',
                        'type': 'trip',
                        'isNullable': false
                    },
                    {
                        'name': 'lon',
                        'type': 'edm.double',
                        'isCollection': false
                    }
                ]
            }]
        };

        var expected ='\
        /// <summary>\n\
        /// There are no comments for GetNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::Microsoft.OData.Client.DataServiceActionQuery GetNearestAirport(global::{0}.Trip lat, double lon)\n\
        {\n\
            return new global::Microsoft.OData.Client.DataServiceActionQuery(this, this.BaseUri.OriginalString.Trim(\'/\') + "getNearestAirport", new global::Microsoft.OData.Client.BodyOperationParameter("lat", lat),\n\
                    new global::Microsoft.OData.Client.BodyOperationParameter("lon", lon));\n\
        }\n'.format(languageDependentNamespace);

        TestEntityContainer(entityContainer, expected);
    });

    function TestEntityContainer(input, expected)
    {
        var model = {
            'api': {
            'namespace': 'Microsoft.OData.SampleService.Models.TripPin'},
            'container': {},
            'types':[
            {
                'properties': [
                {
                    'name': 'icaoCode',
                    'type': 'edm.string',
                    'isKey': true
                },
                {
                    'name': 'name',
                    'type': 'edm.string'
                },
                {
                    'name': 'iataCode',
                    'type': 'edm.string'
                },
                {
                    'name': 'location',
                    'type': 'airportLocation'
                }],
                'name': 'airport'
            },
            {
              'properties': [
                {
                  'name': 'tripId',
                  'isKey': true,
                  'type': 'edm.string'
                },
                {
                  'name': 'name',
                  'type': 'edm.string'
                },
                {
                  'name': 'budget',
                  'type': 'edm.single'
                },
                {
                  'name': 'startsAt',
                  'type': 'edm.datetimeoffset'
                },
                {
                  'name': 'endsAt',
                  'type': 'edm.datetimeoffset'
                },
                {
                  'name': 'tags',
                  'type': 'edm.string',
                  'isCollection': true
                },
                {
                  'name': 'photos',
                  'type': 'photo',
                  'isCollection': true
                },
                {
                  'name': 'planItems',
                  'type': 'planItem',
                  'isCollection': true
                },
                {
                  'name': 'getInvolvedPeople',
                  'type': 'Function',
                  'eturns': 'person[]',
                  'operationType': 'Bound'
                }
              ],
              'name': 'trip'
            }]
        };

        model.container = input;
        var output ='\
    /// <summary>\n\
    /// There are no comments for {0} in the schema.\n\
    /// </summary>\n\
    [global::Microsoft.OData.Client.OriginalNameAttribute("{1}")]\n\
    public partial class {0} : global::Microsoft.OData.Client.DataServiceContext\n\
    {\n\
        /// <summary>\n\
        /// Initialize a new {0} object.\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData Client.Design.T4", "2.4.0")]\n\
        public {0}(global::System.Uri serviceRoot) : \n\
                base(serviceRoot, global::Microsoft.OData.Client.ODataProtocolVersion.V4)\n\
        {\n\
            this.ResolveName = new global::System.Func<global::System.Type, string>(this.ResolveNameFromType);\n\
            this.ResolveType = new global::System.Func<string, global::System.Type>(this.ResolveTypeFromName);\n\
            this.OnContextCreated();\n\
            this.Format.LoadServiceModel = GeneratedEdmModel.GetInstance;\n\
            this.Format.UseJson();\n\
        }\n\
        partial void OnContextCreated();\n\
        /// <summary>\n\
        /// Since the namespace configured for this service reference\n\
        /// in Visual Studio is different from the one indicated in the\n\
        /// server schema, use type-mappers to map between the two.\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData Client.Design.T4", "2.4.0")]\n\
        protected global::System.Type ResolveTypeFromName(string typeName)\n\
        {\n\
            global::System.Type resolvedType = this.DefaultResolveType(typeName, {2}, {3});\n\
            if ((resolvedType != null))\n\
            {\n\
                return resolvedType;\n\
            }\n\
            return null;\n\
        }\n\
        /// <summary>\n\
        /// Since the namespace configured for this service reference\n\
        /// in Visual Studio is different from the one indicated in the\n\
        /// server schema, use type-mappers to map between the two.\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        protected string ResolveNameFromType(global::System.Type clientType)\n\
        {\n\
            global::Microsoft.OData.Client.OriginalNameAttribute originalNameAttribute = (global::Microsoft.OData.Client.OriginalNameAttribute)global::System.Linq.Enumerable.SingleOrDefault(global::Microsoft.OData.Client.Utility.GetCustomAttributes(clientType, typeof(global::Microsoft.OData.Client.OriginalNameAttribute), true));\n\
            if (clientType.Namespace.Equals("{3}", global::System.StringComparison.Ordinal))\n\
            {\n\
                if (originalNameAttribute != null)\n\
                {\n\
                    return string.Concat("{2}.", originalNameAttribute.OriginalName);\n\
                }\n\
                return string.Concat("{2}.", clientType.Name);\n\
            }\n\
            if (originalNameAttribute != null)\n\
            {\n\
                return clientType.Namespace + "." + originalNameAttribute.OriginalName;\n\
            }\n\
            return clientType.FullName;\n\
        }\n\
{4}\
    }\n'.format(entityContainerGenerator.CustomizeNaming(EntityContainer), EntityContainer, 'Microsoft.OData.SampleService.Models.TripPin',
    entityContainerGenerator.CustomizeNaming(languageDependentNamespace), expected);

    var actual = entityContainerGenerator.generate(model, languageDependentNamespace);
    expect(actual).toEqual(output);
    }
});
