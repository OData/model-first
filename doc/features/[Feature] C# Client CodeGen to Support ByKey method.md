#C# Client CodeGen to Support ByKey method

##Summery

In Model_First Tooling, the C# client code generation is to convert the JSON model to C# code. This code generation conforms to the Microsoft implementation of the [ODATA CSDL document](http://docs.oasis-open.org/odata/odata/v4.0/errata02/os/complete/part3-csdl/odata-v4.0-errata02-os-part3-csdl-complete.html) -- MAY requirements are not implemented.

ByKey method is intended to get an entity of entity type as entity single type specified by key from an entity set. For more information of how entity type in JSON model is converted to C# classes, see [Feature] C# Client CodeGen for Entity Type.md.

Use the following example to show the convertion details.

###ByKey method C# code example corresponds to JSON model entity type defintion sample

The core JSON model entity types: 1) planItem, 2)event. The planItem entity type has two properties as key. The event entity inherits from planItem entity type.

```JSON
{
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
]}
```

There is going to be two ByKey methods for each entity type in C#. The first ByKey method uses a key dictionary as input parameter. The second ByKey method uses all the key properties in the entity type as parameters. If the entity type has only 1 property as its key, the second method will show only 1 key parameter; if the entity type has more properties as key, the second method will show more key parameters. The inheritance entity type uses the key of its ancestor.

```C#
        /// <summary>
        /// Get an entity of type global::ODataV4Client.Proxies.TripPin.PlanItem as global::ODataV4Client.Proxies.TripPin.PlanItemSingle specified by key from an entity set
        /// </summary>
        /// <param name="source">source entity set</param>
        /// <param name="keys">dictionary with the names and values of keys</param>
        public static global::ODataV4Client.Proxies.TripPin.PlanItemSingle ByKey(this global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.PlanItem> source, global::System.Collections.Generic.Dictionary<string, object> keys)
        {
            return new global::ODataV4Client.Proxies.TripPin.PlanItemSingle(source.Context, source.GetKeyPath(global::Microsoft.OData.Client.Serializer.GetKeyString(source.Context, keys)));
        }
        /// <summary>
        /// Get an entity of type global::ODataV4Client.Proxies.TripPin.PlanItem as global::ODataV4Client.Proxies.TripPin.PlanItemSingle specified by key from an entity set
        /// </summary>
        /// <param name="source">source entity set</param>
        /// <param name="planItemId">The value of planItemId</param>
        /// <param name="confirmationCode">The value of confirmationCode</param>
        public static global::ODataV4Client.Proxies.TripPin.PlanItemSingle ByKey(this global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.PlanItem> source,
            int planItemId, string confirmationCode)
        {
            global::System.Collections.Generic.Dictionary<string, object> keys = new global::System.Collections.Generic.Dictionary<string, object>
            {
                { "PlanItemId", planItemId },
                { "ConfirmationCode", confirmationCode }
            };
            return new global::ODataV4Client.Proxies.TripPin.PlanItemSingle(source.Context, source.GetKeyPath(global::Microsoft.OData.Client.Serializer.GetKeyString(source.Context, keys)));
        }
        /// <summary>
        /// Get an entity of type global::ODataV4Client.Proxies.TripPin.Event as global::ODataV4Client.Proxies.TripPin.EventSingle specified by key from an entity set
        /// </summary>
        /// <param name="source">source entity set</param>
        /// <param name="keys">dictionary with the names and values of keys</param>
        public static global::ODataV4Client.Proxies.TripPin.EventSingle ByKey(this global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.Event> source, global::System.Collections.Generic.Dictionary<string, object> keys)
        {
            return new global::ODataV4Client.Proxies.TripPin.EventSingle(source.Context, source.GetKeyPath(global::Microsoft.OData.Client.Serializer.GetKeyString(source.Context, keys)));
        }
        /// <summary>
        /// Get an entity of type global::ODataV4Client.Proxies.TripPin.Event as global::ODataV4Client.Proxies.TripPin.EventSingle specified by key from an entity set
        /// </summary>
        /// <param name="source">source entity set</param>
        /// <param name="planItemId">The value of planItemId</param>
        /// <param name="confirmationCode">The value of confirmationCode</param>
        public static global::ODataV4Client.Proxies.TripPin.EventSingle ByKey(this global::Microsoft.OData.Client.DataServiceQuery<global::ODataV4Client.Proxies.TripPin.Event> source,
            int planItemId, string confirmationCode)
        {
            global::System.Collections.Generic.Dictionary<string, object> keys = new global::System.Collections.Generic.Dictionary<string, object>
            {
                { "PlanItemId", planItemId },
                { "ConfirmationCode", confirmationCode }
            };
            return new global::ODataV4Client.Proxies.TripPin.EventSingle(source.Context, source.GetKeyPath(global::Microsoft.OData.Client.Serializer.GetKeyString(source.Context, keys)));
        }
```