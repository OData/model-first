namespace %s
{
    #region Namespace.
    using System.Web.Http;
    using Restier.Publishers.OData;
    using Restier.Publishers.OData.Batch;
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