# Model-first REST APIs

## What is model-first?

Model-first is a methodology for taking a resource model and producing a highly consistent API definition from the resource model. It is currently intended to address pain points in the early design phase of a REST API. Model-first is accompanied by an MIT licensed open source JavaScript implementation. The methodology and high-level architecture of the implementation are described here.

## Why model-first?

A model-first approach to building REST APIs would dramatically reduce the amount of time necessary to close on the design of a REST API ***before*** beginning to build the REST API. With a model-first approach, a developer can propose a resource model for the API and immediately visualize URLs, operations, and sample payloads. This enables a very tight prototype-evaluate loop in which the first stages of development focus on the resource model and use the conventions from OData to determine the *REST* of the API. ;)

The model-first approach has four primary goals:

1. Lower the bar as far as possible
2. Dramatically improve API consistency
3. Iterate on design in real-time
4. Complement current API tooling

### Lower the bar

One of the biggest problems with REST API design is that few developers have significant experience designing REST APIs. It's common for us to talk to teams who realize they need to build a REST API, and rather than go hire someone with experience, they assign a team member with bandwidth to go build the API.

This provides a clear opportunity: we can help these developers who have no experience building REST APIs. We do this by removing as much of the concept count as possible. New REST API developers are incapable of making decisions such as which update style to use.

There are two things the current tool requires that may not be in an existing developer's toolset, both of which we think average developers can learn in less than 30 minutes:

1. The current input for the tool is YAML. If developers don't know how to type YAML, they will need to ramp up in that area. Fortunately most developers can mimic existing examples to minimize the learning curve here.
2. The model-first approach requires the developer to list the major endpoints as a starting point for producing an API design. This is most certainly a REST API concept, and one that we haven't found a way around, but fortunately it's not a difficult concept.

### Improve API consistency

Most companies run into a problem with API consistency by the time they design their second API, if not sooner. These inconsistencies range from minor (e.g., casing rules) to major (e.g., query syntax).

A tool that applies conventions to a resource model has the ability to dramatically improve API consistency because by definition it always uses the same conventions. At this point in time the model-first tool only addresses the major points of consistency. In the future we may decide to handle minor points of consistency as well.

### Iterate in real-time

One of the first things people notice about the model-first tool is the ability to iterate in real-time. We see many developers trying to design the API up-front and get signoff on the "API contract". Oftentimes this means that the developer spends a significant amount of time writing up an initial proposal only to be told in the first API review that properties need to be a different casing or dasherized. The developer then has to go away, edit their API specification (often a markdown or similar text-based document), and reschedule the API review.

The model-first prevents this problem by keeping the input syntax terse and focused on the resource model. In many cases this means that developers can make the necessary changes during the API review and move on to more important discussions about the API.

### Complement current tooling

Last but not least, we believe the model-first tool should complement existing tooling. We are most definitely not trying to create a new API definition format; [OAS][oas] fills that niche nicely.

#### Why another tool?

Developers familiar with the industry are likely aware of a number of related tools, such as the [Swagger Editor][swagger-editor], [Mulesoft's API Designer][api-designer], and others. These are great tools but they demand focus on parts of the API that should be standardized. This tool will use the conventions in the OData grammar to fill in the vast majority of the gaps.

In very specific terms, this tool will allow you to focus on your resource model and let OData worry about the paths, response codes, et cetera. This means you will only need 10-25% of the input to get the same amount of specification.

## What are you selling?

We're building this because we want to see more consistent, machine-readable REST APIs, and we think OData is the way to achieve this. We want to help people get past the name (OData's not just for relational data) and some of the FUD (OData isn't inherently slow and XML-based) so that they can see OData for what it is: a set of standardized conventions that ensure your REST API can grow into future needs, and can operate with generic hypermedia clients. We think that if REST API developers and designers can invest 10 minutes to see what their REST API would look like, that many would be convinced of the value of the OData conventions.

## Architectural overview

Currently this tool is implemented as a JavaScript library. We have integrated it with the Swagger Editor so that we don't need to build a UI yet, but it is generic enough that it should work in any UI that takes an input and renders an output. Other "UI hosts" could include a text editor, proprietary tooling from API management vendors, or even a REST API stack.

The library is designed to be extensible. It accepts an arbitrary input, applies an arbitrary set of conventions, and emits an arbitrary output. The library ships with built-in support for one input, one set of conventions, and one output. These are all discussed below.

### Inputs

The inputs for the model-first approach are a required resource model and optional fixture data. The resource model is constructed using a very terse YAML-based syntax, and fixture data in JSON format can supplement the resource model. If the fixture data is provided, it will be used in both online and offline generated content. If no fixture data is provided, sample data will be generated according to the resource model.

#### Resource model

The resource model must be provided as the primary input to the model-first approach. The resource model allows REST API designers to prescribe:

##### Structural types

Structural types (that is, a non-primitive type) are declared in the `types` section of the YAML document. Every structural type is required to have a `name`, and can optionally specify `key`, `requiredProperties`, and `optionalProperties`. The properties do not distinguish between hypermedia vs. embedded structures as this can be inferred. Properties are assumed to be of `string` type unless specified otherwise.

For example:

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

##### Enums

Enums are declared along with structural types in the `types` section. Enums must have a `name` and an array of `members`. A value may be specified for the member if necessary.


For example:

```yaml
types:
  - name: gender
    members: [unknown, male, female]
  - name: permissions
    members: [{name: none, value: 0}, read, write]
    flags: true
```
##### Operations

Operations are either attached to `types` or declared in the `root` section of the YAML document. All oprations are required to have a `name` and may specify `parameters`. If the operation returns something, that should be specified with a `returns` section.

For example:

```yaml
operations:
  - name: getTasksAssignedTo
    params: assignedTo # Like properties on structural types, we assume string if the type is unspecified.
    returns: task[]
```

##### Endpoints

The API root contains the "starting points", commonly known as endpoints, of the REST API. Endpoints are ceclared in the `root` section. A root is capable of containing `collections`, `singletons`, and `operations`. Both collections and singletons require both a `name` and a `type`, whereas operations only require the `name` of the operation.

For example:

```yaml
root:
  - name: me
    type: person
  - name: people
    type: person[]
  - name: tasks
    type: task[]
```

#### Fixtures

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

### Conventions

By default, the tool will ship with a set of OData conventions that augment the resource model with the necessary information to generate a consistent API. For instance, OData says that collections of items with keys should support both `GET /{collection}` and `GET /{collection}/{id}`. Similarly, OData says that if you want to create a new resource, you should post it to a collection URL.

OData is documented thoroughly at [odata.org](http://odata.org). Additional assumptions that are used in the built-in conventions are documented in [assumptions.md](assumptions.md).

### Outputs

Once a model and accompanying fixture data has been supplied, the developer is immediately able to generate any number of output artifacts.

The currently supported output is a Swagger 2.0 API description. Since this JSON is simply Swagger 2.0, all existing Swagger tooling works with it, including the scaffolders in the Swagger editor.

However, there could be many other outputs, some of which are mentioned below.  

#### Developer console

One of the most useful long-term artifacts is the ability to generate a developer console similar to those used by the world's most popular REST APIs. For instance: ![Twitter API Explorer][twitter-api-explorer]

#### API documentation

The first thing API designers often need is to produce documentation. Frequently this documentation is used in API reviews or general usability studies, so it's nice to be able to output documentation to many formats: markdown, Word, PDF, and of course the ubiquitous HTML documentation so prevalent for today's REST APIs.

#### Scaffolding (server, client)

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
[oas]: http://openapi.org
