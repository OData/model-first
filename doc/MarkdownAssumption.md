## API Types
* GET API for service document.
* GET API for metadata.
* PUT/GET API for singleton.
* POST/GET API for entity set.
* GET/PUT/DELETE API for entity in a collection.
* GET/PUT API for primitive and complex property.
* POST/DELETE API for collection-valued navigation property.
* PUT API for singled-valued navigation property.
* GET API for function.
* POST API for Action.
* POST API for Batch.
* GET API for Delta request.

## API Properties
* Description: API desciption.
* Request URL: 
* Request Method: POST/GET/PUT/DELETE
* Parameter: KeyId, function/action parameter, delta token.
* Option: OData query option: $select, $expand, $orderby, $filter, $top, $skip, $count, $search
* Example: fake example.

## Format
* Common Markdown

## Some Open Questions:
* How to handle the Entity(Id)/NaviProp(Id)/NaviProp(Id)/...../NaviProp(Id)?
* How to handle infomation in header?
