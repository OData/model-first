var config = require('../../src/codegen/config');

var EntityContainer = config.Constants.Code.EntityContainer;
var fullNamespace='Microsoft.OData.SampleService.Models.TripPin';

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

    fit('Entitysets should match.', function () {
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
        /// There are no comments for airports in the schema.\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("airports")]\n\
        public global::Microsoft.OData.Client.DataServiceQuery<airpo> airports\n\
        {\n\
            get\n\
            {\n\
                if ((this._airports == null))\n\
                {\n\
                    this._airports = base.CreateQuery<airpo>(airports);\n\
                }\n\
                return this._airports;\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        private global::Microsoft.OData.Client.DataServiceQuery<airpo> _airports;\n\
        /// <summary>\n\
        /// There are no comments for airports in the schema.\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        public void AddToairports(airpo airpo)\n\
        {\n\
            base.AddObject("airports", airpo);\n\
        }\n';
        TestEntityContainer(entityContainer, expected);
    });

    fit('Singletons should match.', function () {
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
        /// There are no comments for me in the schema.\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("me")]\n\
        public personSingle me\n\
        {\n\
            get\n\
            {\n\
                if ((this._me == null))\n\
                {\n\
                    this._me = new personSingle(this, "originalSingletonName");\n\
                }\n\
                return this._me;\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]\n\
        private personSingle _me;\n';
        TestEntityContainer(entityContainer, expected);
    });

    fit('Functions return values should match.', function () {
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
        /// There are no comments for getNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::Microsoft.OData.Client.DataServiceQuery<global::{0}.airport> getNearestAirport()\n\
        {\n\
            return this.CreateFunctionQuery<global::{0}.airport>("", "getNearestAirport", false);\n\
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
        /// There are no comments for getNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::Microsoft.OData.Client.DataServiceQuery<double> getNearestAirport()\n\
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
        /// There are no comments for getNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::{0}.airportSingle getNearestAirport()\n\
        {\n\
            return new global::{0}.airportSingle(this.CreateFunctionQuerySingle<global::{0}.airport>("", "getNearestAirport", false));\n\
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
        /// There are no comments for getNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::Microsoft.OData.Client.DataServiceQuerySingle<global::System.Nullable<double>> getNearestAirport()\n\
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
        /// There are no comments for getNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::Microsoft.OData.Client.DataServiceQuerySingle<double> getNearestAirport()\n\
        {\n\
            return this.CreateFunctionQuerySingle<double>("", "getNearestAirport", false);\n\
        }\n';

        TestEntityContainer(entityContainer, expected);
    });

    fit('Functions parameters should match.', function () {
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
        /// There are no comments for getNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::Microsoft.OData.Client.DataServiceQuerySingle<double> getNearestAirport(global::{0}.trip lat, double lon, bool useEntityReference = false)\n\
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
        /// There are no comments for getNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::Microsoft.OData.Client.DataServiceQuerySingle<double> getNearestAirport(global::System.Collections.Generic.ICollection<global::{0}.trip> lat, global::System.Collections.Generic.ICollection<double> lon1, global::System.Nullable<double> lon2, bool useEntityReference = false)\n\
        {\n\
            return this.CreateFunctionQuerySingle<double>("", "getNearestAirport", false, new global::Microsoft.OData.Client.UriEntityOperationParameter("lat", lat, useEntityReference),\n\
                    new global::Microsoft.OData.Client.UriOperationParameter("lon1", lon1),\n\
                    new global::Microsoft.OData.Client.UriOperationParameter("lon2", lon2));\n\
        }\n'.format(languageDependentNamespace);

        TestEntityContainer(entityContainer, expected);
    });

    fit('Actions should match.', function () {
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
        /// There are no comments for getNearestAirport in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("getNearestAirport")]\n\
        public global::Microsoft.OData.Client.DataServiceActionQuery getNearestAirport(global::{0}.trip lat, double lon)\n\
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
    [global::Microsoft.OData.Client.OriginalNameAttribute("{0}")]\n\
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
            global::System.Type resolvedType = this.DefaultResolveType(typeName, {1}, {2});\n\
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
            if (clientType.Namespace.Equals("{2}", global::System.StringComparison.Ordinal))\n\
            {\n\
                if (originalNameAttribute != null)\n\
                {\n\
                    return string.Concat("{1}.", originalNameAttribute.OriginalName);\n\
                }\n\
                return string.Concat("{1}.", clientType.Name);\n\
            }\n\
            if (originalNameAttribute != null)\n\
            {\n\
                return clientType.Namespace + "." + originalNameAttribute.OriginalName;\n\
            }\n\
            return clientType.FullName;\n\
        }\n\
{3}\
    }\n'.format(EntityContainer, fullNamespace, languageDependentNamespace, expected);

        console.log(entityContainerGenerator.generate);
        var actual = entityContainerGenerator.generate(model);
        expect(actual).toEqual(output);
    }
});
