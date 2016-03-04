describe('[Client CodeGen] CSharp test', function () {
    var codegen = require('../../src/codegen/modules/csharpClientCodegen');
    var genEnumType;
	var genEntityType;
	var namespaceName = 'ODataV4Client.Proxies.TripPin';
	
    beforeEach(function () {
        genEnumType = codegen.genEnumType;
		genEntityType = codegen.genEntityType;
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
	
	    it('generation for Photo entity type.', function () {
        var entityTypeObj = {
        'types':[
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
        }
    ]};

        var expected ='\
    [global::Microsoft.OData.Client.Key("Id")]\n\
    [global::Microsoft.OData.Client.OriginalNameAttribute("Photo")]\n\
    public partial class Photo : global::Microsoft.OData.Client.BaseEntityType, global::System.ComponentModel.INotifyPropertyChanged\n\
    {\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        public static Photo CreatePhoto(long id)\n\
        {\n\
            Photo photo = new Photo();\n\
            photo.Id = id;\n\
            return photo;\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("Id")]\n\
        public long Id\n\
        {\n\
            get\n\
            {\n\
                return this._Id;\n\
            }\n\
            set\n\
            {\n\
                this.OnIdChanging(value);\n\
                this._Id = value;\n\
                this.OnIdChanged();\n\
                this.OnPropertyChanged("Id");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private long _Id;\n\
        partial void OnIdChanging(long value);\n\
        partial void OnIdChanged();\n\
        /// <summary>\n\
        /// This event is raised when the value of the property is changed\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        public event global::System.ComponentModel.PropertyChangedEventHandler PropertyChanged;\n\
        /// <summary>\n\
        /// The value of the property is changed\n\
        /// </summary>\n\
        /// <param name="property">property name</param>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        protected virtual void OnPropertyChanged(string property)\n\
        {\n\
            if ((this.PropertyChanged != null))\n\
            {\n\
                this.PropertyChanged(this, new global::System.ComponentModel.PropertyChangedEventArgs(property));\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("Name")]\n\
        public global::System.Nullable<string> Name\n\
        {\n\
            get\n\
            {\n\
                return this._Name;\n\
            }\n\
            set\n\
            {\n\
                this.OnNameChanging(value);\n\
                this._Name = value;\n\
                this.OnNameChanged();\n\
                this.OnPropertyChanged("Name");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::System.Nullable<string> _Name;\n\
        partial void OnNameChanging(global::System.Nullable<string> value);\n\
        partial void OnNameChanged();\n\
    }\n\
    [global::Microsoft.OData.Client.OriginalNameAttribute("PhotoSingle")]\n\
    public partial class PhotoSingle : global::Microsoft.OData.Client.DataServiceQuerySingle<Photo>\n\
    {\n\
        /// <summary>\n\
        /// Initialize a new PhotoSingle object.\n\
        /// </summary>\n\
        public PhotoSingle(global::Microsoft.OData.Client.DataServiceContext context, string path)\n\
            : base(context, path) {}\n\n\
        /// <summary>\n\
        /// Initialize a new PhotoSingle object.\n\
        /// </summary>\n\
        public PhotoSingle(global::Microsoft.OData.Client.DataServiceContext context, string path, bool isComposable)\n\
            : base(context, path, isComposable) {}\n\
    }\n';
        var actual = genEntityType(entityTypeObj.types[0], entityTypeObj.types);

        expect(actual).toEqual(expected);
    });
	
	it('generation for Person entity type.', function () {
		
        var Obj = 
{'types': [
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
          'name': 'addressInfo',
          'type': 'location',
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
          'isNullable': false
        },
        {
          'name': 'friends',
          'type': 'person',
          'isCollection': true,
          'isNullable': true
        },
        {
          'name': 'trips',
          'type': 'trip',
          'isCollection': true,
          'isNullable': true
        },
        {
          'name': 'photo',
          'type': 'photo',
          'isNullable': true
        },
        {
          'name': 'getFavoriteAirline',
          'type': 'Function',
          'returns': 'airline',
          'operationType': 'Bound'
        },
        {
          'name': 'getFriendsTrips',
          'type': 'Function',
          'params': [
            {
              'name': 'userName',
              'type': 'edm.string'
            }
          ],
          'returns': 'trip[]',
          'operationType': 'Bound'
        },
        {
          'name': 'shareTrip',
          'type': 'Action',
          'params': [
            {
              'name': 'sharedTo',
              'type': 'edm.string'
            },
            {
              'name': 'tripId',
              'type': 'edm.int32'
            }
          ],
          'operationType': 'Bound'
        }
      ],
      'name': 'person'
	},
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
          'name': 'tripId',
          'isKey': true,
          'type': 'edm.string'
        },
      ],
      'name': 'trip'
    }
	]
};

        var expected ='\
    [global::Microsoft.OData.Client.Key("UserName")]\n\
    [global::Microsoft.OData.Client.OriginalNameAttribute("Person")]\n\
    public partial class Person : global::Microsoft.OData.Client.BaseEntityType, global::System.ComponentModel.INotifyPropertyChanged\n\
    {\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        public static Person CreatePerson(string userName, string firstName, string lastName, long concurrency)\n\
        {\n\
            Person person = new Person();\n\
            person.UserName = userName;\n\
            person.FirstName = firstName;\n\
            person.LastName = lastName;\n\
            person.Concurrency = concurrency;\n\
            return person;\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("UserName")]\n\
        public string UserName\n\
        {\n\
            get\n\
            {\n\
                return this._UserName;\n\
            }\n\
            set\n\
            {\n\
                this.OnUserNameChanging(value);\n\
                this._UserName = value;\n\
                this.OnUserNameChanged();\n\
                this.OnPropertyChanged("UserName");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private string _UserName;\n\
        partial void OnUserNameChanging(string value);\n\
        partial void OnUserNameChanged();\n\
        /// <summary>\n\
        /// This event is raised when the value of the property is changed\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        public event global::System.ComponentModel.PropertyChangedEventHandler PropertyChanged;\n\
        /// <summary>\n\
        /// The value of the property is changed\n\
        /// </summary>\n\
        /// <param name="property">property name</param>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        protected virtual void OnPropertyChanged(string property)\n\
        {\n\
            if ((this.PropertyChanged != null))\n\
            {\n\
                this.PropertyChanged(this, new global::System.ComponentModel.PropertyChangedEventArgs(property));\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("FirstName")]\n\
        public string FirstName\n\
        {\n\
            get\n\
            {\n\
                return this._FirstName;\n\
            }\n\
            set\n\
            {\n\
                this.OnFirstNameChanging(value);\n\
                this._FirstName = value;\n\
                this.OnFirstNameChanged();\n\
                this.OnPropertyChanged("FirstName");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private string _FirstName;\n\
        partial void OnFirstNameChanging(string value);\n\
        partial void OnFirstNameChanged();\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("LastName")]\n\
        public string LastName\n\
        {\n\
            get\n\
            {\n\
                return this._LastName;\n\
            }\n\
            set\n\
            {\n\
                this.OnLastNameChanging(value);\n\
                this._LastName = value;\n\
                this.OnLastNameChanged();\n\
                this.OnPropertyChanged("LastName");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private string _LastName;\n\
        partial void OnLastNameChanging(string value);\n\
        partial void OnLastNameChanged();\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("Emails")]\n\
        public global::System.Collections.ObjectModel.ObservableCollection<string> Emails\n\
        {\n\
            get\n\
            {\n\
                return this._Emails;\n\
            }\n\
            set\n\
            {\n\
                this.OnEmailsChanging(value);\n\
                this._Emails = value;\n\
                this.OnEmailsChanged();\n\
                this.OnPropertyChanged("Emails");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::System.Collections.ObjectModel.ObservableCollection<string> _Emails = new global::System.Collections.ObjectModel.ObservableCollection<string>();\n\
        partial void OnEmailsChanging(global::System.Collections.ObjectModel.ObservableCollection<string> value);\n\
        partial void OnEmailsChanged();\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("AddressInfo")]\n\
        public global::System.Collections.ObjectModel.ObservableCollection<global::ODataV4Client.Proxies.TripPin.Location> AddressInfo\n\
        {\n\
            get\n\
            {\n\
                return this._AddressInfo;\n\
            }\n\
            set\n\
            {\n\
                this.OnAddressInfoChanging(value);\n\
                this._AddressInfo = value;\n\
                this.OnAddressInfoChanged();\n\
                this.OnPropertyChanged("AddressInfo");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::System.Collections.ObjectModel.ObservableCollection<global::ODataV4Client.Proxies.TripPin.Location> _AddressInfo = new global::System.Collections.ObjectModel.ObservableCollection<global::ODataV4Client.Proxies.TripPin.Location>();\n\
        partial void OnAddressInfoChanging(global::System.Collections.ObjectModel.ObservableCollection<global::ODataV4Client.Proxies.TripPin.Location> value);\n\
        partial void OnAddressInfoChanged();\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("Gender")]\n\
        public global::System.Nullable<global::ODataV4Client.Proxies.TripPin.PersonGender> Gender\n\
        {\n\
            get\n\
            {\n\
                return this._Gender;\n\
            }\n\
            set\n\
            {\n\
                this.OnGenderChanging(value);\n\
                this._Gender = value;\n\
                this.OnGenderChanged();\n\
                this.OnPropertyChanged("Gender");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::System.Nullable<global::ODataV4Client.Proxies.TripPin.PersonGender> _Gender;\n\
        partial void OnGenderChanging(global::System.Nullable<global::ODataV4Client.Proxies.TripPin.PersonGender> value);\n\
        partial void OnGenderChanged();\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("Concurrency")]\n\
        public long Concurrency\n\
        {\n\
            get\n\
            {\n\
                return this._Concurrency;\n\
            }\n\
            set\n\
            {\n\
                this.OnConcurrencyChanging(value);\n\
                this._Concurrency = value;\n\
                this.OnConcurrencyChanged();\n\
                this.OnPropertyChanged("Concurrency");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private long _Concurrency;\n\
        partial void OnConcurrencyChanging(long value);\n\
        partial void OnConcurrencyChanged();\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("Friends")]\n\
        public global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Person> Friends\n\
        {\n\
            get\n\
            {\n\
                return this._Friends;\n\
            }\n\
            set\n\
            {\n\
                this.OnFriendsChanging(value);\n\
                this._Friends = value;\n\
                this.OnFriendsChanged();\n\
                this.OnPropertyChanged("Friends");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Person> _Friends = new global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Person>(null, global::Microsoft.OData.Client.TrackingMode.None);\n\
        partial void OnFriendsChanging(global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Person> value);\n\
        partial void OnFriendsChanged();\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("Trips")]\n\
        public global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Trip> Trips\n\
        {\n\
            get\n\
            {\n\
                return this._Trips;\n\
            }\n\
            set\n\
            {\n\
                this.OnTripsChanging(value);\n\
                this._Trips = value;\n\
                this.OnTripsChanged();\n\
                this.OnPropertyChanged("Trips");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Trip> _Trips = new global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Trip>(null, global::Microsoft.OData.Client.TrackingMode.None);\n\
        partial void OnTripsChanging(global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Trip> value);\n\
        partial void OnTripsChanged();\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("Photo")]\n\
        public global::System.Nullable<global::ODataV4Client.Proxies.TripPin.Photo> Photo\n\
        {\n\
            get\n\
            {\n\
                return this._Photo;\n\
            }\n\
            set\n\
            {\n\
                this.OnPhotoChanging(value);\n\
                this._Photo = value;\n\
                this.OnPhotoChanged();\n\
                this.OnPropertyChanged("Photo");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::System.Nullable<global::ODataV4Client.Proxies.TripPin.Photo> _Photo;\n\
        partial void OnPhotoChanging(global::System.Nullable<global::ODataV4Client.Proxies.TripPin.Photo> value);\n\
        partial void OnPhotoChanged();\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("GetFavoriteAirline")]\n\
        public global::ODataV4Client.Proxies.TripPin.AirlineSingle GetFavoriteAirline()\n\
        {\n\
            string parameterString = global::Microsoft.OData.Client.Serializer.GetParameterString(this.Context);\n\
            global::System.Uri requestUri;\n\
            Context.TryGetUri(this, out requestUri);\n\
            return new global::ODataV4Client.Proxies.TripPin.AirlineSingle(this.Context, string.Join("/", global::System.Linq.Enumerable.Select(global::System.Linq.Enumerable.Skip(requestUri.Segments, this.Context.BaseUri.Segments.Length), s => s.Trim(\'/\'))) + "/Microsoft.OData.SampleService.Models.TripPin.GetFavoriteAirline" + parameterString, true);\n\
        }\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("GetFriendsTrips")]\n\
        public global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.Trip> GetFriendsTrips(string userName)\n\
        {\n\
            string parameterString = global::Microsoft.OData.Client.Serializer.GetParameterString(this.Context, new global::Microsoft.OData.Client.UriOperationParameter("userName", userName));\n\
            global::System.Uri requestUri;\n\
            Context.TryGetUri(this, out requestUri);\n\
            return this.Context.CreateQuery<global::ODataV4Client.Proxies.TripPin.Trip>(string.Join("/", global::System.Linq.Enumerable.Select(global::System.Linq.Enumerable.Skip(requestUri.Segments, this.Context.BaseUri.Segments.Length), s => s.Trim(\'/\'))) + "/Microsoft.OData.SampleService.Models.TripPin.GetFriendsTrips" + parameterString, true);\n\
        }\n\
        public global::Microsoft.OData.Client.DataServiceActionQuery ShareTrip(string sharedTo, int tripId)\n\
        {\n\
            global::Microsoft.OData.Client.EntityDescriptor resource = Context.EntityTracker.TryGetEntityDescriptor(this);\n\
            if (resource == null)\n\
            {\n\
                throw new global::System.Exception("cannot find entity");\n\
            }\n\n\
            return new global::Microsoft.OData.Client.DataServiceActionQuery(this.Context, resource.EditLink.OriginalString.Trim(\'/\') + "/Microsoft.OData.SampleService.Models.TripPin.ShareTrip", new global::Microsoft.OData.Client.BodyOperationParameter("sharedTo", sharedTo), new global::Microsoft.OData.Client.BodyOperationParameter("tripId", tripId));\n\
        }\n\
    }\n\
    [global::Microsoft.OData.Client.OriginalNameAttribute("PersonSingle")]\n\
    public partial class PersonSingle : global::Microsoft.OData.Client.DataServiceQuerySingle<Person>\n\
    {\n\
        /// <summary>\n\
        /// Initialize a new PersonSingle object.\n\
        /// </summary>\n\
        public PersonSingle(global::Microsoft.OData.Client.DataServiceContext context, string path)\n\
            : base(context, path) {}\n\n\
        /// <summary>\n\
        /// Initialize a new PersonSingle object.\n\
        /// </summary>\n\
        public PersonSingle(global::Microsoft.OData.Client.DataServiceContext context, string path, bool isComposable)\n\
            : base(context, path, isComposable) {}\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        public global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.Person> Friends\n\
        {\n\
            get\n\
            {\n\
                if (!this.IsComposable)\n\
                {\n\
                    throw new global::System.NotSupportedException("The previous function is not composable.");\n\
                }\n\
                if ((this._Friends == null))\n\
                {\n\
                    this._Friends = Context.CreateQuery<global::ODataV4Client.Proxies.TripPin.Person>(GetPath("Friends"));\n\
                }\n\
                return this._Friends;\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.Person> _Friends;\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        public global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.Trip> Trips\n\
        {\n\
            get\n\
            {\n\
                if (!this.IsComposable)\n\
                {\n\
                    throw new global::System.NotSupportedException("The previous function is not composable.");\n\
                }\n\
                if ((this._Trips == null))\n\
                {\n\
                    this._Trips = Context.CreateQuery<global::ODataV4Client.Proxies.TripPin.Trip>(GetPath("Trips"));\n\
                }\n\
                return this._Trips;\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.Trip> _Trips;\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        public global::ODataV4Client.Proxies.TripPin.PhotoSingle Photo\n\
        {\n\
            get\n\
            {\n\
                if (!this.IsComposable)\n\
                {\n\
                    throw new global::System.NotSupportedException("The previous function is not composable.");\n\
                }\n\
                if ((this._Photo == null))\n\
                {\n\
                    this._Photo = new global::ODataV4Client.Proxies.TripPin.PhotoSingle(this.Context, GetPath("Photo"));\n\
                }\n\
                return this._Photo;\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::ODataV4Client.Proxies.TripPin.PhotoSingle _Photo;\n\
    }\n';
        var actual = genEntityType(Obj.types[0], Obj.types, namespaceName);

        expect(actual).toEqual(expected);
    });
	
	it('generation for base type PlanItem entity type and its inheritances.', function () {
    var entityTypeObj = {
        'types':[
        {
          'properties': [
            {
              'name': 'planItemId',
              'isKey': true,
              'type': 'edm.int32'
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
              'isNullable': false
            }
          ],
          'name': 'event',
          'baseType': 'planItem'
        },
        {
          'properties': [
            {
              'name': 'airlineCode',
              'type': 'edm.string',
              'isKey': true
            }
          ],
          'name': 'airline'
        },
        {
          'properties': [
            {
              'name': 'icaoCode',
              'type': 'edm.string',
              'isKey': true
            }
          ],
          'name': 'airport'
        }
    ]};
    
	        var expected ='\
    [global::Microsoft.OData.Client.Key("PlanItemId")]\n\
    [global::Microsoft.OData.Client.OriginalNameAttribute("PlanItem")]\n\
    public partial class PlanItem : global::Microsoft.OData.Client.BaseEntityType, global::System.ComponentModel.INotifyPropertyChanged\n\
    {\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        public static PlanItem CreatePlanItem(int planItemId)\n\
        {\n\
            PlanItem planItem = new PlanItem();\n\
            planItem.PlanItemId = planItemId;\n\
            return planItem;\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("PlanItemId")]\n\
        public int PlanItemId\n\
        {\n\
            get\n\
            {\n\
                return this._PlanItemId;\n\
            }\n\
            set\n\
            {\n\
                this.OnPlanItemIdChanging(value);\n\
                this._PlanItemId = value;\n\
                this.OnPlanItemIdChanged();\n\
                this.OnPropertyChanged("PlanItemId");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private int _PlanItemId;\n\
        partial void OnPlanItemIdChanging(int value);\n\
        partial void OnPlanItemIdChanged();\n\
        /// <summary>\n\
        /// This event is raised when the value of the property is changed\n\
        /// </summary>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        public event global::System.ComponentModel.PropertyChangedEventHandler PropertyChanged;\n\
        /// <summary>\n\
        /// The value of the property is changed\n\
        /// </summary>\n\
        /// <param name="property">property name</param>\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        protected virtual void OnPropertyChanged(string property)\n\
        {\n\
            if ((this.PropertyChanged != null))\n\
            {\n\
                this.PropertyChanged(this, new global::System.ComponentModel.PropertyChangedEventArgs(property));\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("ConfirmationCode")]\n\
        public global::System.Nullable<string> ConfirmationCode\n\
        {\n\
            get\n\
            {\n\
                return this._ConfirmationCode;\n\
            }\n\
            set\n\
            {\n\
                this.OnConfirmationCodeChanging(value);\n\
                this._ConfirmationCode = value;\n\
                this.OnConfirmationCodeChanged();\n\
                this.OnPropertyChanged("ConfirmationCode");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::System.Nullable<string> _ConfirmationCode;\n\
        partial void OnConfirmationCodeChanging(global::System.Nullable<string> value);\n\
        partial void OnConfirmationCodeChanged();\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("StartsAt")]\n\
        public global::System.Nullable<global::System.DateTimeOffset> StartsAt\n\
        {\n\
            get\n\
            {\n\
                return this._StartsAt;\n\
            }\n\
            set\n\
            {\n\
                this.OnStartsAtChanging(value);\n\
                this._StartsAt = value;\n\
                this.OnStartsAtChanged();\n\
                this.OnPropertyChanged("StartsAt");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::System.Nullable<global::System.DateTimeOffset> _StartsAt;\n\
        partial void OnStartsAtChanging(global::System.Nullable<global::System.DateTimeOffset> value);\n\
        partial void OnStartsAtChanged();\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("EndsAt")]\n\
        public global::System.Nullable<global::System.DateTimeOffset> EndsAt\n\
        {\n\
            get\n\
            {\n\
                return this._EndsAt;\n\
            }\n\
            set\n\
            {\n\
                this.OnEndsAtChanging(value);\n\
                this._EndsAt = value;\n\
                this.OnEndsAtChanged();\n\
                this.OnPropertyChanged("EndsAt");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::System.Nullable<global::System.DateTimeOffset> _EndsAt;\n\
        partial void OnEndsAtChanging(global::System.Nullable<global::System.DateTimeOffset> value);\n\
        partial void OnEndsAtChanged();\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("Duration")]\n\
        public global::System.Nullable<global::System.TimeSpan> Duration\n\
        {\n\
            get\n\
            {\n\
                return this._Duration;\n\
            }\n\
            set\n\
            {\n\
                this.OnDurationChanging(value);\n\
                this._Duration = value;\n\
                this.OnDurationChanged();\n\
                this.OnPropertyChanged("Duration");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::System.Nullable<global::System.TimeSpan> _Duration;\n\
        partial void OnDurationChanging(global::System.Nullable<global::System.TimeSpan> value);\n\
        partial void OnDurationChanged();\n\
    }\n\
    [global::Microsoft.OData.Client.OriginalNameAttribute("PlanItemSingle")]\n\
    public partial class PlanItemSingle : global::Microsoft.OData.Client.DataServiceQuerySingle<PlanItem>\n\
    {\n\
        /// <summary>\n\
        /// Initialize a new PlanItemSingle object.\n\
        /// </summary>\n\
        public PlanItemSingle(global::Microsoft.OData.Client.DataServiceContext context, string path)\n\
            : base(context, path) {}\n\n\
        /// <summary>\n\
        /// Initialize a new PlanItemSingle object.\n\
        /// </summary>\n\
        public PlanItemSingle(global::Microsoft.OData.Client.DataServiceContext context, string path, bool isComposable)\n\
            : base(context, path, isComposable) {}\n\
    }\n\
    [global::Microsoft.OData.Client.Key("PlanItemId")]\n\
    [global::Microsoft.OData.Client.OriginalNameAttribute("PublicTransportation")]\n\
    public partial class PublicTransportation : PlanItem\n\
    {\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        public static PublicTransportation CreatePublicTransportation(int planItemId)\n\
        {\n\
            PublicTransportation publicTransportation = new PublicTransportation();\n\
            publicTransportation.PlanItemId = planItemId;\n\
            return publicTransportation;\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("SeatNumber")]\n\
        public global::System.Nullable<string> SeatNumber\n\
        {\n\
            get\n\
            {\n\
                return this._SeatNumber;\n\
            }\n\
            set\n\
            {\n\
                this.OnSeatNumberChanging(value);\n\
                this._SeatNumber = value;\n\
                this.OnSeatNumberChanged();\n\
                this.OnPropertyChanged("SeatNumber");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::System.Nullable<string> _SeatNumber;\n\
        partial void OnSeatNumberChanging(global::System.Nullable<string> value);\n\
        partial void OnSeatNumberChanged();\n\
    }\n\
    [global::Microsoft.OData.Client.OriginalNameAttribute("PublicTransportationSingle")]\n\
    public partial class PublicTransportationSingle : global::Microsoft.OData.Client.DataServiceQuerySingle<PublicTransportation>\n\
    {\n\
        /// <summary>\n\
        /// Initialize a new PublicTransportationSingle object.\n\
        /// </summary>\n\
        public PublicTransportationSingle(global::Microsoft.OData.Client.DataServiceContext context, string path)\n\
            : base(context, path) {}\n\n\
        /// <summary>\n\
        /// Initialize a new PublicTransportationSingle object.\n\
        /// </summary>\n\
        public PublicTransportationSingle(global::Microsoft.OData.Client.DataServiceContext context, string path, bool isComposable)\n\
            : base(context, path, isComposable) {}\n\
    }\n\
    [global::Microsoft.OData.Client.Key("PlanItemId")]\n\
    [global::Microsoft.OData.Client.OriginalNameAttribute("Flight")]\n\
    public partial class Flight : PublicTransportation\n\
    {\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        public static Flight CreateFlight(int planItemId, string flightNumber)\n\
        {\n\
            Flight flight = new Flight();\n\
            flight.PlanItemId = planItemId;\n\
            flight.FlightNumber = flightNumber;\n\
            return flight;\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("FlightNumber")]\n\
        public string FlightNumber\n\
        {\n\
            get\n\
            {\n\
                return this._FlightNumber;\n\
            }\n\
            set\n\
            {\n\
                this.OnFlightNumberChanging(value);\n\
                this._FlightNumber = value;\n\
                this.OnFlightNumberChanged();\n\
                this.OnPropertyChanged("FlightNumber");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private string _FlightNumber;\n\
        partial void OnFlightNumberChanging(string value);\n\
        partial void OnFlightNumberChanged();\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("From")]\n\
        public global::System.Nullable<global::ODataV4Client.Proxies.TripPin.Airport> From\n\
        {\n\
            get\n\
            {\n\
                return this._From;\n\
            }\n\
            set\n\
            {\n\
                this.OnFromChanging(value);\n\
                this._From = value;\n\
                this.OnFromChanged();\n\
                this.OnPropertyChanged("From");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::System.Nullable<global::ODataV4Client.Proxies.TripPin.Airport> _From;\n\
        partial void OnFromChanging(global::System.Nullable<global::ODataV4Client.Proxies.TripPin.Airport> value);\n\
        partial void OnFromChanged();\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("To")]\n\
        public global::System.Nullable<global::ODataV4Client.Proxies.TripPin.Airport> To\n\
        {\n\
            get\n\
            {\n\
                return this._To;\n\
            }\n\
            set\n\
            {\n\
                this.OnToChanging(value);\n\
                this._To = value;\n\
                this.OnToChanged();\n\
                this.OnPropertyChanged("To");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::System.Nullable<global::ODataV4Client.Proxies.TripPin.Airport> _To;\n\
        partial void OnToChanging(global::System.Nullable<global::ODataV4Client.Proxies.TripPin.Airport> value);\n\
        partial void OnToChanged();\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("Airline")]\n\
        public global::System.Nullable<global::ODataV4Client.Proxies.TripPin.Airline> Airline\n\
        {\n\
            get\n\
            {\n\
                return this._Airline;\n\
            }\n\
            set\n\
            {\n\
                this.OnAirlineChanging(value);\n\
                this._Airline = value;\n\
                this.OnAirlineChanged();\n\
                this.OnPropertyChanged("Airline");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::System.Nullable<global::ODataV4Client.Proxies.TripPin.Airline> _Airline;\n\
        partial void OnAirlineChanging(global::System.Nullable<global::ODataV4Client.Proxies.TripPin.Airline> value);\n\
        partial void OnAirlineChanged();\n\
    }\n\
    [global::Microsoft.OData.Client.OriginalNameAttribute("FlightSingle")]\n\
    public partial class FlightSingle : global::Microsoft.OData.Client.DataServiceQuerySingle<Flight>\n\
    {\n\
        /// <summary>\n\
        /// Initialize a new FlightSingle object.\n\
        /// </summary>\n\
        public FlightSingle(global::Microsoft.OData.Client.DataServiceContext context, string path)\n\
            : base(context, path) {}\n\n\
        /// <summary>\n\
        /// Initialize a new FlightSingle object.\n\
        /// </summary>\n\
        public FlightSingle(global::Microsoft.OData.Client.DataServiceContext context, string path, bool isComposable)\n\
            : base(context, path, isComposable) {}\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        public global::ODataV4Client.Proxies.TripPin.AirportSingle From\n\
        {\n\
            get\n\
            {\n\
                if (!this.IsComposable)\n\
                {\n\
                    throw new global::System.NotSupportedException("The previous function is not composable.");\n\
                }\n\
                if ((this._From == null))\n\
                {\n\
                    this._From = new global::ODataV4Client.Proxies.TripPin.AirportSingle(this.Context, GetPath("From"));\n\
                }\n\
                return this._From;\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::ODataV4Client.Proxies.TripPin.AirportSingle _From;\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        public global::ODataV4Client.Proxies.TripPin.AirportSingle To\n\
        {\n\
            get\n\
            {\n\
                if (!this.IsComposable)\n\
                {\n\
                    throw new global::System.NotSupportedException("The previous function is not composable.");\n\
                }\n\
                if ((this._To == null))\n\
                {\n\
                    this._To = new global::ODataV4Client.Proxies.TripPin.AirportSingle(this.Context, GetPath("To"));\n\
                }\n\
                return this._To;\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::ODataV4Client.Proxies.TripPin.AirportSingle _To;\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        public global::ODataV4Client.Proxies.TripPin.AirlineSingle Airline\n\
        {\n\
            get\n\
            {\n\
                if (!this.IsComposable)\n\
                {\n\
                    throw new global::System.NotSupportedException("The previous function is not composable.");\n\
                }\n\
                if ((this._Airline == null))\n\
                {\n\
                    this._Airline = new global::ODataV4Client.Proxies.TripPin.AirlineSingle(this.Context, GetPath("Airline"));\n\
                }\n\
                return this._Airline;\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::ODataV4Client.Proxies.TripPin.AirlineSingle _Airline;\n\
    }\n\
    [global::Microsoft.OData.Client.Key("PlanItemId")]\n\
    [global::Microsoft.OData.Client.OriginalNameAttribute("Event")]\n\
    public partial class Event : PlanItem\n\
    {\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        public static Event CreateEvent(int planItemId, global::ODataV4Client.Proxies.TripPin.EventLocation occursAt)\n\
        {\n\
            Event @event = new Event();\n\
            @event.PlanItemId = planItemId;\n\
            if ((occursAt == null))\n\
            {\n\
                throw new global::System.ArgumentNullException("occursAt");\n\
            }\n\
            @event.OccursAt = occursAt;\n\
            return @event;\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("Description")]\n\
        public global::System.Nullable<string> Description\n\
        {\n\
            get\n\
            {\n\
                return this._Description;\n\
            }\n\
            set\n\
            {\n\
                this.OnDescriptionChanging(value);\n\
                this._Description = value;\n\
                this.OnDescriptionChanged();\n\
                this.OnPropertyChanged("Description");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::System.Nullable<string> _Description;\n\
        partial void OnDescriptionChanging(global::System.Nullable<string> value);\n\
        partial void OnDescriptionChanged();\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        [global::Microsoft.OData.Client.OriginalNameAttribute("OccursAt")]\n\
        public global::ODataV4Client.Proxies.TripPin.EventLocation OccursAt\n\
        {\n\
            get\n\
            {\n\
                return this._OccursAt;\n\
            }\n\
            set\n\
            {\n\
                this.OnOccursAtChanging(value);\n\
                this._OccursAt = value;\n\
                this.OnOccursAtChanged();\n\
                this.OnPropertyChanged("OccursAt");\n\
            }\n\
        }\n\
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]\n\
        private global::ODataV4Client.Proxies.TripPin.EventLocation _OccursAt;\n\
        partial void OnOccursAtChanging(global::ODataV4Client.Proxies.TripPin.EventLocation value);\n\
        partial void OnOccursAtChanged();\n\
    }\n\
    [global::Microsoft.OData.Client.OriginalNameAttribute("EventSingle")]\n\
    public partial class EventSingle : global::Microsoft.OData.Client.DataServiceQuerySingle<Event>\n\
    {\n\
        /// <summary>\n\
        /// Initialize a new EventSingle object.\n\
        /// </summary>\n\
        public EventSingle(global::Microsoft.OData.Client.DataServiceContext context, string path)\n\
            : base(context, path) {}\n\n\
        /// <summary>\n\
        /// Initialize a new EventSingle object.\n\
        /// </summary>\n\
        public EventSingle(global::Microsoft.OData.Client.DataServiceContext context, string path, bool isComposable)\n\
            : base(context, path, isComposable) {}\n\
    }\n';
        var actual = genEntityType(entityTypeObj.types[0], entityTypeObj.types, namespaceName);
        actual += genEntityType(entityTypeObj.types[1], entityTypeObj.types, namespaceName);
        actual += genEntityType(entityTypeObj.types[2], entityTypeObj.types, namespaceName);
        actual += genEntityType(entityTypeObj.types[3], entityTypeObj.types, namespaceName);
        
        expect(actual).toEqual(expected);
    });
});