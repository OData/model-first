var StringHelper = require('../helpers/stringhelper');

var PrimitiveTypeMappings = {
	'edm.binary': 'global::System.Byte[]',
	'edm.boolean': 'global::System.Boolean',
	'edm.byte': 'global::System.Byte',
	'edm.date': '',
	'edm.datetimeoffset': 'global::System.Nullable<global::System.DateTimeOffset>',
	'edm.decimal': 'global::System.Decimal',
	'edm.double': 'global::System.Double',
	'edm.duration': 'global::System.Nullable<global::System.TimeSpan>',
	'edm.guid': 'global::System.Guid',
	'edm.int16': 'global::System.Int16',
	'edm.int32': 'global::System.Int32',
	'edm.int64': 'global::System.Int64',
	'edm.sbyte': 'global::System.Sbyte',
	'edm.single': 'global::System.Single',
	'edm.stream': 'global::Microsoft.OData.Client.DataServiceStreamLink',
	'edm.string': 'global::System.String',
	'edm.timeofday': '',
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

exports.MapType = function(type){
	if(PrimitiveTypeMappings[type]){
		return PrimitiveTypeMappings[type];
	}
	else{
		return StringHelper.capitalizeInitial(type);
	}
};