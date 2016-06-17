var StringHelper = require('../helpers/stringHelper');

var PrimitiveTypeMappings = {
	'edm.binary': 'byte[]', //global::System.Byte[]
	'edm.boolean': 'bool', //global::System.Boolean
	'edm.byte': 'byte', //global::System.Byte
	'edm.date': 'global::System.DateTime.Date',
	'edm.datetimeoffset': 'global::System.DateTimeOffset',
	'edm.decimal': 'decimal', //global::System.Decimal
	'edm.double': 'double', //global::System.Double
	'edm.duration': 'global::System.TimeSpan', 
	'edm.guid': 'global::System.Guid',
	'edm.int16': 'short', //global::System.Int16
	'edm.int32': 'int', //global::System.Int32
	'edm.int64': 'long', //global::System.Int64
	'edm.sbyte': 'sbyte', //global::System.Sbyte
	'edm.single': 'float', //global::System.Single
	'edm.stream': 'global::Microsoft.OData.Client.DataServiceStreamLink',
	'edm.string': 'string', //global::System.String
    'edm.timeofday': 'global::System.DateTime.TimeOfDay',
    'edm.geography': 'global::Microsoft.Spatial.Geography',
    'edm.geographypoint': 'global::Microsoft.Spatial.GeographyPoint',
    'edm.geographylinestring': 'global::Microsoft.Spatial.GeographyLineString',
    'edm.geographypolygon': 'global::Microsoft.Spatial.GeographyPolygon',
    'edm.geographymultipoint': 'global::Microsoft.Spatial.GeographyMultiPoint',
    'edm.geographymultilinestring': 'global::Microsoft.Spatial.GeographyMultiLineString',
    'edm.geographymultipolygon': 'global::Microsoft.Spatial.GeographyMultiPolygon',
    'edm.geographycollection': 'global::Microsoft.Spatial.GeographyCollection',
    'edm.geometry': 'global::Microsoft.Spatial.Geometry',
    'edm.geometrypoint': 'global::Microsoft.Spatial.GeometryPoint',
    'edm.geometrylinestring': 'global::Microsoft.Spatial.GeometryLineString',
    'edm.geometrypolygon': 'global::Microsoft.Spatial.GeometryPolygon',
    'edm.geometrymultipoint': 'global::Microsoft.Spatial.GeometryMultiPoint',
    'edm.geometrymultilinestring': 'global::Microsoft.Spatial.GeometryMultiLineString',
    'edm.geometrymultipolygon': 'global::Microsoft.Spatial.GeometryMultiPolygon',
    'edm.geometrycollection': 'global::Microsoft.Spatial.GeometryCollection'
};

var RefTypes = [
    'edm.binary', 'edm.string', 'edm.stream', 'edm.geography', 'edm.geographypoint',
    'edm.geographylinestring', 'edm.geographypolygon', 'edm.geographymultipoint', 'edm.geographymultilinestring', 'edm.geographymultipolygon',
    'edm.geographycollection', 'edm.geometry', 'edm.geometrypoint', 'edm.geometrylinestring', 'edm.geometrypolygon',
    'edm.geometrymultipoint', 'edm.geometrymultilinestring', 'edm.geometrymultipolygon', 'edm.geometrycollection'
];

exports.MapType = function(type){
    var isRefType = false;
    if(PrimitiveTypeMappings[type]){
        isRefType = RefTypes.indexOf(type) == -1 ? false : true;

        return { type: PrimitiveTypeMappings[type], isPrimitive: true, isRefType: isRefType };
    }
    else{
        return { type: StringHelper.capitalizeInitial(type), isPrimitive: false, isRefType: true };
    }
};