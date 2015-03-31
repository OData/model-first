## Service root assumptions

* The only requirement is a service root and a brief description of the type.
* Items in the service root use the name both for name and URL.
* A member of the service root is an entity set if the type is an array.
* A member of the service root is a singleton if the type is not an array.
* A member of the service root is a function/action import if the type is not specified.
* Navigation property bindings default to the entity set containing the type of the navigation property.
* Resource path annotation defaults to the name of the resource.

## Types assumptions

* A type is an entity type if it has a key specified.
* A type is a complex type if it does not have a key specified.
* The key for a type can be a simple key (`id`) or a compound key (`[shard,key]`).
* The key for a type does not need to be named again in requiredProperties.
* The default type for a key property is a 32-bit integer.
* Required properties are not nullable.
* Optional properties are nullable.
* If not specified, a property's type is string.
* A property is a navigation property if the target type contains a key.
* Anything that inherits from an open type, is an open type.
* The assumption for spatial properties should be SRID=4326.
* Key properties are assumed to be read-only.

## Properties assumptions

* `string`, `int32`, `string[]`, etc map to their Edm.* counterparts unless there is a specific type in the model with that name.
* If a property has ISO currency specified, the default scale should be 2.

## Enums assumptions

* Enums are only flagged if specified
* Unspecified values for enum values follow the pattern 0, 1, ... n
* Unspecified values for flagged enum members follow the pattern 2<sup>0</sup>, 2<sup>1</sup>, ... 2<sup>n</sup>

## Operations assumptions

* Operations are functions if they return something, actions otherwise
* Functions are assumed to be composable
* EntitySetPath defaults to the collection of the returned entity type

## Service assumptions

* Auth is assumed to be OAuth2.
* IDs are assumed to be dereferenceable.
* IDs are assumed to follow convention.
* Conformance level is assumed to be minimal.
* Supported formats are assumed to be default JSON formats.
* Async requests are assumed to be unsupported.
* BatchContinueOnError is assumed to be unsupported
* Filter functions is assumed to be empty
