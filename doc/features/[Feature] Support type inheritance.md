#Type Inheritance - Model-first Tooling



##1.	Core JSON Model baseType Field in a Type Section

The core JSON model types use baseType field to define the inheritance relationship between types.

```JSON
types:
 {
      "properties": [
        {
          "name": "address",
          "type": "String"
        },
        {
          "name": "city",
          "type": "city"
        }
      ],
      "name": "location"
    },
    {
      "properties": [
        {
          "name": "buildingInfo",
          "isNullable": true,
          "type": "String"
        }
      ],
      "name": "eventLocation",
      "baseType": "location"
    },
    {
      "properties": [
        {
          "name": "loc",
          "type": "edm.geographyPoint"
        }
      ],
      "name": "airportLocation",
      "baseType": "location"
    }
}
```

Define baseType field for a type section as follows

----------------------------
Field Name|	Description
-----------|----------------
baseType   | A type can inherit from another type by specifying the name of the base type as the value for the baseType field.
------------------------------------------------------------


##2.	YAML Format baseType Field in a Type Section

Simple YAML also uses baseType field for a type section to define the type inheritance relationship. The value of the baseType field MUST be type name that this type inherit from.

Here is a YAML sample:


```YAML
types:
  - name: location
    requiredProperties:
      - address
      - name: city
        type: city
  - name: eventLocation
    baseType: location
    optionalProperties: buildingInfo
  - name: airportLocation
    baseType: location
    requiredProperties:
      - name: loc
        type: edm.geographyPoint

```

Define baseType field for a type section as follows

----------------------------
Field Name|	Description
-----------|----------------
baseType   | A type can inherit from another type by specifying the name of the base type as the value for the baseType field.
------------------------------------------------------------

##3.	Swagger Type Inheritance Design

Swagger is supported as one of the output formats, here converting core model to a Swagger schema using Swagger's allOf and discriminator fields.

This design conforms to the "Composition and Inheritance (Polymorphism)" section and the discriminator field specification in [Swagger specification](http://swagger.io/specification/#definitionsObject).

Here is 1 sample of type inheritance:

```SWAGGER
definitions:{
    "location": {
      "discriminator": "locationType",
      "properties": {
        "address": {
          "type": "string"
        },
        "city": {
          "$ref": "#/definitions/city"
        },
        "locationType": {
          type: "string"
        }
      },
      "required": [
        "address",
        "locationType"
      ]
    },
    "eventLocation": {
      "allOf": [
        {
          "$ref": "#/definitions/location"
        },
      "properties": {
        "buildingInfo": {
          "type": "string"
        }
      }
      ]
    },
    "airportLocation": {
        "allOf": [
        {
          "$ref": "#/definitions/location"
        },
      "properties": {
        "loc": {
          "type": "string",
          "format": "edm.geographyPoint"
        }
      }
      ]
    },
 }

```
Here is how JSON model is mapped to a Swagger schema:

----------------------------
Field Name|	Description
-----------|----------------
allOf   | Swagger allows combining and extending model definitions using the allOf property of JSON Schema, in effect offering model composition. Here allOf maps to the baseType field in simple YAML and JSON model.
&lt;The name of the base type> + "Type" | Add this string property as a required property in the base type deifnition to point out which type -- the base type or any type that inherits it -- is used in a polymorphism instance.
discriminator | In base type definition, add the discriminator field in the base type and use the newly added property name &lt;The name of the base type> + "Type" as value.
-------------------------------------------------------------
