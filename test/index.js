'use strict';

require('src/index');
require('node_modules/js-yaml/dist/js-yaml.min.js');
require('node_modules/yaml-js/yaml.min.js');
require('node_modules/yaml-worker/index.js');



require('modules/conventionSpec');
require('modules/modCsdlSpec');
require('modules/modSwaggerSpec');
require('modules/modYamlSpec');

require('codegen/castToMethodSpec');
require('codegen/csharpClientCodegenSpec');
require('codegen/csharpServerCodegenSpec');
require('codegen/entityContainerSpec');