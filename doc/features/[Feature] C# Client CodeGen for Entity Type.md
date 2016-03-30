#C# Client CodeGen for Entity Type - Model-first Tooling

##Summary
The C# client code Generation from JSON model of Model-first Tooling conforms to the Microsoft implementation of the [ODATA CSDL document](http://docs.oasis-open.org/odata/odata/v4.0/errata02/os/complete/part3-csdl/odata-v4.0-errata02-os-part3-csdl-complete.html) -- MAY requirements are not implemented.

Use 3 examples to show the 3 special aspects of the code generation design: 
    1) Entity Type and Entity Single Type; 
    2) Entity Function and Action, and Navigation Property; 
    3) Entity Type Enheritance with Base Type Property.

Each example will show JSON Model code and the corresponding C# code.

###1.	Entity Type and Entity Single Type

Each entity type in JSON model will be converted into one Entity type and one Entity Single Type in C# client code.

Here is a Photo Entity type sample in core JSON model:

```JSON
{
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
    }]
}
```

Here is the corresponding C# client code Photo class and PhotoSingle class sample:
```C#
    [global::Microsoft.OData.Client.Key("Id")]
    [global::Microsoft.OData.Client.OriginalNameAttribute("Photo")]
    public partial class Photo : global::Microsoft.OData.Client.BaseEntityType, global::System.ComponentModel.INotifyPropertyChanged
    {
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        public static Photo CreatePhoto(long id)
        {
            Photo photo = new Photo();
            photo.Id = id;
            return photo;
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("Id")]
        public long Id
        {
            get
            {
                return this._Id;
            }
            set
            {
                this.OnIdChanging(value);
                this._Id = value;
                this.OnIdChanged();
                this.OnPropertyChanged("Id");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private long _Id;
        partial void OnIdChanging(long value);
        partial void OnIdChanged();
        /// <summary>
        /// This event is raised when the value of the property is changed
        /// </summary>
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        public event global::System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        /// <summary>
        /// The value of the property is changed
        /// </summary>
        /// <param name="property">property name</param>
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        protected virtual void OnPropertyChanged(string property)
        {
            if ((this.PropertyChanged != null))
            {
                this.PropertyChanged(this, new global::System.ComponentModel.PropertyChangedEventArgs(property));
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("Name")]
        public global::System.Nullable<string> Name
        {
            get
            {
                return this._Name;
            }
            set
            {
                this.OnNameChanging(value);
                this._Name = value;
                this.OnNameChanged();
                this.OnPropertyChanged("Name");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private global::System.Nullable<string> _Name;
        partial void OnNameChanging(global::System.Nullable<string> value);
        partial void OnNameChanged();
    }
    [global::Microsoft.OData.Client.OriginalNameAttribute("PhotoSingle")]
    public partial class PhotoSingle : global::Microsoft.OData.Client.DataServiceQuerySingle<Photo>
    {
        /// <summary>
        /// Initialize a new PhotoSingle object.
        /// </summary>
        public PhotoSingle(global::Microsoft.OData.Client.DataServiceContext context, string path)
            : base(context, path) {}

        /// <summary>
        /// Initialize a new PhotoSingle object.
        /// </summary>
        public PhotoSingle(global::Microsoft.OData.Client.DataServiceContext context, string path, bool isComposable)
            : base(context, path, isComposable) {}

        /// <summary>
        /// Initialize a new PhotoSingle object.
        /// </summary>
        public PhotoSingle(global::Microsoft.OData.Client.DataServiceQuerySingle<Photo> query)
            : base(query) {}
    }
```

###2.	Entity Function and Action, and Navigation Property

Use a Person entity type as example that has Functions and an Action, and Navigation Properties which is property referencing to other entity type.

Exception: 
1) The IsComposable attribute in CSDL is not coped with, now all operations are hard coded to be true for IsComposable.

Here is an Person Entity type sample in core JSON model:

```JSON
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
          'name': 'GetFriendFavoriteAirline',
          'type': 'Function',
          'params': [
            {
              'name': 'friend',
              'type': 'person',
              'isNullable': false
            },
            {
              'name': 'friendPhotos',
              'type': 'photo',
              'isCollection': true
            }
          ],
          'returns': 
          {
              'type': 'airline',
          },
          'operationType': 'Bound'
        },
        {
          'name': 'GetFriendPhotosCount',
          'type': 'Function',
          'params': [
            {
              'name': 'userName',
              'type': 'edm.string',
              'isNullable': false
            }
          ],
          'returns': 
           {
              'type': 'edm.int32',
           },
          'operationType': 'Bound'
        },
        {
          'name': 'GetFriendsTripsCount',
          'type': 'Function',
          'params': [
            {
              'name': 'userName',
              'type': 'edm.string'
            },
            {
              'name': 'howFar',
              'type': 'edm.double',
              'isNullable': true
            }
          ],
          'returns':
            {
              'type': 'edm.int32',
              'isCollection': true
            },
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
    },
    {
      'properties': [
        {
          'name': 'airlineCode',
          'type': 'edm.string',
          'isKey': true
        },
        {
          'name': 'name',
          'type': 'edm.string'
        }
      ],
      'name': 'airline'
    }
	]
};
```

Here is the corresponding C# client code Person class and PersonSingle class sample:
```C#
    [global::Microsoft.OData.Client.Key("UserName")]
    [global::Microsoft.OData.Client.OriginalNameAttribute("Person")]
    public partial class Person : global::Microsoft.OData.Client.BaseEntityType, global::System.ComponentModel.INotifyPropertyChanged
    {
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        public static Person CreatePerson(string userName, string firstName, string lastName, long concurrency)
        {
            Person person = new Person();
            person.UserName = userName;
            person.FirstName = firstName;
            person.LastName = lastName;
            person.Concurrency = concurrency;
            return person;
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("UserName")]
        public string UserName
        {
            get
            {
                return this._UserName;
            }
            set
            {
                this.OnUserNameChanging(value);
                this._UserName = value;
                this.OnUserNameChanged();
                this.OnPropertyChanged("UserName");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        private string _UserName;
        partial void OnUserNameChanging(string value);
        partial void OnUserNameChanged();
        /// <summary>
        /// This event is raised when the value of the property is changed
        /// </summary>
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        public event global::System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        /// <summary>
        /// The value of the property is changed
        /// </summary>
        /// <param name="property">property name</param>
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        protected virtual void OnPropertyChanged(string property)
        {
            if ((this.PropertyChanged != null))
            {
                this.PropertyChanged(this, new global::System.ComponentModel.PropertyChangedEventArgs(property));
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("FirstName")]
        public string FirstName
        {
            get
            {
                return this._FirstName;
            }
            set
            {
                this.OnFirstNameChanging(value);
                this._FirstName = value;
                this.OnFirstNameChanged();
                this.OnPropertyChanged("FirstName");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        private string _FirstName;
        partial void OnFirstNameChanging(string value);
        partial void OnFirstNameChanged();
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("LastName")]
        public string LastName
        {
            get
            {
                return this._LastName;
            }
            set
            {
                this.OnLastNameChanging(value);
                this._LastName = value;
                this.OnLastNameChanged();
                this.OnPropertyChanged("LastName");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        private string _LastName;
        partial void OnLastNameChanging(string value);
        partial void OnLastNameChanged();
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("Emails")]
        public global::System.Collections.ObjectModel.ObservableCollection<string> Emails
        {
            get
            {
                return this._Emails;
            }
            set
            {
                this.OnEmailsChanging(value);
                this._Emails = value;
                this.OnEmailsChanged();
                this.OnPropertyChanged("Emails");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        private global::System.Collections.ObjectModel.ObservableCollection<string> _Emails = new global::System.Collections.ObjectModel.ObservableCollection<string>();
        partial void OnEmailsChanging(global::System.Collections.ObjectModel.ObservableCollection<string> value);
        partial void OnEmailsChanged();
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("AddressInfo")]
        public global::System.Collections.ObjectModel.ObservableCollection<global::ODataV4Client.Proxies.TripPin.Location> AddressInfo
        {
            get
            {
                return this._AddressInfo;
            }
            set
            {
                this.OnAddressInfoChanging(value);
                this._AddressInfo = value;
                this.OnAddressInfoChanged();
                this.OnPropertyChanged("AddressInfo");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        private global::System.Collections.ObjectModel.ObservableCollection<global::ODataV4Client.Proxies.TripPin.Location> _AddressInfo = new global::System.Collections.ObjectModel.ObservableCollection<global::ODataV4Client.Proxies.TripPin.Location>();
        partial void OnAddressInfoChanging(global::System.Collections.ObjectModel.ObservableCollection<global::ODataV4Client.Proxies.TripPin.Location> value);
        partial void OnAddressInfoChanged();
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("Gender")]
        public global::System.Nullable<global::ODataV4Client.Proxies.TripPin.PersonGender> Gender
        {
            get
            {
                return this._Gender;
            }
            set
            {
                this.OnGenderChanging(value);
                this._Gender = value;
                this.OnGenderChanged();
                this.OnPropertyChanged("Gender");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        private global::System.Nullable<global::ODataV4Client.Proxies.TripPin.PersonGender> _Gender;
        partial void OnGenderChanging(global::System.Nullable<global::ODataV4Client.Proxies.TripPin.PersonGender> value);
        partial void OnGenderChanged();
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("Concurrency")]
        public long Concurrency
        {
            get
            {
                return this._Concurrency;
            }
            set
            {
                this.OnConcurrencyChanging(value);
                this._Concurrency = value;
                this.OnConcurrencyChanged();
                this.OnPropertyChanged("Concurrency");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        private long _Concurrency;
        partial void OnConcurrencyChanging(long value);
        partial void OnConcurrencyChanged();
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("Friends")]
        public global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Person> Friends
        {
            get
            {
                return this._Friends;
            }
            set
            {
                this.OnFriendsChanging(value);
                this._Friends = value;
                this.OnFriendsChanged();
                this.OnPropertyChanged("Friends");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        private global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Person> _Friends = new global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Person>(null, global::Microsoft.OData.Client.TrackingMode.None);
        partial void OnFriendsChanging(global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Person> value);
        partial void OnFriendsChanged();
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("Trips")]
        public global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Trip> Trips
        {
            get
            {
                return this._Trips;
            }
            set
            {
                this.OnTripsChanging(value);
                this._Trips = value;
                this.OnTripsChanged();
                this.OnPropertyChanged("Trips");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        private global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Trip> _Trips = new global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Trip>(null, global::Microsoft.OData.Client.TrackingMode.None);
        partial void OnTripsChanging(global::Microsoft.OData.Client.DataServiceCollection<global::ODataV4Client.Proxies.TripPin.Trip> value);
        partial void OnTripsChanged();
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("Photo")]
        public global::ODataV4Client.Proxies.TripPin.Photo Photo
        {
            get
            {
                return this._Photo;
            }
            set
            {
                this.OnPhotoChanging(value);
                this._Photo = value;
                this.OnPhotoChanged();
                this.OnPropertyChanged("Photo");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        private global::ODataV4Client.Proxies.TripPin.Photo _Photo;
        partial void OnPhotoChanging(global::ODataV4Client.Proxies.TripPin.Photo value);
        partial void OnPhotoChanged();
        [global::Microsoft.OData.Client.OriginalNameAttribute("GetFriendFavoriteAirline")]
        public global::ODataV4Client.Proxies.TripPin.AirlineSingle GetFriendFavoriteAirline(global::ODataV4Client.Proxies.TripPin.Person friend, global::System.Collections.Generic.ICollection<global::ODataV4Client.Proxies.TripPin.Photo> friendPhotos, bool useEntityReference = false)
        {
            global::System.Uri requestUri;
            Context.TryGetUri(this, out requestUri);
            
            return new global::ODataV4Client.Proxies.TripPin.AirlineSingle(this.Context.CreateFunctionQuerySingle<global::ODataV4Client.Proxies.TripPin.Airline>(string.Join("/", global::System.Linq.Enumerable.Select(global::System.Linq.Enumerable.Skip(requestUri.Segments, this.Context.BaseUri.Segments.Length), s => s.Trim(\'/\'))), "Microsoft.OData.SampleService.Models.TripPin.GetFriendFavoriteAirline", true, new global::Microsoft.OData.Client.UriEntityOperationParameter("friend", friend, useEntityReference),
                    new global::Microsoft.OData.Client.UriEntityOperationParameter("friendPhotos", friendPhotos, useEntityReference)));
        }
        [global::Microsoft.OData.Client.OriginalNameAttribute("GetFriendPhotosCount")]
        public global::Microsoft.OData.Client.DataServiceQuerySingle<global::System.Nullable<int>> GetFriendPhotosCount(string userName)
        {
            global::System.Uri requestUri;
            Context.TryGetUri(this, out requestUri);
            
            return this.Context.CreateFunctionQuerySingle<global::System.Nullable<int>>(string.Join("/", global::System.Linq.Enumerable.Select(global::System.Linq.Enumerable.Skip(requestUri.Segments, this.Context.BaseUri.Segments.Length), s => s.Trim(\'/\'))), "Microsoft.OData.SampleService.Models.TripPin.GetFriendPhotosCount", true, new global::Microsoft.OData.Client.UriOperationParameter("userName", userName));
        }
        [global::Microsoft.OData.Client.OriginalNameAttribute("GetFriendsTripsCount")]
        public global::Microsoft.OData.Client.DataServiceQuery<int> GetFriendsTripsCount(string userName, global::System.Nullable<double> howFar)
        {
            global::System.Uri requestUri;
            Context.TryGetUri(this, out requestUri);
            
            return this.Context.CreateFunctionQuery<int>(string.Join("/", global::System.Linq.Enumerable.Select(global::System.Linq.Enumerable.Skip(requestUri.Segments, this.Context.BaseUri.Segments.Length), s => s.Trim(\'/\'))), "Microsoft.OData.SampleService.Models.TripPin.GetFriendsTripsCount", true, new global::Microsoft.OData.Client.UriOperationParameter("userName", userName),
                    new global::Microsoft.OData.Client.UriOperationParameter("howFar", howFar));
        }
        public global::Microsoft.OData.Client.DataServiceActionQuery ShareTrip(string sharedTo, int tripId)
        {
            global::Microsoft.OData.Client.EntityDescriptor resource = Context.EntityTracker.TryGetEntityDescriptor(this);
            if (resource == null)
            {
                throw new global::System.Exception("cannot find entity");
            }
            return new global::Microsoft.OData.Client.DataServiceActionQuery(this.Context, resource.EditLink.OriginalString.Trim(\'/\') + "/Microsoft.OData.SampleService.Models.TripPin.ShareTrip", new global::Microsoft.OData.Client.BodyOperationParameter("sharedTo", sharedTo),
                    new global::Microsoft.OData.Client.BodyOperationParameter("tripId", tripId));
        }
    }
    [global::Microsoft.OData.Client.OriginalNameAttribute("PersonSingle")]
    public partial class PersonSingle : global::Microsoft.OData.Client.DataServiceQuerySingle<Person>
    {
        /// <summary>
        /// Initialize a new PersonSingle object.
        /// </summary>
        public PersonSingle(global::Microsoft.OData.Client.DataServiceContext context, string path)
            : base(context, path) {}
            
        /// <summary>
        /// Initialize a new PersonSingle object.
        /// </summary>
        public PersonSingle(global::Microsoft.OData.Client.DataServiceContext context, string path, bool isComposable)
            : base(context, path, isComposable) {}
            
        /// <summary>
        /// Initialize a new PersonSingle object.
        /// </summary>
        public PersonSingle(global::Microsoft.OData.Client.DataServiceQuerySingle<Person> query)
            : base(query) {}
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("Friends")]
        public global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.Person> Friends
        {
            get
            {
                if (!this.IsComposable)
                {
                    throw new global::System.NotSupportedException("The previous function is not composable.");
                }
                if ((this._Friends == null))
                {
                    this._Friends = Context.CreateQuery<global::ODataV4Client.Proxies.TripPin.Person>(GetPath("Friends"));
                }
                return this._Friends;
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        private global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.Person> _Friends;
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("Trips")]
        public global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.Trip> Trips
        {
            get
            {
                if (!this.IsComposable)
                {
                    throw new global::System.NotSupportedException("The previous function is not composable.");
                }
                if ((this._Trips == null))
                {
                    this._Trips = Context.CreateQuery<global::ODataV4Client.Proxies.TripPin.Trip>(GetPath("Trips"));
                }
                return this._Trips;
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        private global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.Trip> _Trips;
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("Photo")]
        public global::ODataV4Client.Proxies.TripPin.PhotoSingle Photo
        {
            get
            {
                if (!this.IsComposable)
                {
                    throw new global::System.NotSupportedException("The previous function is not composable.");
                }
                if ((this._Photo == null))
                {
                    this._Photo = new global::ODataV4Client.Proxies.TripPin.PhotoSingle(this.Context, GetPath("Photo"));
                }
                return this._Photo;
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.4.0")]
        private global::ODataV4Client.Proxies.TripPin.PhotoSingle _Photo;
    }
```
###3.	 Entity Type Enheritances with Base Type Property

The JSON model defines the base type PlanItem; there is a PublicTransportation entity type inherit from PlanItem; and there is a Flight entity type inherit from PublicTransportation. The Event entity type also inherit from PlanItem. 

```JSON
{
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
              'isNullable': false,
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
              'isNullable': false,
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
```

In C# implementation, the key in the top ancestor is inherited and is the key in each inheritance. All other properties are inherited from all the ancestors. The construction function will initiate all the required properties in the ancestors.

The Event entity type contains a key word in C#: 'event', in C# adding @ to form '@event' to escape the C# keywords.

Here is the corresponding C# client code sample to show the base type and its inheritances:
```C#
    [global::Microsoft.OData.Client.Key("PlanItemId")]
    [global::Microsoft.OData.Client.OriginalNameAttribute("PlanItem")]
    public partial class PlanItem : global::Microsoft.OData.Client.BaseEntityType, global::System.ComponentModel.INotifyPropertyChanged
    {
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        public static PlanItem CreatePlanItem(string planItemId, string confirmationCode)
        {
            PlanItem planItem = new PlanItem();
            planItem.PlanItemId = planItemId;
            planItem.ConfirmationCode = confirmationCode;
            return planItem;
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("PlanItemId")]
        public string PlanItemId
        {
            get
            {
                return this._PlanItemId;
            }
            set
            {
                this.OnPlanItemIdChanging(value);
                this._PlanItemId = value;
                this.OnPlanItemIdChanged();
                this.OnPropertyChanged("PlanItemId");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private string _PlanItemId;
        partial void OnPlanItemIdChanging(string value);
        partial void OnPlanItemIdChanged();
        /// <summary>
        /// This event is raised when the value of the property is changed
        /// </summary>
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        public event global::System.ComponentModel.PropertyChangedEventHandler PropertyChanged;
        /// <summary>
        /// The value of the property is changed
        /// </summary>
        /// <param name="property">property name</param>
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        protected virtual void OnPropertyChanged(string property)
        {
            if ((this.PropertyChanged != null))
            {
                this.PropertyChanged(this, new global::System.ComponentModel.PropertyChangedEventArgs(property));
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("ConfirmationCode")]
        public string ConfirmationCode
        {
            get
            {
                return this._ConfirmationCode;
            }
            set
            {
                this.OnConfirmationCodeChanging(value);
                this._ConfirmationCode = value;
                this.OnConfirmationCodeChanged();
                this.OnPropertyChanged("ConfirmationCode");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private string _ConfirmationCode;
        partial void OnConfirmationCodeChanging(string value);
        partial void OnConfirmationCodeChanged();
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("StartsAt")]
        public global::System.Nullable<global::System.DateTimeOffset> StartsAt
        {
            get
            {
                return this._StartsAt;
            }
            set
            {
                this.OnStartsAtChanging(value);
                this._StartsAt = value;
                this.OnStartsAtChanged();
                this.OnPropertyChanged("StartsAt");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private global::System.Nullable<global::System.DateTimeOffset> _StartsAt;
        partial void OnStartsAtChanging(global::System.Nullable<global::System.DateTimeOffset> value);
        partial void OnStartsAtChanged();
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("EndsAt")]
        public global::System.Nullable<global::System.DateTimeOffset> EndsAt
        {
            get
            {
                return this._EndsAt;
            }
            set
            {
                this.OnEndsAtChanging(value);
                this._EndsAt = value;
                this.OnEndsAtChanged();
                this.OnPropertyChanged("EndsAt");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private global::System.Nullable<global::System.DateTimeOffset> _EndsAt;
        partial void OnEndsAtChanging(global::System.Nullable<global::System.DateTimeOffset> value);
        partial void OnEndsAtChanged();
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("Duration")]
        public global::System.Nullable<global::System.TimeSpan> Duration
        {
            get
            {
                return this._Duration;
            }
            set
            {
                this.OnDurationChanging(value);
                this._Duration = value;
                this.OnDurationChanged();
                this.OnPropertyChanged("Duration");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private global::System.Nullable<global::System.TimeSpan> _Duration;
        partial void OnDurationChanging(global::System.Nullable<global::System.TimeSpan> value);
        partial void OnDurationChanged();
    }
    [global::Microsoft.OData.Client.OriginalNameAttribute("PlanItemSingle")]
    public partial class PlanItemSingle : global::Microsoft.OData.Client.DataServiceQuerySingle<PlanItem>
    {
        /// <summary>
        /// Initialize a new PlanItemSingle object.
        /// </summary>
        public PlanItemSingle(global::Microsoft.OData.Client.DataServiceContext context, string path)
            : base(context, path) {}

        /// <summary>
        /// Initialize a new PlanItemSingle object.
        /// </summary>
        public PlanItemSingle(global::Microsoft.OData.Client.DataServiceContext context, string path, bool isComposable)
            : base(context, path, isComposable) {}
            
        /// <summary>
        /// Initialize a new PlanItemSingle object.
        /// </summary>
        public PlanItemSingle(global::Microsoft.OData.Client.DataServiceQuerySingle<PlanItem> query)
            : base(query) {}
    }
    [global::Microsoft.OData.Client.Key("PlanItemId")]
    [global::Microsoft.OData.Client.OriginalNameAttribute("PublicTransportation")]
    public partial class PublicTransportation : PlanItem
    {
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        public static PublicTransportation CreatePublicTransportation(string planItemId, string seatNumber, string confirmationCode)
        {
            PublicTransportation publicTransportation = new PublicTransportation();
            publicTransportation.PlanItemId = planItemId;
            publicTransportation.SeatNumber = seatNumber;
            publicTransportation.ConfirmationCode = confirmationCode;
            return publicTransportation;
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("SeatNumber")]
        public string SeatNumber
        {
            get
            {
                return this._SeatNumber;
            }
            set
            {
                this.OnSeatNumberChanging(value);
                this._SeatNumber = value;
                this.OnSeatNumberChanged();
                this.OnPropertyChanged("SeatNumber");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private string _SeatNumber;
        partial void OnSeatNumberChanging(string value);
        partial void OnSeatNumberChanged();
    }
    [global::Microsoft.OData.Client.OriginalNameAttribute("PublicTransportationSingle")]
    public partial class PublicTransportationSingle : global::Microsoft.OData.Client.DataServiceQuerySingle<PublicTransportation>
    {
        /// <summary>
        /// Initialize a new PublicTransportationSingle object.
        /// </summary>
        public PublicTransportationSingle(global::Microsoft.OData.Client.DataServiceContext context, string path)
            : base(context, path) {}

        /// <summary>
        /// Initialize a new PublicTransportationSingle object.
        /// </summary>
        public PublicTransportationSingle(global::Microsoft.OData.Client.DataServiceQuerySingle<PublicTransportation> query)
            : base(query) {}
    }
    [global::Microsoft.OData.Client.Key("PlanItemId")]
    [global::Microsoft.OData.Client.OriginalNameAttribute("Flight")]
    public partial class Flight : PublicTransportation
    {
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        public static Flight CreateFlight(string planItemId, string flightNumber, string seatNumber, string confirmationCode)
        {
            Flight flight = new Flight();
            flight.PlanItemId = planItemId;
            flight.FlightNumber = flightNumber;
            flight.SeatNumber = seatNumber;
            flight.ConfirmationCode = confirmationCode;
            return flight;
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("FlightNumber")]
        public string FlightNumber
        {
            get
            {
                return this._FlightNumber;
            }
            set
            {
                this.OnFlightNumberChanging(value);
                this._FlightNumber = value;
                this.OnFlightNumberChanged();
                this.OnPropertyChanged("FlightNumber");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private string _FlightNumber;
        partial void OnFlightNumberChanging(string value);
        partial void OnFlightNumberChanged();
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("From")]
        public global::System.Nullable<global::OData.Service.V4.Client.Airport> From
        {
            get
            {
                return this._From;
            }
            set
            {
                this.OnFromChanging(value);
                this._From = value;
                this.OnFromChanged();
                this.OnPropertyChanged("From");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private global::System.Nullable<global::OData.Service.V4.Client.Airport> _From;
        partial void OnFromChanging(global::System.Nullable<global::OData.Service.V4.Client.Airport> value);
        partial void OnFromChanged();
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("To")]
        public global::System.Nullable<global::OData.Service.V4.Client.Airport> To
        {
            get
            {
                return this._To;
            }
            set
            {
                this.OnToChanging(value);
                this._To = value;
                this.OnToChanged();
                this.OnPropertyChanged("To");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private global::System.Nullable<global::OData.Service.V4.Client.Airport> _To;
        partial void OnToChanging(global::System.Nullable<global::OData.Service.V4.Client.Airport> value);
        partial void OnToChanged();
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("Airline")]
        public global::System.Nullable<global::OData.Service.V4.Client.Airline> Airline
        {
            get
            {
                return this._Airline;
            }
            set
            {
                this.OnAirlineChanging(value);
                this._Airline = value;
                this.OnAirlineChanged();
                this.OnPropertyChanged("Airline");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private global::System.Nullable<global::OData.Service.V4.Client.Airline> _Airline;
        partial void OnAirlineChanging(global::System.Nullable<global::OData.Service.V4.Client.Airline> value);
        partial void OnAirlineChanged();
    }
    [global::Microsoft.OData.Client.OriginalNameAttribute("FlightSingle")]
    public partial class FlightSingle : global::Microsoft.OData.Client.DataServiceQuerySingle<Flight>
    {
        /// <summary>
        /// Initialize a new FlightSingle object.
        /// </summary>
        public FlightSingle(global::Microsoft.OData.Client.DataServiceContext context, string path)
            : base(context, path) {}

        /// <summary>
        /// Initialize a new FlightSingle object.
        /// </summary>
        public FlightSingle(global::Microsoft.OData.Client.DataServiceContext context, string path, bool isComposable)
            : base(context, path, isComposable) {}
            
        /// <summary>
        /// Initialize a new FlightSingle object.
        /// </summary>
        public FlightSingle(global::Microsoft.OData.Client.DataServiceQuerySingle<Flight> query)
            : base(query) {}
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("From")]
        public global::OData.Service.V4.Client.AirportSingle From
        {
            get
            {
                if (!this.IsComposable)
                {
                    throw new global::System.NotSupportedException("The previous function is not composable.");
                }
                if ((this._From == null))
                {
                    this._From = new global::OData.Service.V4.Client.AirportSingle(this.Context, GetPath("From"));
                }
                return this._From;
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private global::OData.Service.V4.Client.AirportSingle _From;
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("To")]
        public global::OData.Service.V4.Client.AirportSingle To
        {
            get
            {
                if (!this.IsComposable)
                {
                    throw new global::System.NotSupportedException("The previous function is not composable.");
                }
                if ((this._To == null))
                {
                    this._To = new global::OData.Service.V4.Client.AirportSingle(this.Context, GetPath("To"));
                }
                return this._To;
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private global::OData.Service.V4.Client.AirportSingle _To;
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("Airline")]
        public global::OData.Service.V4.Client.AirlineSingle Airline
        {
            get
            {
                if (!this.IsComposable)
                {
                    throw new global::System.NotSupportedException("The previous function is not composable.");
                }
                if ((this._Airline == null))
                {
                    this._Airline = new global::OData.Service.V4.Client.AirlineSingle(this.Context, GetPath("Airline"));
                }
                return this._Airline;
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private global::OData.Service.V4.Client.AirlineSingle _Airline;
    }
    [global::Microsoft.OData.Client.Key("PlanItemId")]
    [global::Microsoft.OData.Client.OriginalNameAttribute("Event")]
    public partial class Event : PlanItem
    {
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        public static Event CreateEvent(string planItemId, global::OData.Service.V4.Client.EventLocation occursAt, string confirmationCode)
        {
            Event @event = new Event();
            @event.PlanItemId = planItemId;
            if ((occursAt == null))
            {
                throw new global::System.ArgumentNullException("occursAt");
            }
            @event.OccursAt = occursAt;
            @event.ConfirmationCode = confirmationCode;
            return @event;
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("Description")]
        public global::System.Nullable<string> Description
        {
            get
            {
                return this._Description;
            }
            set
            {
                this.OnDescriptionChanging(value);
                this._Description = value;
                this.OnDescriptionChanged();
                this.OnPropertyChanged("Description");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private global::System.Nullable<string> _Description;
        partial void OnDescriptionChanging(global::System.Nullable<string> value);
        partial void OnDescriptionChanged();
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        [global::Microsoft.OData.Client.OriginalNameAttribute("OccursAt")]
        public global::OData.Service.V4.Client.EventLocation OccursAt
        {
            get
            {
                return this._OccursAt;
            }
            set
            {
                this.OnOccursAtChanging(value);
                this._OccursAt = value;
                this.OnOccursAtChanged();
                this.OnPropertyChanged("OccursAt");
            }
        }
        [global::System.CodeDom.Compiler.GeneratedCodeAttribute("Microsoft.OData.Client.Design.T4", "2.1.0")]
        private global::OData.Service.V4.Client.EventLocation _OccursAt;
        partial void OnOccursAtChanging(global::OData.Service.V4.Client.EventLocation value);
        partial void OnOccursAtChanged();
    }
    [global::Microsoft.OData.Client.OriginalNameAttribute("EventSingle")]
    public partial class EventSingle : global::Microsoft.OData.Client.DataServiceQuerySingle<Event>
    {
        /// <summary>
        /// Initialize a new EventSingle object.
        /// </summary>
        public EventSingle(global::Microsoft.OData.Client.DataServiceContext context, string path)
            : base(context, path) {}

        /// <summary>
        /// Initialize a new EventSingle object.
        /// </summary>
        public EventSingle(global::Microsoft.OData.Client.DataServiceContext context, string path, bool isComposable)
            : base(context, path, isComposable) {}

        /// <summary>
        /// Initialize a new EventSingle object.
        /// </summary>
        public EventSingle(global::Microsoft.OData.Client.DataServiceQuerySingle<Event> query)
            : base(query) {}
    }
```
