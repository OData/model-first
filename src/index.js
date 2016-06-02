//require('./src/simpleYamlWorker.js');
require('./morpho');
require('./visitor');
require('./modules/modCsdl');
require('./modules/modJson');
require('./modules/modSwagger');
require('./modules/modYaml');
require('./conventions/convAddDefaults');
module.exports = Morpho;
