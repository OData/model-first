describe('[OData Service Client Codegen: CSharp] Test', function(){
	var codegen = require('../../src/codegen/modules/csharpClientCodegen');
	var genEnumType;
	var genComplexType;

	beforeEach(function(){
		genEnumType = codegen.genEnumType;
		genComplexType = codegen.genComplexType;
	});

	it('generation for enum type.', function(){
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

		var expected = '\
    [global::Microsoft.OData.Client.OriginalNameAttribute("PersonGender")]\n\
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

	it('generation for complex type.', function(){
		var complexTypes = [
			{
				name: 'myComplexTypeRef',
				properties: [
					{
						name: 'city',
						type: 'edm.string'
					},
					{
						name: 'code',
						type: 'edm.int32'
					}
				]
			},
			{
				name: 'myComplexTypeAncestor',
				properties: [
					{
						name: 'id',
						type: 'edm.int32'
					},
				]
			},
			{
				name: 'myComplexTypeBase',
				baseType: 'myComplexTypeAncestor',
				properties: [
					{
						name: 'name',
						type: 'edm.string'
					},
					{
						name: 'age',
						type: 'edm.int32'
					},
					{
						name: 'location',
						type: 'myComplexTypeRef'
					}
				]
			},
			{
				name: 'myComplexTypeSuper',
				baseType: 'myComplexTypeBase',
				properties: [
					{
						name: 'employeeId',
						type: 'edm.int32'
					},
					{
						name: 'department',
						type: 'edm.string'
					}
				]
			}
		];

		var complexType = {
			name: 'myComplexTypeSuper',
			baseType: 'myComplexTypeBase',
			properties: [
				{
					name: 'employeeId',
					type: 'edm.int32'
				},
				{
					name: 'department',
					type: 'edm.string'
				}
			]
		};

		var ns = 'ModelFirst.CodeGen.Test';

		var expected = '\
    [global::Microsoft.OData.Client.OriginalNameAttribute("MyComplexTypeSuper")]\n\
    public partial class MyComplexTypeSuper: MyComplexTypeBase\n\
    {\n\
        public static MyComplexTypeSuper CreateMyComplexTypeSuper(global::System.Int32 id, global::System.String name, global::System.Int32 age, global::ModelFirst.CodeGen.Test.MyComplexTypeRef location, global::System.Int32 employeeId, global::System.String department)\n\
        {\n\
            MyComplexTypeSuper myComplexTypeSuper = new MyComplexTypeSuper();\n\
            myComplexTypeSuper.Id = id;\n\
            myComplexTypeSuper.Name = name;\n\
            myComplexTypeSuper.Age = age;\n\
            if(location == null)\n\
            {\n\
                throw new global::System.ArgumentNullException("location");\n\
            }\n\
            myComplexTypeSuper.Location = location;\n\
            myComplexTypeSuper.EmployeeId = employeeId;\n\
            myComplexTypeSuper.Department = department;\n\
\n\
            return myComplexTypeSuper;\n\
        }\n\
\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("EmployeeId")]\n\
        public global::System.Int32 EmployeeId\n\
        {\n\
            get\n\
            {\n\
                return this._EmployeeId;\n\
            }\n\
            set\n\
            {\n\
                this.OnEmployeeIdChanging(value);\n\
                this._EmployeeId = value;\n\
                this.OnEmployeeIdChanged();\n\
                this.OnPropertyChanged("EmployeeId");\n\
            }\n\
        }\n\
\n\
        private global::System.Int32 _EmployeeId;\n\
\n\
        partial void OnEmployeeIdChanging(global::System.Int32 value);\n\
\n\
        partial void OnEmployeeIdChanged();\n\
\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("Department")]\n\
        public global::System.String Department\n\
        {\n\
            get\n\
            {\n\
                return this._Department;\n\
            }\n\
            set\n\
            {\n\
                this.OnDepartmentChanging(value);\n\
                this._Department = value;\n\
                this.OnDepartmentChanged();\n\
                this.OnPropertyChanged("Department");\n\
            }\n\
        }\n\
\n\
        private global::System.String _Department;\n\
\n\
        partial void OnDepartmentChanging(global::System.String value);\n\
\n\
        partial void OnDepartmentChanged();\n\
\n\
        public event global::System.ComponentModel.PropertyChangedEventHandler PropertyChanged;\n\
\n\
        protected virtual void OnPropertyChanged(string property)\n\
        {\n\
            if (this.PropertyChanged != null)\n\
            {\n\
                this.PropertyChanged(this, new global::System.ComponentModel.PropertyChangedEventArgs(property));\n\
            }\n\
        }\n\
\n\
    }\n\
\n';

    var actual = genComplexType(complexType, complexTypes, ns);

    expect(actual).toEqual(expected);

	});
});