//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

require('./src/morpho');
require('./src/visitor');
require('./src/modules/modCsdl');
require('./src/modules/modJson');
require('./src/modules/modSwagger');
require('./src/modules/modYaml');
require('./src/conventions/convAddDefaults');
module.exports = Morpho;
