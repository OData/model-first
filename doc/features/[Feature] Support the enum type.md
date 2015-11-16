#Enumeration Type - Model-first Tooling

##1.	Core JSON Model Enumeration Type Design

Conforms to the enumeration type definition in [ODATA CSDL document](http://docs.oasis-open.org/odata/odata/v4.0/errata02/os/complete/part3-csdl/odata-v4.0-errata02-os-part3-csdl-complete.html#_Toc406397991).

Here is an enumeration type sample for the core JSON model:

```JSON
"types": [
    {
	  "name": "personGender",
      "members": [
         {
           "name": "unknown"
           "value": 0
         },
         {
           "name": "female"
           "value": -1
         },
         {
           "name": "male"
           "value": 2
         }
       ],
      "flags": false,
      "underlyingType": "int32"
    },
	{
	  "name": "originalColor"
	  "members": [
		{
		  "name": "red"
		},
		{
		  "name": "yellow"
		},
		{
		  "name": "blue"
		}
	  ]
	}
]
```

The following element is defined:

----------------------------
|Field Name|	Description|
|-----------|----------------|
|Types	|Provides the type information used in web service|
-----------------------------------------------------------

###1.1	Types Field
Types contains a list of type element, and the following fields are defined for type element especially for enumeration type:

----------------------------
|Field Name|	Description|
|-----------|----------------|
|name	|The enumeration type name.|
|members|	The array of member element of enumeration type.|
|flags	|Facet that indicates whether this enumeration type uses flags.|
|underlyingType	|Indicates this enumeration type’s underlying type for its values.|
--------------------------------------------------------------------

The following items for member element are defined:

----------------------------
|Field Name|	Description|
|-----------|----------------|
|name	|Member name|
|value	|Indicates this enumeration member‘s value.|
----------------------------------------------------

##2.	YAML Format enumeration support
Conforms to the enumeration type definition in [ODATA CSDL document](http://docs.oasis-open.org/odata/odata/v4.0/errata02/os/complete/part3-csdl/odata-v4.0-errata02-os-part3-csdl-complete.html#_Toc406397991).

Here is a YAML enumeration type sample:

```YAML
service:
  name: Service
types:
- name: personGender
   members:
      - name: unknown
        value: 0
      - name: female
        value: -1
      - name: male
        value: 2
   flags: false
   underlyingType: int32
- name: originalColor
   members: [red, yellow, blue]
```

The following top level element for YAML is defined:

----------------------------
|Field Name|	Description|
|-----------|----------------|
|types	|The type information for the service|
----------------------------------------------

###2.1	Types Field
Types contains an array of type definition, each of them is a type element, and enumeration type is one of them. For the enumeration type section, the convertion is a one-to-one mapping described as following:

----------------------------
Field Name|	Description|
-----------|----------------
name	|The name for the enumeration type.
members	|The array of member element of enumeration type.
flags	|Facet that indicates whether this enumeration type uses flags.
underlyingType	|Indicates this enumeration type’s underlying type for its values.
----------------------------------------------------------------------------------

For each member element, 2 formats are supported, string only or structure.
If the value is a raw string, the string would be the member name. If the enumeration member has value, it follows the following rule:

----------------------------
Field Name|	Description|
-----------|----------------
name	|Name for the member
value	|Indicates this enumeration member ‘s value.
----------------------------------------------------

##3.	Swagger Format Enumeration Type support
Swagger is supported as one of the output formats, here some rules are defined for converting core model to a Swagger schema.

Here is how JSON model is mapped to a Swagger schema:

----------------------------
Field Name|	Description|
-----------|----------------
definitions	|The type definition for the service, which would be converted from types element from core model. See details below.
----------------------------

###3.1	Definitions Field
As per swagger spec, definitions element is a JSON object contains key-value pair from an enumeration type name to a schema object. Here are 2 samples of enumeration definitions elements:

```SWAGGER
{
  "definitions": {
     "personGender": {
      "type": "string",
      "enum": [
        "unknown",
        "female",
        "male"
      ]},
  "originalColor": {
      "type": "string",
      "enum": ["red", "yellow", "blue"]
    },
}
```

Each schema object would contain a enum field, which is also an array that contains the enum members; plus a type field to specify that the enumeration type is based on string.

----------------------------
Field Name|	Description|
-----------|----------------
enum	|The array of the "member" in the enumeration type from JSON model.
Type	|Indicates this enumeration type is based on string type.
----------------------------------------------------------------

Warning: The current swagger design ignores the flags, underlyingType and value fields of enumeration type in simple YAML and JSON model. The order of enum member follows the member order in the simple YAML enumeration type.