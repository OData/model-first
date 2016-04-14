#Info Object - Model-first Tooling

##1.	Core JSON Model Info Object fields in api Object
The core JSON model uses word api instead of info as the root level container element:

```JSON
 "api":{
    "name": "TripPin OData Reference Service"
    "version": {
      "current": 0
    },
    "description": "TripPin is a fictional reference service demonstrating the capabilities of OData v4."
    "namespace": "Microsoft.OData.SampleService.Models.TripPin"
    "termsOfService": "http://swagger.io/terms/"
    "contact": {
        "name": "API Support"
        "url": "http://www.swagger.io/support"
        "email": "support@swagger.io"
    }
    "license": {
        "name": "Apache 2.0"
        "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
     }
  }
```

The following top level element is defined:

----------------------------
Field Name|	Description
-----------|----------------
api	| Provides metadata about the API. The metadata can be used by the clients if needed
------------------------------------------------------------

Three required fields within api.

----------------------------
Field Name|	Description
-----------|----------------
name	| Required. The title of the application.
version	| Required. Provides the version of the application API (not to be confused with the specification version). Default value is "0.0.0.0".
namespace | Required. The namespace of the application API. Corresponding to the Namespace attribute in [CSDL Section 5.1.1 Attribute Namespace](http://docs.oasis-open.org/odata/odata/v4.0/errata02/os/complete/part3-csdl/odata-v4.0-errata02-os-part3-csdl-complete.html#_Toc406397948)) Default value is "Default.Namespace".
------------------------------------------------------------

Two formats of version available:

1. Use current property as showne in the above sample.
2. Show version numbers directly as the value of version.

```JSON
version: "1.0"
```

For other fields within api see section 3.1.

##2.	YAML Format Info Object fields in api Object
Simple YAML also uses keyword api instead of info as top level element.

Here is a YAML sample:

```YAML
api:
  name: TripPin OData Reference Service
  version:
    current: 0.0.0.0
  description: TripPin is a fictional reference service demonstrating the capabilities of OData v4.
  namespace: Microsoft.OData.SampleService.Models.TripPin
  termsOfService: http://swagger.io/terms/
  contact:
    name: API Support
    url: http://www.swagger.io/support
    email: support@swagger.io
  license:
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0.html
```

The following top level element is defined:

----------------------------
Field Name|	Description|
-----------|----------------
api	| Provides metadata about the API. The metadata can be used by the clients if needed
------------------------------------------------------------

Three required fields within api.

----------------------------
Field Name|	Description
-----------|----------------
name	| Required. The title of the application.
version	| Required. Provides the version of the application API (not to be confused with the specification version). Default value is "0.0.0.0".
namespace | Required. The namespace of the application API. Default value is "Default.Namespace".
------------------------------------------------------------

Two formats of version available:

1. Use current property as showne in the above sample.
2. Show version numbers directly as the value of version.

```YAML
version: 1.0
```

For other fields within api see section 3.1.

##3.	Swagger Format Info Object support
Swagger is supported as one of the output formats, here converting core model to a Swagger schema uses the one-to-one mapping. 

Note: Swagger does not have the namespace field in the info object.

Here is 1 sample of an info element:

```SWAGGER
info: {
  "title": "Swagger Sample App",
  "description": "This is a sample server Petstore server.",
  "termsOfService": "http://swagger.io/terms/",
  "contact": {
    "name": "API Support",
    "url": "http://www.swagger.io/support",
    "email": "support@swagger.io"
  },
  "license": {
    "name": "Apache 2.0",
    "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
  },
  "version": "1.0.1"
}
```

Here is how JSON model is mapped to a Swagger schema:

----------------------------
Field Name|	Description|
-----------|----------------
info	| The info object for metadata about the API, would be converted from info element from core model. See details below. Corresponds to the api element in simple YAML and JSON model.
------------------------------------------------------------

###3.1	info Fields
As per swagger spec, info object element is required and provides metadata about the API. A JSON object contains key-value pair from an info object name to a schema object.

Fixed Fields

----------------------------
Field Name|	Type |Description
-----------|-----|-----------
title	|string|	Required. The title of the application, corresponding to the name field in simple YAML and JSON model.
description	|string|	A short description of the application. GFM syntax can be used for rich text representation.
termsOfService	|string|	The Terms of Service for the API.
contact	|Contact Object| The contact information for the exposed API.
license	|License Object| The license information for the exposed API.
version	|string|	Required. Provides the version of the application API (not to be confused with the specification version). Default value is "0.0.0.0".
----------------------------------------------------------------------------------------------------------------------------------------

Contact Object
Contact information for the exposed API.

Fixed Fields

----------------------------
Field Name|	Type |Description
-----------|-----|-----------
name	|string|	The identifying name of the contact person/organization.
url	|string|	The URL pointing to the contact information. MUST be in the format of a URL.
email	|string|	The email address of the contact person/organization. MUST be in the format of an email address.
--------------------------------------------------------------------------------------------------

License Object
License information for the exposed API.

Fixed Fields

----------------------------
Field Name|	Type |Description
-----------|-----|-----------
name	|string|	Required. The license name used for the API.
url	|string|	A URL to the license used for the API. MUST be in the format of a URL.
-------------------------------------------------------------------------------------
