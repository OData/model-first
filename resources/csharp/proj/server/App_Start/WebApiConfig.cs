namespace OData.Service.V4.Server
{
    #region Namespace.
    using System;
    using System.Web.Http;
    using Microsoft.Restier.EntityFramework;
    using Microsoft.Restier.WebApi;
    using Microsoft.Restier.WebApi.Batch;
    using OData.Service.V4.Server.Models;
    #endregion

    public static class WebApiConfig
    {
        public static async void Register(HttpConfiguration config)
        {
            ResetDataSource();
            await config.MapRestierRoute<DbApi<DemoContext>>("OData", "demo", new RestierBatchHandler(GlobalConfiguration.DefaultServer));
        }

        public static DemoContext context = new DemoContext();

        /// <summary>
        /// Reset the data source.
        /// </summary>
        public static void ResetDataSource()
        {
            // If the database information was already exists, delete the current database.
            if (context.Database.Exists())
            {
                context.Database.Delete();
            }
            
            // 
            // TODO: Write the testing date in here.
            // 
        }
    }
}