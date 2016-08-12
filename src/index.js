//---------------------------------------------------------------------
// 
// Copyright (C) Microsoft Corporation. All rights reserved. See License.txt in the project root for license information.
// 
//---------------------------------------------------------------------

require('./morpho');
require('./visitor');
require('./modules/modCsdl');
require('./modules/modJson');
require('./modules/modSwagger');
require('./modules/modYaml');
require('./conventions/convAddDefaults');
module.exports = Morpho;
