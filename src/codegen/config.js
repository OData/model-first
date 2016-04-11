exports.Constants = {
    Port: 9002,
    Paths: {
        Static: '../../',
		ToDoMetadataSample: './public/samples/todo_metadata.json',
        TripPinMetadataSample: './public/samples/trippin_metadata.json',
        CSharpCode: './public/client/csharp/code/',
        CSharpProj: './public/client/csharp/proj/',
        CSharpPackage: './public/client/csharp/packages/',
        CSharpZipPackage: './public/client/csharp/zips/',
		Views: './views'
    },
    FileNames: {
        CSharpCode: 'ODataClient.cs',
        CSharpZipPackage: 'ODataClientProject.zip',
        CSharpProjFolder: 'odatav4client',
        CSharpProjFile: 'ODataServiceV4Client.csproj',
        CSharpAssemblyFile: 'AssemblyInfo.cs',
        RandomStringLen: 5
    },
    Code: {
        DefaultNamespace: 'OData.Service.V4.Client',
        EntityContainer: 'DefaultContainer',
        Encoding: 'utf8'
    },
    Logs: {
        Err: true,
        Suc: true,
        Info: true
    }
};
