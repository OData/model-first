describe('[OData Service Client Codegen: CSharp] Test', function(){
	var codegen = require('../../src/codegen/modules/csharpClientCodegen');
	var genEnumType;

	beforeEach(function(){
		genEnumType = codegen.genEnumType;
	});

	fit('generation for enum type.', function(){
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
public enum PersonGender: global::System.Int32\n\
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
});