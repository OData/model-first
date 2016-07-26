exports.Constants = {
    Port: process.env.PORT || 9002,
    Paths: {
        Static: '../../public/',
		ToDoMetadataSample: './public/samples/todo_metadata.json',
        TripPinMetadataSample: './public/samples/trippin_metadata.json',

        // CSharp client code files' path.
        CSharpProj: './resources/csharp/proj/client/',
        CSharpPackage: './public/client/csharp/packages/',
        CSharpZipPackage: './public/client/csharp/zips/',

        // CSharp server code files' path.
        ServerCSharpProj: './resources/csharp/proj/server/',
        ServerCSharpPackage: './public/server/csharp/packages/',
        ServerCSharpZipPackage: './public/server/csharp/zips/',

		Views: './views'
    },
    FileNames: {
        // CSharp client code files' name.
        CSharpCode: 'ODataClient.cs',
        CSharpZipPackage: 'odatav4client',
        CSharpProjFolder: 'odatav4client',
        CSharpProjFile: 'ODataServiceV4Client.csproj',

        // CSharp server code files' name.
        ServerCSharpZipPackage: 'odatav4server', // new added.
        ServerCSharpProjFolder: 'odatav4server', // new added.
        ServerCSharpProjFile: 'ODataServiceV4Server.csproj', // new added.

        CSharpAssemblyFile: 'AssemblyInfo.cs',
        RandomStringLen: 5
    },
    Code: {
        DefaultNamespace: 'OData.Service.V4.Client',
        ServerDefaultNamespace: 'OData.Service.V4.Server',
        EntityContainer: 'DefaultContainer',
        Encoding: 'utf8'
    },
    Logs: {
        Err: true,
        Suc: true,
        Info: true
    }
};
