describe('[OData Service Server Codegen: CSharp] Test', function(){
	var util = require('util');
	var codegen = require('../../src/codegen/modules/csharpServerCodegen');
	var constants = require('../../src/codegen/config').Constants;
	var ns = constants.Code.ServerDefaultNamespace;
	var genComplexType;
	var genEntityType;
	var genEnumType;

	beforeEach(function(){
		genEntityType = codegen.genEntityType;
		genComplexType = codegen.genComplexType;
		genEnumType = codegen.genEnumType;
	});

	it('generation for enum type.', function(){
		var enumTypeObj = {
		    'name': 'personGender',
		    'members': [
		      {
		        'name': 'unknown',
		        'value': 0
		      },
		      {
		        'name': 'female',
		        'value': -1
		      },
		      {
		        'name': 'male',
		        'value': 2
		      }
		  ],
		  'flags': true,
		  'underlyingType': 'edm.int32'
		};

		var expected = util.format('\
namespace %s.Models\n\
{\n\
    [System.Flags]\n\
    public enum PersonGender: int\n\
    {\n\
        Unknown = 0,\n\
        Female = -1,\n\
        Male = 2,\n\
    }\n\
}\n', ns);
		var actual = genEnumType(enumTypeObj, ns).content;

		expect(actual).toEqual(expected);
	});

	it('generation for complex type.', function(){
		var complexTypeObj = {
			'properties': [
				{
			        'name': 'address',
			        'type': 'edm.string'
			    },
			    {
			        'name': 'city',
			        'type': 'city'
			    }
		    ],
		    'name': 'location'
		};

		var expected = util.format('\
namespace %s.Models\n\
{\n\
    [System.ComponentModel.DataAnnotations.Schema.ComplexType]\n\
    public class Location\n\
    {\n\
        public string Address { get; set; }\n\
        public OData.Service.V4.Server.Models.City City { get; set; }\n\
    }\n\
}\n', ns);
		var actual = genComplexType(complexTypeObj, ns).content;

		expect(actual).toEqual(expected);
	});

	it('generation for entity type.', function(){
		var types = [
		    {
		        'properties': [
		            {
		                'name': 'id',
		                'type': 'edm.int64',
		                'isKey': true
		            },
		            {
		                'name': 'name',
		                'isNullable': true,
		                'type': 'edm.string'
		            }
		        ],
		        'name': 'photo'
		    },
		    {
		        'properties': [
		            {
		                'name': 'userName',
		                'type': 'edm.string',
		                'isKey': true
		            },
		            {
		                'name': 'firstName',
		                'type': 'edm.string'
		            },
		            {
		                'name': 'lastName',
		                'type': 'edm.string'
		            },
		            {
		                'name': 'emails',
		                'type': 'edm.string',
		                'isCollection': true,
		                'isNullable': true
		            },
		            {
		                'name': 'gender',
		                'type': 'personGender',
		                'isNullable': true
		            },
		            {
		                'name': 'concurrency',
		                'type': 'edm.int64',
		                'isNullable': true
		            },
		            {
		                'name': 'photo',
		                'type': 'photo',
		                'isNullable': true
		            },
		        ],
		        'name': 'person'
		    }
		];
		var entityTypeObj = {
	        'properties': [
	            {
	                'name': 'userName',
	                'type': 'edm.string',
	                'isKey': true
	            },
	            {
	                'name': 'firstName',
	                'type': 'edm.string'
	            },
	            {
	                'name': 'lastName',
	                'type': 'edm.string'
	            },
	            {
	                'name': 'emails',
	                'type': 'edm.string',
	                'isCollection': true,
	                'isNullable': true
	            },
	            {
	                'name': 'gender',
	                'type': 'personGender',
	                'isNullable': true
	            },
	            {
	                'name': 'concurrency',
	                'type': 'edm.int64',
	                'isNullable': true
	            },
	            {
	                'name': 'photo',
	                'type': 'photo',
	                'isNullable': true
	            },
	        ],
	        'name': 'person'
		};

		var expected = util.format('\
namespace %s.Models\n\
{\n\
    public class Person\n\
    {\n\
        [System.ComponentModel.DataAnnotations.Key]\n\
        public string UserName { get; set; }\n\
        public string FirstName { get; set; }\n\
        public string LastName { get; set; }\n\
        public System.Collections.Generic.ICollection<string> Emails { get; set; }\n\
        public PersonGender Gender { get; set; }\n\
        public global::System.Nullable<long> Concurrency { get; set; }\n\
        public virtual %s.Models.Photo Photo { get; set; }\n\
    }\n\
}\n', ns, ns);
		var actual = genEntityType(entityTypeObj, types, ns).content;

		expect(actual).toEqual(expected);
	});

});