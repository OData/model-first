# OData Design Specification – Model-first Tooling

## Operation Part

### 1. Design Summary

#### 1.1 Overview

This part is to discuss about how to write edm:Action, edm:ActionImport, edm:Function and edm:FunctionImport elements with YAML format. Then the Model-first tool will convert them to JSON format and Swagger format. The user can see a graphical interface of it after converting. In a word, we want to provide a simple way to help the user to create their own action, action import, function, and function import in the OData service.

#### 1.2 Goals

+ Add support of **action** and **action import** feature for the Model-first tool.
+ Add support of **function** and **function import** feature for the Model-first tool.

### 2. Design Details

#### 2.1 Action

I make a brief introduction of **Action** and **Action Import**, and show what is the format of them in metadata document.

> **Action** is an operation in the OData service and it MAY have observable side effects on target service.

> **Action Import** allows exposing an unbound action as a top-level element in an entity container.

##### 2.1.1 Bound Action

A bound action is similar to a member function which may have observable side effects on the target service. In the metadata document, it will be defined as follows:

Example 1 - 1: the action ShareTrip can be bound to any URL that identifies a Microsoft.OData.SampleService.Models.TripPin.Person
```xml
<Action Name="ShareTrip" IsBound="true">
    <Parameter Name="person" Type="Microsoft.OData.SampleService.Models.TripPin.Person" Nullable="false"/>
    <Parameter Name="userName" Type="Edm.String" Nullable="false"/>
    <Parameter Name="tripId" Type="Edm.Int32" Nullable="false"/>
</Action>
```

Next, I will convert it to a simple YAML format.

###### 2.1.1.1 YAML Format Support

For simplicity, we regard the action has no return type. And for a bound action, it is placed among the operations element contained in types element. The parameters of the action have 2 properties MUST be defined: the name and the type. If a parameter is with a string type, you can only define the name for short.

For example, there has a parameter with a string type and was named as *userName*.
Then you can define this parameter as:
> \- name: userName
> \- type: string

And you can also only define its name for short as:
> \- userName

So the bound action ShareTrip was converted as follows:

Example 1 - 2: the bound action ShareTrip with YAML format
```yaml
- name: shareTrip
  params:
  - userName
  - name: tripId
    type: int32
```

###### 2.1.1.2 JSON Format Support

If you define the action with YAML format correctly, the Model-first tool will convert it to JSON format. And you can see it is more complex than YAML format.

Example 1 - 3: the bound action ShareTrip with JSON format
```json
{
  "name": "shareTrip",
  "operationType": "Bound",
  "type": "Action"，
  "params": [
    {
      "name": "userName",
      "type": "String"
    },
    {
      "name": "tripId",
      "type": "Int32"
    }
  ]
}
```

> NOTE: the parameter *userName* which was defined for short with YAML format that has been converted to a complete definition with JSON format.

###### 2.1.1.3 Swagger Format Support

Model-first tool will convert the JSON format converted from previous to Swagger format automatically. It will add an If-Match header as its parameter using to execute a write operation on the target service. And It also will replace the binding parameter with its keys instead.

Example 1 - 4: the bound action ShareTrip with Swagger format
```json
{
  "/people/{userName}/shareTrip": {
    "post": {
      "tags": [
        "Action",
        "Bound"
      ],
      "description": "Bound action: shareTrip.",
      "parameters": [
        {
          "name": "If-Match",
          "type": "string",
          "in": "header",
          "description": "The If-Match header.",
          "required": false
        },
        {
          "name": "userName",
          "type": "string",
          "in": "path",
          "description": "The key.",
          "required": true
        },
        {
          "name": "userName",
          "type": {
          	"type": "string"
          },
          "in": "formData",
          "description": "The parameter.",
          "required": true
          },
        {
        "name": "tripId",
        "type": {
          "type": "integer",
          "format": "int32"
        },
        "in": "formData",
        "description": "The parameter.",
        "required": true
        }
      ],
      "responses": {
        "201": {
        	"description": "The action has been created new entities."
        },
        "204": {
        	"description": "The action is without a return type."
        }
      }
    }
  }
}
```

##### 2.1.2 Unbound Action

A unbound action is similar to a static function which may have observable side effects on the target service. In the metadata document, it will be defined as follows:

Example 2 - 1: the unbound action Discount can be used after prefixing the root URL of its OData service.
```xml
<Action Name="Discount">
	<Parameter Name="percentage" Type="Edm.Int32" Nullable="false"/>
</Action>
```

And as a unbound action, it often has an edm:ActionImport element is defined in the edm:EntityContainer element as follows:

Example 2 - 2: the edm:ActionImport element is named as Discount
```xml
<ActionImport Name="Discount" Action="Microsoft.Test.OData.Services.ODataWCFService.Discount"/>
```

Next, I will convert it to a simple YAML format.

###### 2.1.2.1 YAML Format Support

For simplicity, we can regard the action has no return type. And for a unbound action, it is placed among the serviceRoot element. The parameters of the action have 2 properties MUST be defined: the name and the type. If a parameter is with a string type, you can only define the name for short.

So the unbound action Discount was converted as follows:

Example 2 - 3: the bound action ShareTrip with YAML format
```yaml
- name: Discount
  params:
  - name: percentage
    type: int32
```

###### 2.1.2.2 JSON Format Support

If you define the action with YAML format correctly, the Model-first tool will convert it to JSON format. And you can see it is more complex than YAML format.

Example 2 - 4: the unbound action Discount with JSON format
```json
{
  "name": "Discount",
  "operationType": "Unbound",
  "type": "Action",
  "params": [
    {
      "name": "percentage",
      "type": "Int32"
    }
  ]
}
```

###### 2.1.1.3 Swagger Format Support

Model-first tool will convert the JSON format converted from previous to Swagger format automatically. It will add an If-Match header as its parameter using to execute a write operation on the target service. And It also will replace the binding parameter with its keys instead.

Example 2 - 5: the unbound action Discount with Swagger format
```json
{
  "/Discount": {
    "post": {
      "tags": [
        "Action",
        "Unbound"
      ],
      "description": "Unbound action: Discount.",
      "parameters": [
        {
          "name": "If-Match",
          "type": "string",
          "in": "header",
          "description": "The If-Match header.",
          "required": false
        },
        {
          "name": "percentage",
          "type": {
            "type": "integer",
            "format": "int32"
          },
          "in": "formData",
          "description": "The parameter.",
          "required": true
        }
      ],
      "responses": {
        "201": {
        	"description": "The action has been created new entities."
        },
        "204": {
        	"description": "The action is without a return type."
        }
      }
    }
  }
}
```

#### 2.2 Function

I make a introduction of **Function** and **Function Import**, and show what is the format of them in metadata document.

> **Function** is an operation in the OData service and it MUST NOT have observable side effects.

> **Function Import** allows exposing an unbound function as a top-level element in an entity container.

##### 2.2.1 Bound Function

A bound function is similar to a member function which must not have observable side effects on the target service. In the metadata document, it will be defined as follows:

Example 3 - 1: the function GetProductDetails can be bound to any URL that identifies a Microsoft.Test.OData.Services.ODataWCFService.Product.
```xml
<Function Name="GetProductDetails" IsBound="true" EntitySetPath="product/Details" IsComposable="true">
    <Parameter Name="product" Type="Microsoft.Test.OData.Services.ODataWCFService.Product" Nullable="false"/>
    <Parameter Name="count" Type="Edm.Int32"/>
    <ReturnType Type="Collection(Microsoft.Test.OData.Services.ODataWCFService.ProductDetail)" Nullable="false"/>
</Function>
```

Next, I will convert it to a simple YAML format.

###### 2.2.1.1 YAML Format Support

For simplicity, we regard the function MUST has a return type. And for a bound function, it is placed among the operations element contained in types element. The parameters of the function have 2 properties MUST be defined: the name and the type. If a parameter is with a string type, you can only define the name for short.

So the bound action GetProductDetails was converted as follows:

Example 3 - 2: the bound function GetProductDetails with YAML format
```yaml
- name: GetProductDetails
  params:
    - name: productId
      type: int32
    - name: count
      type: int32
  returns: productDetail[]
```

###### 2.2.1.2 JSON Format Support

If you define the function with YAML format correctly, the Model-first tool will convert it to JSON format. And you can see it is more complex than YAML format.

Example 3 - 3: the bound action ShareTrip with JSON format
```json
{
  "name": "GetProductDetails",
  "operationType": "Bound",
  "type": "Function",
  "returns": "productDetail[]",
  "params": [
    {
      "name": "productId",
      "type": "Int32"
    },
    {
      "name": "count",
      "type": "Int32"
    }
  ]
}
```

###### 2.2.1.3 Swagger Format Support

Model-first tool will convert the JSON format converted from previous to Swagger format automatically. And It will replace the binding parameter with its keys instead.

Example 3 - 4: the unbound action Discount with Swagger format
```json
{
  "/product/{productId}/GetProductDetails": {
    "get": {
      "tags": [
        "Function",
        "Bound"
      ],
      "description": "Bound function: GetProductDetails.",
      "parameters": [
        {
          "name": "productId",
          "type": {
            "type": "integer",
            "format": "int32"
          },
          "in": "formData",
          "description": "The parameter.",
          "required": true
        },
        {
          "name": "count",
          "type": {
            "type": "integer",
            "format": "int32"
          },
          "in": "formData",
          "description": "The parameter.",
          "required": true
        }
      ],
      "responses": {
        "200": {
          "description": "The function has been returned results.",
          "schema": {
            "type": "array",
            "items": {
            	"$ref": "#/definitions/productDetail"
            }
          }
        },
        "204": {
        	"description": "The function is without a return type."
        },
        "400": {
          "description": "A single entity function with a non-nullable return type has no result."
        },
        "4xx": {
        	"description": "A single-valued function with a non-nullable return type has no result, or a composable function the processing is stopped."
        }
      }
    }
  }
}
```

##### 2.2.2 Unbound Function

A unbound function is similar to a static function which must not have observable side effects on the target service. In the metadata document, it will be defined as follows:

Example 4 - 1: the unbound function GetAllProducts can be used after prefixing the root URL of its OData service.
```xml
<Function Name="GetAllProducts" IsComposable="true">
    <ReturnType Type="Collection(Microsoft.Test.OData.Services.ODataWCFService.Product)" Nullable="false"/>
</Function>
```

And as a unbound function, it often has an edm:FunctionImport element is defined in the edm:EntityContainer element as follows:

Example 4 - 2: the edm:FunctionImport element is named as GetAllProducts
```xml
<FunctionImport Name="GetAllProducts" Function="Microsoft.Test.OData.Services.ODataWCFService.GetAllProducts" EntitySet="Products" IncludeInServiceDocument="true"/>
```

Next, I will convert it to a simple YAML format.

###### 2.2.2.1 YAML Format Support

For simplicity, we can regard the function must has a return type. And for a unbound function, it is placed among the serviceRoot element. The parameters of the function have 2 properties MUST be defined: the name and the type. If a parameter is with a string type, you can only define the name for short.

So the unbound function GetAllProducts was converted as follows:

Example 4 - 3: the unbound function GetAllProducts with YAML format
```yaml
- name: GetAllProducts
  returns: product[]
```

This unbound function has no input parameter.

###### 2.2.2.2 JSON Format Support

If you define the function with YAML format correctly, the Model-first tool will convert it to JSON format. And you can see it is more complex than YAML format.

Example 4 - 4: the unbound function GetAllProducts with JSON format
```json
{
  "name": "GetAllProducts",
  "operationType": "Unbound",
  "type": "Function",
  "returns": "product[]"
}
```

###### 2.2.2.3 Swagger Format Support

Model-first tool will convert the JSON format converted from previous to Swagger format automatically. And It will replace the binding parameter with its keys instead.

Example 4 - 5: the unbound function GetAllProducts with Swagger format
```json
{
  "/GetAllProducts": {
    "get": {
      "tags": [
        "Function",
        "Unbound"
      ],
      "description": "Unbound function: GetAllProducts.",
      "parameters": [],
      "responses": {
        "200": {
          "description": "The function has been returned results.",
          "schema": {
            "type": "array",
            "items": {
            	"$ref": "#/definitions/product"
            }
          }
        },
        "204": {
        	"description": "The function is without a return type."
        },
        "400": {
        	"description": "A single entity function with a non-nullable return type has no result."
        },
        "4xx": {
        	"description": "A single-valued function with a non-nullable return type has no result, or a composable function the processing is stopped."
        }
      }
    }
  }
}
```