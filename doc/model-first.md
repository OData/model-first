# Model-first REST APIs

## Why model-first?

A model-first approach to building REST APIs would dramatically reduce the amount of time necessary to close on the design of a REST API ***before*** beginning to build the REST API. With a model-first approach, a developer can propose a resource model for the API and immediately visualize URLs, operations, and sample payloads. This enables a very tight prototype-evaluate loop in which the first stages of development focus on the resource model and use the conventions from OData to determine the REST of the API. ;)

## Why another tool?

Developers familiar with the industry are likely aware of a number of related tools, such as the [Swagger Editor][swagger-editor], [Mulesoft's API Designer][api-designer], and others. These are great tools but they demand focus on parts of the API that should be standardized. This tool will use the conventions in the OData grammar to fill in the vast majority of the gaps.

In very specific terms, this tool will allow you to focus on your resource model and let OData worry about the paths, response codes, et cetera. This means you will only need 25% of the input to get the same amount of specification.

## What are you selling?

OData. We want to help people get past the name (OData's not just for relational data) and some of the FUD (OData isn't inherently slow and XML-based) so that they can see OData for what it is: a set of standardized conventions that ensure your REST API can grow into future needs, and can operate with generic hypermedia clients. We think that if REST API developers and designers can invest 10 minutes to see what their REST API would look like, that many would be convinced of the value of the OData conventions.

## Inputs

The inputs for the model-first approach are a required resource model and optional fixture data. The resource model is constructed using a very terse YAML-based syntax, and fixture data in JSON format can supplement the resource model. If the fixture data is provided, it will be used in both online and offline generated content. If no fixture data is provided, sample data will be generated according to the resource model.

### Resource model

The resource model must be provided as the primary input to the model-first approach. The resource model allows REST API designers to prescribe:

#### Enums

Enums are declared at the top-level of the YAML document in the `enums` section. Enums must have a `name` and an array of `members`:

```yaml
enums:
  - name: gender
    members: [unknown, male, female]
  - name: permissions
    members: [{name: none, value: 0}, read, write]
    flags: true
```
#### Structural types

Entity and complex types have an extremely similar structure; in fact the only difference is that entity types have a `key` property. As such, they are declared in the `types` section of the YAML document. Every structural type is required to have a `name`, and can optionally specify `openType`, `keyProperties`, `requiredProperties`, and `optionalProperties`. The properties do not distinguish between navigation properties and structural properties as this can be inferred. Properties are assumed to be of `string` type unless specified otherwise.

```yaml
types:
  - name: person
    key: [id]
    requiredProperties: [{name: id, type: int64}, firstName, lastName, {name: joinedAt, type: dateTimeOffset}]
    optionalProperties:
      - bio
      - name: gender
        type: gender
      - name: friends
        type: person[]
      - name: tasks
        type: tasks[]
  - name: task
    key: id
    requiredProperties:
      - name: id
        type: int64
      - name
      - name: starred
        type: boolean
    optionalProperties:
      - name: dueDate
        type: date
      - description
      - name: createdBy
        type: person
      - name: assignedTo
        type: person
      - name: project
        type: project
  - name: project
    requiredProperties: name
    optionalProperties: [description, {name: dueDate, type: date}]
```

#### Operations

Operations are declared in the `functions` and `actions` sections of the YAML document. Both functions and actions are required to have a `name` and may specify `parameters`. Functions are required to specify `returns`; actions may do so as well.

```yaml
operations:
  - name: getFriendsTasks
    params: userName
    returns: task[]
```

#### Service root

Since the service root is the starting point of the REST API, it has a dedicated section in the YAML document. At the service root it is possible to expose `collections`, `singletons`, and `operations`. Both collections and singletons require both a `name` and a `type`, whereas operations only require the `name` of the function or action.

```yaml
serviceRoot:
  - name: me
    type: person
  - name: people
    type: person[]
  - name: tasks
    type: task[]
```

### Fixtures

Fixture data is typically created in the second phase of development, when a developer is ready to look at realistic inputs and outputs to a service. Fixture data is supplied as a single JSON document, for instance:

```json
{
  "person":[
    {
      "id": 1,
      "firstName": "Henry",
      "lastName": "Wright",
      "joinedAt": "2015-01-20T12:00:00Z"
    },
    {
      "id": 2,
      "firstName": "Sharon",
      "lastName": "Yang",
      "joinedAt": "2015-02-04T12:00:00Z",
      "gender": "female"
    },
    ...
  ],
  "task":[...]
}
```

## Output

Once a model and accompanying fixture data has been supplied, the developer is immediately able to generate any number of output artifacts.

### Developer console

One of the most useful long-term artifacts is the ability to generate a developer console similar to those used by the world's most popular REST APIs. For instance: ![Twitter API Explorer][twitter-api-explorer]

### API documentation

The first thing API designers often need is to produce documentation. Frequently this documentation is used in API reviews or general usability studies, so it's nice to be able to output documentation to many formats: markdown, Word, PDF, and of course the ubiquitous HTML documentation so prevalent for today's REST APIs.

### Scaffolding (server, client)

// TODO

## Intentional limitations

// TODO

### No namespacing

// TODO

### Limited annotations support

// TODO

### No type inheritance?

// TODO

## Extensibility

// TODO

## Principles of reuse

This tool should make every effort to avoid [NIH syndrome][nih]. Preferably the tool would be built using existing open source libraries.

### Swagger

If at all possible, the library should build on top of existing Swagger tooling.

Possible reasons not to do this:
* Can't get Swagger buy-in
* Resource model YAML is too clunky
* Too expensive

### Ember.js

Another very important library that should be considered for integration is the Ember.js framework.

[twitter-api-explorer]: https://ffeathers.files.wordpress.com/2015/01/twitter1.png "Twitter API Explorer"
[nih]: http://en.wikipedia.org/wiki/Not_Invented_Here "Not Invented Here Syndrome"
[swagger-editor]: http://editor.swagger.io/ "Swagger Editor"
[api-designer]: http://api-portal.anypoint.mulesoft.com/raml/api-designer?ref=apihub "Mulesoft API Designer"
