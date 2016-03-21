exports.Constants = {
    Port: 9002,
    Paths: {
        Static: '../../',
		ToDoMetadataSample: './public/samples/todo_metadata.json',
        TripPinMetadataSample: './public/samples/trippin_metadata.json',
        CSharpCode: './public/client/csharp/code/',
        CSharpZipPackage: './public/client/csharp/zip/',
		Views: './views'
    },
    FileNames: {
        CSharpCode: 'ODataClient.cs',
        CSharpZipPackage: 'ODataClientProject.zip'
    },
    Code: {
        DefaultNamespace: 'OData.Service.V4.Client',
        EntityContainer: 'DefaultContainer'
    }
};
