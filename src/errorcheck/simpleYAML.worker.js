//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------


var Sway = require('./index');

// Worker code from here
/* eslint-env worker */
onmessage = function(message) {
  Sway.create(message.data).then(function(api) {

    var results = api.validate();

    if (results.errors.length) {

      postMessage({
        specs: api.definitionFullyResolved || api.definitions,
        errors: sanitizeErrors(results.errors),
        warnings: results.warnings
      });
      return;
    }

    postMessage({
      errors: [],
      specs: api.definitionFullyResolved,
      warnings: results.warnings
    });
  })

  .catch(function(err) {
    postMessage({
      specs: message.data,
      warnings: [],
      errors: [{
        message: err.message,
        code: err.code ? 'ERROR_THROWN_BY_ERRORCHECK_CODE: ' + err.code :
          'UNCAUGHT_ERRORCHECK_WORKER_ERROR'
      }]
    });
  });
};

// Error object can not get serialized using the structured cloning algorithm,
// therefore we're removing them and appending the error message to our main
// error object.
function sanitizeErrors(errors) {
  if (!errors || !errors.length) {
    return [];
  }

  return errors.map(function(error) {
    if (error.err instanceof Error) {
      error.message = error.err.message;
      delete error.err;
    }
    specilizeError(error);
    return error;
  });
}

// For the error in an 'anyOf', we should find the specific error.
var inners=[];
function specilizeError(error)
{
  inners=[];
  if (error.inner == undefined) return;

  for(var index in error.inner)
  {
    inners[0] = {
      innerPath: error.inner[index].path,
      innerCode: error.inner[index].code,
      innerMessage: error.inner[index].message,
      innerDescription: error.inner[index].description,
      description: error.description
    };

    reverse(error.inner[index]);
  }

  var specificError=[];
  specificError.push(
  {
    path: inners[1].innerPath,
    code: inners[1].innerCode,
    message: inners[1].innerMessage,
    description: inners[1].description,
    innerDescription: inners[1].innerDescription
  });
  
  for(var i=2;i<inners.length;i++)
  {
    if(inners[i].innerPath.length < specificError[0].path.length) continue;
    
    if(inners[i].innerPath.length > specificError[0].path.length)
    {
      specificError = [];
    }

    specificError.push(
    {
      path: inners[i].innerPath.slice(0),
      code: inners[i].innerCode.slice(0),
      message: inners[i].innerMessage.slice(0),
      description: inners[i].description.slice(0),
      innerDescription: !!(inners[i].innerDescription)?inners[i].innerDescription.slice(0): inners[i].innerDescription
    });
  }
  error.path=specificError[0].path;
  error.code=specificError[0].code;
  error.message=specificError[0].message;
  

  if(specificError.length > 1)
  {
    error.description=specificError[0].description;
    specificError.forEach(function(value){
      error.description+=(value.innerDescription?'<br>' + value.innerDescription+'<br>&nbsp;&nbsp;'+value.message:value.message);
    })
  }
  else
  {
    error.description=(specificError[0].innerDescription?
      specificError[0].innerDescription+'<br>&nbsp;&nbsp;'+specificError[0].message
      :specificError[0].message);
  }
}

function reverse(error)
{
  if(error.inner)
  { 
    if(error.description)
    {
      inners[0].description=error.description;
    }
    for(var index in error.inner)
    {
      inners[0].innerPath.pop();
      inners[0].innerPath=inners[0].innerPath.concat(error.inner[index].path);
      reverse(error.inner[index]);
      for(var i = 0; i < error.inner[index].path.length - 1; i++)
      {
        inners[0].innerPath.pop();
      }
    }
  }
  else
  {
    inners.push({
      innerPath: inners[0].innerPath.concat(),
      innerCode: error.code.slice(0),
      innerMessage: error.message.slice(0),
      innerDescription: !!(error.description)?error.description.slice(0):error.description,
      description: inners[0].description
    });
  }
}

