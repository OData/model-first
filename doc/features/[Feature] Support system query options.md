# OData Design Specification – Model-first Tooling

## System Query Option Part

### 1. Design Summary

#### 1.1 Overview

This part is to discuss about how to support OData system query options .

#### 1.2 Goals

+ Add support of **OData system query options** for the Model-first tool show as below. The names of all system query options are prefixed with a dollar(```$```) character.
	+ ```$filter```
	+ ```$expand```
    + ```$select```
    + ```$orderby```
    + ```$top```
    + ```$skip```
    + ```$count```
    + ```$search ```
    + ```$format``` 
    
+ Support use ```GET```  request following resource paths:
	+ Singleton 	[^P1]
	+ Collection of entities (entityset) [^P1]
	+ Function return resource path for each return type: [^P2]
		+ Singleton
		+ complex type instance
		+ collection of primitive type
		+ collection of entities (entityset)
		+ collection of complex type instance
+ NOT support nested query options yet.

### 2. Design Details

According to OData system query options, for ```GET```  requests the following rules apply (refer to [OData version4.0 part2](http://docs.oasis-open.org/odata/odata/v4.0/errata02/os/complete/part2-url-conventions/odata-v4.0-errata02-os-part2-url-conventions-complete.html#_Toc406398093)):

* Resource paths identifying **a single entity(singleton)**, allow```$expand```, ```$select``` and ```$format```.
* Resource paths identifying **a complex type instance** allow ```$expand``` ,  ```$select``` and ```$format```.
* Resource paths identifying **collection of primitive type** allow  ```$filter```, ```$orderby``` ,```$skip```, ```$top```, ```$count``` and ```$format```.
* Resource paths identifying **collection of entities**  allow ```$expand```, ```$select```, ```$filter```, ```$orderby``` ,```$skip```, ```$top```, ```$count```,```$search```and ```$format```.
* Resource paths identifying **collection of complex type instance**  allow ```$expand```, ```$select```, ```$filter```, ```$orderby``` ,```$skip```, ```$top```, ```$count```and ```$format```.


> ```/$count``` which address the count of a collection, NOT support yet in current version of model-first tool.
	
	 
-------------------------------------------
 For different source paths, allow system query options show as following table:
 
|system query option| singleton| complex type instance| collection of primitive type | entityset | collection of complex type|
|:-----|:-----:|:-----:|:-----:|:-----:|:-----:|
|$select | allow | allow | no | allow | allow |
|$expand | allow | allow | no | allow | allow |
|$filter | no| no | allow | allow | allow |
|$orderby | no | no | allow | allow | allow |
|$top | no | no | allow | allow | allow |
|$skip | no | no | allow | allow | allow |
|$count | no| no | allow | allow | allow |
|$search |no | no| no | allow |no|
|$format | allow | allow | allow | allow | allow |




#### 2.1  SWAGGER Format Support
 Support ```GET```  requests with source paths identifying **singleton**,**entityset**.
 
 Support ```GET```  requests with source paths for```function```(not include return source of  ```primitive type```).


#### 2.1.1 query for singleton

Single entity support query options in following order,  every query parameter is optional to choose. 

1. ```$select```
2. ```$expand```
3. ```$format``` 

Example:
 
```json

    "paths": {
        "/SingletonName": {
            "get": {
                "description": "return a specific info query from collection, use %20 instead of space when input a string",
                "parameters": [
					{
                        "name": "$expand",
                        "description": "system query option $expand, a comma-separated list of navigation property names",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$select",
                        "description": "system query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
					{
                        "name": "$format",
                        "description": "system query option $format such as json, application/json, application/json;odata.metadata=full",
                        "in": "query",
                        "type": "string",
                        "required": "false" 
                    }
                ],
     
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }  
    }         
```
#### 2.1.2 query for entityset
Collection of entities (entityset) support query options in following order,  every query parameter is optional to choose.
 
1. ```$select```
2. ```$expand```
3. ```$filter``` 
4. ```$orderby```
5. ```$top```
6. ```$skip```
7. ```$count```
8. ```$search ```
9. ```$format```


Example:

```json

    "paths": {
        "/EntitySetName": {
            "get": {
                "description": "return a specific info query from collection, use %20 instead of space when input a string",
                "parameters": [
                    {
                        "name": "$filter",
                        "description": "system query option $filter, one or a set of built-in filter operations and functions",
                        "in": "query",
                        "type": "string" ,
                        "required": "false"
                    },
                    {
                        "name": "$expand",
                        "description": "system query option $expand, a comma-separated list of navigation property names",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$select",
                        "description": "system query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$orderby",
                        "description": "system query option $orderby, The expression can include the suffix asc for ascending or desc for descending, separated from the  property name by one or more spaces. ",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$top",
                        "description": "system query option $top, number of items returned from a collection",
                        "in": "query",
                        "type": "number", 
                        "required": "false"        
                    },
                    {
                        "name": "$skip",
                        "description": "system query option $skip, the service returns items starting at position n+1",
                        "in": "query",
                        "type": "number",
                        "required": "false"
                    },
                    {
                        "name": "$count",
                        "description": "system query option $count, with a value of true specifies that the total count of items within the collection, false (or not specified) means not reutrn a count",
                        "in": "query",
                        "type": "boolean",
                        "required": "false"
                    },
                    {
                        "name": "$search",
                        "description": "system query option $search, restricts the result to include only those entities matching the specified search expression",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$format",
                        "description": "system query option $format such as json, application/json, application/json;odata.metadata=full",
                        "in": "query",
                        "type": "string",
                        "required": "false" 
                    }
                ],
     
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }  
    }         
```    
#### 2.1.3 query for function return resource
Support ```GET```  requests with source paths for```function```(not include return primitive type).

##### 2.1.3.1 query singleton
When ```function```  return type is  **entity type** , support query options in following order,  every query parameter is optional to choose.

1. ```$select```
2. ```$expand```
3. ```$format``` 
 
Example:

```json

    "paths": {
        "/SingletonName": {
            "get": {
                "description": "return a specific info query from collection, use %20 instead of space when input a string",
                "parameters": [
                     {
                        "name": "$expand",
                        "description": "system query option $expand, a comma-separated list of navigation property names",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$select",
                        "description": "system query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
					{
                        "name": "$format",
                        "description": "system query option $format such as json, application/json, application/json;odata.metadata=full",
                        "in": "query",
                        "type": "string",
                        "required": "false" 
                    }
                ],
     
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }  
    }         
```

##### 2.1.3.2 query complex type instance

When ```function```  return type is  **complex type** , support query options in following order,  every query parameter is optional to choose.

1. ```$select```
2. ```$expand```
3. ```$format``` 
 
Example:

```json

    "paths": {
        "/ComplexTypeName": {
            "get": {
                "description": "return a specific info query from collection, use %20 instead of space when input a string",
                "parameters": [
					{
                        "name": "$expand",
                        "description": "system query option $expand, a comma-separated list of navigation property names",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$select",
                        "description": "system query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
					{
                        "name": "$format",
                        "description": "system query option $format such as json, application/json, application/json;odata.metadata=full",
                        "in": "query",
                        "type": "string",
                        "required": "false" 
                    }
                ],
     
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }  
    }         
```

##### 2.1.3.3 query collection of primitive type
 When ```function```  return type is  **collection of primitive type** , support query options in following order,  every query parameter is optional to choose.
  
1. ```$filter``` 
2. ```$orderby```
3. ```$top```
4. ```$skip```
5. ```$count```
6. ```$format```


Example:

```json

    "paths": {
        "/PrimitiveCollectionName": {
            "get": {
                "description": "return a specific info query from collection, use %20 instead of space when input a string",
                "parameters": [
                    {
                        "name": "$filter",
                        "description": "system query option $filter, one or a set of built-in filter operations and functions",
                        "in": "query",
                        "type": "string" ,
                        "required": "false"
                    },
                    {
                        "name": "$orderby",
                        "description": "system query option $orderby, The expression can include the suffix asc for ascending or desc for descending, separated from the  property name by one or more spaces. ",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$top",
                        "description": "system query option $top, number of items returned from a collection",
                        "in": "query",
                        "type": "number", 
                        "required": "false"        
                    },
                    {
                        "name": "$skip",
                        "description": "system query option $skip, the service returns items starting at position n+1",
                        "in": "query",
                        "type": "number",
                        "required": "false"
                    },
                    {
                        "name": "$count",
                        "description": "system query option $count, with a value of true specifies that the total count of items within the collection, false (or not specified) means not reutrn a count",
                        "in": "query",
                        "type": "boolean",
                        "required": "false"
                    },
                    {
                        "name": "$format",
                        "description": "system query option $format such as json, application/json, application/json;odata.metadata=full",
                        "in": "query",
                        "type": "string",
                        "required": "false" 
                    }
                ],
     
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }  
    }         
```    
##### 2.1.3.4 query entityset
 When ```function```  return type is  **collection of entity type** , support query options in following order,  every query parameter is optional to choose.
  
1. ```$select```
2. ```$expand```
3. ```$filter``` 
4. ```$orderby```
5. ```$top```
6. ```$skip```
7. ```$count```
8. ```$search ```
9. ```$format```


Example:

```json

    "paths": {
        "/EntitySetName": {
            "get": {
                "description": "return a specific info query from collection, use %20 instead of space when input a string",
                "parameters": [
                    {
                        "name": "$filter",
                        "description": "system query option $filter, one or a set of built-in filter operations and functions",
                        "in": "query",
                        "type": "string" ,
                        "required": "false"
                    },
                    {
                        "name": "$expand",
                        "description": "system query option $expand, a comma-separated list of navigation property names",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$select",
                        "description": "system query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$orderby",
                        "description": "system query option $orderby, The expression can include the suffix asc for ascending or desc for descending, separated from the  property name by one or more spaces. ",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$top",
                        "description": "system query option $top, number of items returned from a collection",
                        "in": "query",
                        "type": "number", 
                        "required": "false"        
                    },
                    {
                        "name": "$skip",
                        "description": "system query option $skip, the service returns items starting at position n+1",
                        "in": "query",
                        "type": "number",
                        "required": "false"
                    },
                    {
                        "name": "$count",
                        "description": "system query option $count, with a value of true specifies that the total count of items within the collection, false (or not specified) means not reutrn a count",
                        "in": "query",
                        "type": "boolean",
                        "required": "false"
                    },
                    {
                        "name": "$search",
                        "description": "system query option $search, restricts the result to include only those entities matching the specified search expression",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$format",
                        "description": "system query option $format such as json, application/json, application/json;odata.metadata=full",
                        "in": "query",
                        "type": "string",
                        "required": "false" 
                    }
                ],
     
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }  
    }         
```    
##### 2.1.3.5 query collection of complex type
 When ```function```  return type is  **collection of complex type** , support query options in following order,  every query parameter is optional to choose.
  
1. ```$select```
2. ```$expand```
3. ```$filter``` 
4. ```$orderby```
5. ```$top```
6. ```$skip```
7. ```$count```
8. ```$format```


Example:

```json

    "paths": {
        "/ComplexTypeColloectionName": {
            "get": {
                "description": "return a specific info query from collection, use %20 instead of space when input a string",
                "parameters": [
                    {
                        "name": "$filter",
                        "description": "system query option $filter, one or a set of built-in filter operations and functions",
                        "in": "query",
                        "type": "string" ,
                        "required": "false"
                    },
                    {
                        "name": "$expand",
                        "description": "system query option $expand, a comma-separated list of navigation property names",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$select",
                        "description": "system query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$orderby",
                        "description": "system query option $orderby, The expression can include the suffix asc for ascending or desc for descending, separated from the  property name by one or more spaces. ",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$top",
                        "description": "system query option $top, number of items returned from a collection",
                        "in": "query",
                        "type": "number", 
                        "required": "false"        
                    },
                    {
                        "name": "$skip",
                        "description": "system query option $skip, the service returns items starting at position n+1",
                        "in": "query",
                        "type": "number",
                        "required": "false"
                    },
                    {
                        "name": "$count",
                        "description": "system query option $count, with a value of true specifies that the total count of items within the collection, false (or not specified) means not reutrn a count",
                        "in": "query",
                        "type": "boolean",
                        "required": "false"
                    },
                    {
                        "name": "$format",
                        "description": "system query option $format such as json, application/json, application/json;odata.metadata=full",
                        "in": "query",
                        "type": "string",
                        "required": "false" 
                    }
                ],
     
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }  
    }         
```    





# OData Design Specification – Model-first Tooling

## System Query Option Part

### 1. Design Summary

#### 1.1 Overview

This part is to discuss about how to support OData system query options .

#### 1.2 Goals

+ Add support of **OData system query options** for the Model-first tool show as below. The names of all system query options are prefixed with a dollar(```$```) character.
	+ ```$filter```
	+  ```$expand```
    + ```$select```
    + ```$orderby```
    + ```$top```
    + ```$skip```
    + ```$count```
    + ```$search ```
    + ```$format``` 
    
+ Support use ```GET```  request following resource paths:
	+ Singleton 	[^P1]
	+ Collection of entities (entityset) [^P1]
	+ Function return resource path for each return type: [^P2]
		+ Singleton
		+ complex type instance
		+ collection of primitive type
		+ collection of entities (entityset)
		+ collection of complex type instance
+ NOT support nested query options yet.

### 2. Design Details

According to OData system query options, for ```GET```  requests the following rules apply (refer to [OData version4.0 part2](http://docs.oasis-open.org/odata/odata/v4.0/errata02/os/complete/part2-url-conventions/odata-v4.0-errata02-os-part2-url-conventions-complete.html#_Toc406398093)):

* Resource paths identifying **a single entity(singleton)**, allow```$expand```, ```$select``` and ```$format```.
* Resource paths identifying **a complex type instance** allow ```$expand``` ,  ```$select``` and ```$format```.
* Resource paths identifying **collection of primitive type** allow  ```$filter```, ```$orderby``` ,```$skip```, ```$top```, ```$count``` and ```$format```.
* Resource paths identifying **collection of entities**  allow ```$expand```, ```$select```, ```$filter```, ```$orderby``` ,```$skip```, ```$top```, ```$count```,```$search```and ```$format```.
* Resource paths identifying **collection of complex type instance**  allow ```$expand```, ```$select```, ```$filter```, ```$orderby``` ,```$skip```, ```$top```, ```$count```and ```$format```.


> ```/$count``` which address the count of a collection, NOT support yet in current version of model-first tool.
	
	 
-------------------------------------------
 For different source paths, allow system query options show as following table:
 
|system query option| singleton| complex type instance| collection of primitive type | entityset | collection of complex type|
|:-----|:-----:|:-----:|:-----:|:-----:|:-----:|
|$select | allow | allow | no | allow | allow |
|$expand | allow | allow | no | allow | allow |
|$filter | no| no | allow | allow | allow |
|$orderby | no | no | allow | allow | allow |
|$top | no | no | allow | allow | allow |
|$skip | no | no | allow | allow | allow |
|$count | no| no | allow | allow | allow |
|$search |no | no| no | allow |no|
|$format | allow | allow | allow | allow | allow |




#### 2.1  SWAGGER Format Support
 Support ```GET```  requests with source paths identifying **singleton**,**entityset**.
 
 Support ```GET```  requests with source paths for```function```(not include return source of  ```primitive type```).


#### 2.1.1 query for singleton

Single entity support query options in following order,  every query parameter is optional to choose. 

1. ```$select```
2. ```$expand```
3. ```$format``` 

Example:
 
```json

    "paths": {
        "/SingletonName": {
            "get": {
                "description": "return a specific info query from collection, use %20 instead of space when input a string",
                "parameters": [
					{
                        "name": "$expand",
                        "description": "system query option $expand, a comma-separated list of navigation property names",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$select",
                        "description": "system query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
					{
                        "name": "$format",
                        "description": "system query option $format such as json, application/json, application/json;odata.metadata=full",
                        "in": "query",
                        "type": "string",
                        "required": "false" 
                    }
                ],
     
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }  
    }         
```
#### 2.1.2 query for entityset
Collection of entities (entityset) support query options in following order,  every query parameter is optional to choose.
 
1. ```$select```
2. ```$expand```
3. ```$filter``` 
4. ```$orderby```
5. ```$top```
6. ```$skip```
7. ```$count```
8. ```$search ```
9. ```$format```


Example:

```json

    "paths": {
        "/EntitySetName": {
            "get": {
                "description": "return a specific info query from collection, use %20 instead of space when input a string",
                "parameters": [
                    {
                        "name": "$filter",
                        "description": "system query option $filter, one or a set of built-in filter operations and functions",
                        "in": "query",
                        "type": "string" ,
                        "required": "false"
                    },
                    {
                        "name": "$expand",
                        "description": "system query option $expand, a comma-separated list of navigation property names",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$select",
                        "description": "system query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$orderby",
                        "description": "system query option $orderby, The expression can include the suffix asc for ascending or desc for descending, separated from the  property name by one or more spaces. ",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$top",
                        "description": "system query option $top, number of items returned from a collection",
                        "in": "query",
                        "type": "number", 
                        "required": "false"        
                    },
                    {
                        "name": "$skip",
                        "description": "system query option $skip, the service returns items starting at position n+1",
                        "in": "query",
                        "type": "number",
                        "required": "false"
                    },
                    {
                        "name": "$count",
                        "description": "system query option $count, with a value of true specifies that the total count of items within the collection, false (or not specified) means not reutrn a count",
                        "in": "query",
                        "type": "boolean",
                        "required": "false"
                    },
                    {
                        "name": "$search",
                        "description": "system query option $search, restricts the result to include only those entities matching the specified search expression",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$format",
                        "description": "system query option $format such as json, application/json, application/json;odata.metadata=full",
                        "in": "query",
                        "type": "string",
                        "required": "false" 
                    }
                ],
     
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }  
    }         
```    
#### 2.1.3 query for function return resource
Support ```GET```  requests with source paths for```function```(not include return primitive type).

##### 2.1.3.1 query singleton
When ```function```  return type is  **entity type** , support query options in following order,  every query parameter is optional to choose.

1. ```$select```
2. ```$expand```
3. ```$format``` 
 
Example:

```json

    "paths": {
        "/SingletonName": {
            "get": {
                "description": "return a specific info query from collection, use %20 instead of space when input a string",
                "parameters": [
                     {
                        "name": "$expand",
                        "description": "system query option $expand, a comma-separated list of navigation property names",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$select",
                        "description": "system query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
					{
                        "name": "$format",
                        "description": "system query option $format such as json, application/json, application/json;odata.metadata=full",
                        "in": "query",
                        "type": "string",
                        "required": "false" 
                    }
                ],
     
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }  
    }         
```

##### 2.1.3.2 query complex type instance

When ```function```  return type is  **complex type** , support query options in following order,  every query parameter is optional to choose.

1. ```$select```
2. ```$expand```
3. ```$format``` 
 
Example:

```json

    "paths": {
        "/ComplexTypeName": {
            "get": {
                "description": "return a specific info query from collection, use %20 instead of space when input a string",
                "parameters": [
					{
                        "name": "$expand",
                        "description": "system query option $expand, a comma-separated list of navigation property names",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$select",
                        "description": "system query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
					{
                        "name": "$format",
                        "description": "system query option $format such as json, application/json, application/json;odata.metadata=full",
                        "in": "query",
                        "type": "string",
                        "required": "false" 
                    }
                ],
     
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }  
    }         
```

##### 2.1.3.3 query collection of primitive type
 When ```function```  return type is  **collection of primitive type** , support query options in following order,  every query parameter is optional to choose.
  
1. ```$filter``` 
2. ```$orderby```
3. ```$top```
4. ```$skip```
5. ```$count```
6. ```$format```


Example:

```json

    "paths": {
        "/PrimitiveCollectionName": {
            "get": {
                "description": "return a specific info query from collection, use %20 instead of space when input a string",
                "parameters": [
                    {
                        "name": "$filter",
                        "description": "system query option $filter, one or a set of built-in filter operations and functions",
                        "in": "query",
                        "type": "string" ,
                        "required": "false"
                    },
                    {
                        "name": "$orderby",
                        "description": "system query option $orderby, The expression can include the suffix asc for ascending or desc for descending, separated from the  property name by one or more spaces. ",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$top",
                        "description": "system query option $top, number of items returned from a collection",
                        "in": "query",
                        "type": "number", 
                        "required": "false"        
                    },
                    {
                        "name": "$skip",
                        "description": "system query option $skip, the service returns items starting at position n+1",
                        "in": "query",
                        "type": "number",
                        "required": "false"
                    },
                    {
                        "name": "$count",
                        "description": "system query option $count, with a value of true specifies that the total count of items within the collection, false (or not specified) means not reutrn a count",
                        "in": "query",
                        "type": "boolean",
                        "required": "false"
                    },
                    {
                        "name": "$format",
                        "description": "system query option $format such as json, application/json, application/json;odata.metadata=full",
                        "in": "query",
                        "type": "string",
                        "required": "false" 
                    }
                ],
     
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }  
    }         
```    
##### 2.1.3.4 query entityset
 When ```function```  return type is  **collection of entity type** , support query options in following order,  every query parameter is optional to choose.
  
1. ```$select```
2. ```$expand```
3. ```$filter``` 
4. ```$orderby```
5. ```$top```
6. ```$skip```
7. ```$count```
8. ```$search ```
9. ```$format```


Example:

```json

    "paths": {
        "/EntitySetName": {
            "get": {
                "description": "return a specific info query from collection, use %20 instead of space when input a string",
                "parameters": [
                    {
                        "name": "$filter",
                        "description": "system query option $filter, one or a set of built-in filter operations and functions",
                        "in": "query",
                        "type": "string" ,
                        "required": "false"
                    },
                    {
                        "name": "$expand",
                        "description": "system query option $expand, a comma-separated list of navigation property names",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$select",
                        "description": "system query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$orderby",
                        "description": "system query option $orderby, The expression can include the suffix asc for ascending or desc for descending, separated from the  property name by one or more spaces. ",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$top",
                        "description": "system query option $top, number of items returned from a collection",
                        "in": "query",
                        "type": "number", 
                        "required": "false"        
                    },
                    {
                        "name": "$skip",
                        "description": "system query option $skip, the service returns items starting at position n+1",
                        "in": "query",
                        "type": "number",
                        "required": "false"
                    },
                    {
                        "name": "$count",
                        "description": "system query option $count, with a value of true specifies that the total count of items within the collection, false (or not specified) means not reutrn a count",
                        "in": "query",
                        "type": "boolean",
                        "required": "false"
                    },
                    {
                        "name": "$search",
                        "description": "system query option $search, restricts the result to include only those entities matching the specified search expression",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$format",
                        "description": "system query option $format such as json, application/json, application/json;odata.metadata=full",
                        "in": "query",
                        "type": "string",
                        "required": "false" 
                    }
                ],
     
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }  
    }         
```    
##### 2.1.3.5 query collection of complex type
 When ```function```  return type is  **collection of complex type** , support query options in following order,  every query parameter is optional to choose.
  
1. ```$select```
2. ```$expand```
3. ```$filter``` 
4. ```$orderby```
5. ```$top```
6. ```$skip```
7. ```$count```
8. ```$format```


Example:

```json

    "paths": {
        "/ComplexTypeColloectionName": {
            "get": {
                "description": "return a specific info query from collection, use %20 instead of space when input a string",
                "parameters": [
                    {
                        "name": "$filter",
                        "description": "system query option $filter, one or a set of built-in filter operations and functions",
                        "in": "query",
                        "type": "string" ,
                        "required": "false"
                    },
                    {
                        "name": "$expand",
                        "description": "system query option $expand, a comma-separated list of navigation property names",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$select",
                        "description": "system query option $select, is a comma-separated list of properties, qualified action names, qualified function names, the star operator (*), or the star operator prefixed with the namespace or alias of the schema in order to specify all operations defined in the schema",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$orderby",
                        "description": "system query option $orderby, The expression can include the suffix asc for ascending or desc for descending, separated from the  property name by one or more spaces. ",
                        "in": "query",
                        "type": "string",
                        "required": "false"
                    },
                    {
                        "name": "$top",
                        "description": "system query option $top, number of items returned from a collection",
                        "in": "query",
                        "type": "number", 
                        "required": "false"        
                    },
                    {
                        "name": "$skip",
                        "description": "system query option $skip, the service returns items starting at position n+1",
                        "in": "query",
                        "type": "number",
                        "required": "false"
                    },
                    {
                        "name": "$count",
                        "description": "system query option $count, with a value of true specifies that the total count of items within the collection, false (or not specified) means not reutrn a count",
                        "in": "query",
                        "type": "boolean",
                        "required": "false"
                    },
                    {
                        "name": "$format",
                        "description": "system query option $format such as json, application/json, application/json;odata.metadata=full",
                        "in": "query",
                        "type": "string",
                        "required": "false" 
                    }
                ],
     
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        }  
    }         
```    



























































