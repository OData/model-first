namespace %s
{
    #region Namespace.
    using System.Web.Http;
    using Microsoft.Restier.Publishers.OData;
    using Microsoft.Restier.Publishers.OData.Batch;
    using Api;
    #endregion

    public static class WebApiConfig
    {
        public static async void Register(HttpConfiguration config)
        {
            await config.MapRestierRoute<DemoApi>("OData", "demo", new RestierBatchHandler(GlobalConfiguration.DefaultServer));
        }
    }
}