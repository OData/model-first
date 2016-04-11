describe('[OData Service Client Codegen: CSharp] Test', function(){
	var codegen = require('../../src/codegen/modules/csharpClientCodegen');
	var constants = require('../../src/codegen/config').Constants;
	var ns = '' + ns + '';
	var genEnumType;
	var genComplexType;
	var genExBoundOperations;

	beforeEach(function(){
		genEnumType = codegen.genEnumType;
		genComplexType = codegen.genComplexType;
		genExBoundOperations = codegen.genExBoundOperations;
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

		

		var expected = '\
    [global::Microsoft.OData.Client.OriginalNameAttribute("MyComplexTypeSuper")]\n\
    public partial class MyComplexTypeSuper: MyComplexTypeBase\n\
    {\n\
        public static MyComplexTypeSuper CreateMyComplexTypeSuper(global::System.Int32 id, global::System.String name, global::System.Int32 age, global::' + ns + '.MyComplexTypeRef location, global::System.Int32 employeeId, global::System.String department)\n\
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

	it('generation for extension bound functions with primitive type parameters and primitive type returns.', function(){
		var entityType = {
			name: 'person',
			properties: [
		    	{
		    		name: 'myFunction1',
		    		type: 'Function',
		    		operationType: 'Bound',
		    		params: [
		    			{
		    				name: 'tripId',
		    				type: 'edm.int32'
		    			}
		    		],
		    		returns: {
		    			type: 'edm.string'
		    		}
		    	}
		    ]
		};

		var expected = '\
        /// <summary>\n\
        /// There are no comments for MyFunction1 in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("MyFunction1")]\n\
        public static global::Microsoft.OData.Client.DataServiceQuerySingle<global::System.String> MyFunction1(this global::Microsoft.OData.Client.DataServiceQuerySingle<global::' + ns + '.Person> source, global::System.Int32 tripId)\n\
        {\n\
            if (!source.IsComposable)\n\
            {\n\
                throw new global::System.NotSupportedException("The previous function is not composable.");\n\
            }\n\
\n\
            return source.CreateFunctionQuerySingle<global::System.String>("' + constants.Code.DefaultNamespace + '.MyFunction1", true, new global::Microsoft.OData.Client.UriOperationParameter("tripId", tripId));\n\
        }\n\
\n';

        var actual = genExBoundOperations(entityType, ns);

		expect(actual).toEqual(expected);
	});

	it('generation for extension bound functions with collection of primitive type parameters and collection of primitive type returns', function(){
		var entityType = {
			name: 'person',
			properties: [
		    	{
		    		name: 'myFunction2',
		    		type: 'Function',
		    		operationType: 'Bound',
		    		params: [
		    			{
		    				name: 'tripIds',
		    				type: 'edm.int32',
		    				isCollection: true
		    			}
		    		],
		    		returns: {
		    			type: 'edm.string',
		    			isCollection: true
		    		}
		    	}
		    ]
		};

		var expected = '\
        /// <summary>\n\
        /// There are no comments for MyFunction2 in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("MyFunction2")]\n\
        public static global::Microsoft.OData.Client.DataServiceQuery<global::System.String> MyFunction2(this global::Microsoft.OData.Client.DataServiceQuerySingle<global::' + ns + '.Person> source, global::System.Collections.Generic.ICollection<global::System.Int32> tripIds)\n\
        {\n\
            if (!source.IsComposable)\n\
            {\n\
                throw new global::System.NotSupportedException("The previous function is not composable.");\n\
            }\n\
\n\
            return source.CreateFunctionQuery<global::System.String>("' + constants.Code.DefaultNamespace + '.MyFunction2", true, new global::Microsoft.OData.Client.UriOperationParameter("tripIds", tripIds));\n\
        }\n\
\n';
	
		var actual = genExBoundOperations(entityType, ns);
		expect(actual).toEqual(expected);
	});

	it('generation for extension bound functions with entity type parameters and entity type returns', function(){
		var entityType = {
			name: 'person',
			properties: [
		    	{
		    		name: 'myFunction3',
		    		type: 'Function',
		    		operationType: 'Bound',
		    		params: [
		    			{
		    				name: 'trip',
		    				type: 'trip'
		    			}
		    		],
		    		returns: {
		    			type: 'person'
		    		}
		    	}
		    ]
		}; 

		var expected = '\
        /// <summary>\n\
        /// There are no comments for MyFunction3 in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("MyFunction3")]\n\
        public static global::' + ns + '.PersonSingle MyFunction3(this global::Microsoft.OData.Client.DataServiceQuerySingle<global::' + ns + '.Person> source, global::' + ns + '.Trip trip, bool useEntityReference = false)\n\
        {\n\
            if (!source.IsComposable)\n\
            {\n\
                throw new global::System.NotSupportedException("The previous function is not composable.");\n\
            }\n\
\n\
            return new global::' + ns + '.PersonSingle(source.CreateFunctionQuerySingle<global::' + ns + '.Person>("' + constants.Code.DefaultNamespace + '.MyFunction3", true, new global::Microsoft.OData.Client.UriEntityOperationParameter("trip", trip, useEntityReference)));\n\
        }\n\
\n';

		var actual = genExBoundOperations(entityType, ns);
		expect(actual).toEqual(expected);
	});

	it('generation for extension bound functions with collection of entity type parameters and collection of entity type returns', function(){
		var entityType = {
			name: 'person',
			properties: [
		    	{
		    		name: 'myFunction4',
		    		type: 'Function',
		    		operationType: 'Bound',
		    		params: [
		    			{
		    				name: 'trips',
		    				type: 'trip',
		    				isCollection: true
		    			}
		    		],
		    		returns: {
		    			type: 'person',
		    			isCollection: true
		    		}
		    	}
		    ]
		}; 

		var expected = '\
        /// <summary>\n\
        /// There are no comments for MyFunction4 in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("MyFunction4")]\n\
        public static global::Microsoft.OData.Client.DataServiceQuery<global::' + ns + '.Person> MyFunction4(this global::Microsoft.OData.Client.DataServiceQuerySingle<global::' + ns + '.Person> source, global::System.Collections.Generic.ICollection<global::' + ns + '.Trip> trips, bool useEntityReference = true)\n\
        {\n\
            if (!source.IsComposable)\n\
            {\n\
                throw new global::System.NotSupportedException("The previous function is not composable.");\n\
            }\n\
\n\
            return source.CreateFunctionQuery<global::' + ns + '.Person>("' + constants.Code.DefaultNamespace + '.MyFunction4", true, new global::Microsoft.OData.Client.UriEntityOperationParameter("trips", trips, useEntityReference));\n\
        }\n\
\n';
		var actual = genExBoundOperations(entityType, ns);
		expect(actual).toEqual(expected);
	});

	it('generation for extension bound actions with primitive type parameters', function(){
		var entityType = {
			name: 'person',
			properties: [
		    	{
		    		name: 'myAction1',
		    		type: 'Action',
		    		operationType: 'Bound',
		    		params: [
		    			{
		    				name: 'tripId',
		    				type: 'edm.int32'
		    			}
		    		]
		    	}
		    ]
		}; 

		var expected = '\
        /// <summary>\n\
        /// There are no comments for MyAction1 in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("MyAction1")]\n\
        public static global::Microsoft.OData.Client.DataServiceActionQuery MyAction1(this global::Microsoft.OData.Client.DataServiceQuerySingle<global::' + ns + '.Person> source, global::System.Int32 tripId)\n\
        {\n\
            if (!source.IsComposable)\n\
            {\n\
                throw new global::System.NotSupportedException("The previous function is not composable.");\n\
            }\n\
\n\
            return new global::Microsoft.OData.Client.DataServiceActionQuery(\n\
                source.Context,\n\
                source.AppendRequestUri("' + constants.Code.DefaultNamespace + '.MyAction1"),\n\
                new global::Microsoft.OData.Client.BodyOperationParameter("tripId", tripId));\n\
        }\n\
\n';
		var actual = genExBoundOperations(entityType, ns);
		expect(actual).toEqual(expected);
	});

	it('generation for extension bound actions with collection of primitive type parameters', function(){
		var entityType = {
			name: 'person',
			properties: [
		    	{
		    		name: 'myAction2',
		    		type: 'Action',
		    		operationType: 'Bound',
		    		params: [
		    			{
		    				name: 'tripIds',
		    				type: 'edm.int32',
		    				isCollection: true
		    			}
		    		]
		    	}
		    ]
		}; 

		var expected = '\
        /// <summary>\n\
        /// There are no comments for MyAction2 in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("MyAction2")]\n\
        public static global::Microsoft.OData.Client.DataServiceActionQuery MyAction2(this global::Microsoft.OData.Client.DataServiceQuerySingle<global::' + ns + '.Person> source, global::System.Collections.Generic.ICollection<global::System.Int32> tripIds)\n\
        {\n\
            if (!source.IsComposable)\n\
            {\n\
                throw new global::System.NotSupportedException("The previous function is not composable.");\n\
            }\n\
\n\
            return new global::Microsoft.OData.Client.DataServiceActionQuery(\n\
                source.Context,\n\
                source.AppendRequestUri("' + constants.Code.DefaultNamespace + '.MyAction2"),\n\
                new global::Microsoft.OData.Client.BodyOperationParameter("tripIds", tripIds));\n\
        }\n\
\n';
		var actual = genExBoundOperations(entityType, ns);
		expect(actual).toEqual(expected);
	});

	it('generation for extension bound actions with entity type parameters', function(){
		var entityType = {
			name: 'person',
			properties: [
		    	{
		    		name: 'myAction3',
		    		type: 'Action',
		    		operationType: 'Bound',
		    		params: [
		    			{
		    				name: 'trip',
		    				type: 'trip'
		    			}
		    		]
		    	}
		    ]
		}; 

		var expected = '\
        /// <summary>\n\
        /// There are no comments for MyAction3 in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("MyAction3")]\n\
        public static global::Microsoft.OData.Client.DataServiceActionQuery MyAction3(this global::Microsoft.OData.Client.DataServiceQuerySingle<global::' + ns + '.Person> source, global::' + ns + '.Trip trip)\n\
        {\n\
            if (!source.IsComposable)\n\
            {\n\
                throw new global::System.NotSupportedException("The previous function is not composable.");\n\
            }\n\
\n\
            return new global::Microsoft.OData.Client.DataServiceActionQuery(\n\
                source.Context,\n\
                source.AppendRequestUri("' + constants.Code.DefaultNamespace + '.MyAction3"),\n\
                new global::Microsoft.OData.Client.BodyOperationParameter("trip", trip));\n\
        }\n\
\n';
	    var actual = genExBoundOperations(entityType, ns);
		expect(actual).toEqual(expected);
	});

	it('generation for extension bound actions with collection of entity type parameters', function(){
		var entityType = {
			name: 'person',
			properties: [
		    	{
		    		name: 'myAction4',
		    		type: 'Action',
		    		operationType: 'Bound',
		    		params: [
		    			{
		    				name: 'trips',
		    				type: 'trip',
		    				isCollection: true
		    			}
		    		]
		    	}
		    ]
		}; 
		var expected = '\
        /// <summary>\n\
        /// There are no comments for MyAction4 in the schema.\n\
        /// </summary>\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("MyAction4")]\n\
        public static global::Microsoft.OData.Client.DataServiceActionQuery MyAction4(this global::Microsoft.OData.Client.DataServiceQuerySingle<global::' + ns + '.Person> source, global::System.Collections.Generic.ICollection<global::' + ns + '.Trip> trips)\n\
        {\n\
            if (!source.IsComposable)\n\
            {\n\
                throw new global::System.NotSupportedException("The previous function is not composable.");\n\
            }\n\
\n\
            return new global::Microsoft.OData.Client.DataServiceActionQuery(\n\
                source.Context,\n\
                source.AppendRequestUri("' + constants.Code.DefaultNamespace + '.MyAction4"),\n\
                new global::Microsoft.OData.Client.BodyOperationParameter("trips", trips));\n\
        }\n\
\n';
		var actual = genExBoundOperations(entityType, ns);
		expect(actual).toEqual(expected);
	});
});