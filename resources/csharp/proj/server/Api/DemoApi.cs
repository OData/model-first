using System;
using System.Threading;
using System.Threading.Tasks;
using System.Web.OData.Query;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OData.Edm;
using %s.Submit;
using Microsoft.Restier.Core;
using Microsoft.Restier.Core.Model;
using Microsoft.Restier.Core.Submit;
using Microsoft.Restier.Providers.EntityFramework;

namespace %s.Api
{
    public class DemoApi : EntityFrameworkApi<DemoContext>
    {
        public new DemoContext Context { get { return DbContext; } }

        // Add operations here.

        // Add "allows" here. (allows: [read, create, update, delete])

        protected override IServiceCollection ConfigureApi(IServiceCollection services)
        {
            // Add customized OData validation settings 
            Func<IServiceProvider, ODataValidationSettings> validationSettingFactory = (sp) => new ODataValidationSettings
            {
                MaxAnyAllExpressionDepth = 3,
                MaxExpansionDepth = 3
            };

            return base.ConfigureApi(services)
                .AddSingleton(validationSettingFactory)
                .AddService<IChangeSetItemFilter, CustomizedSubmitProcessor>()
                .AddService<IModelBuilder, TrippinModelExtender>();
        }


        private class TrippinModelExtender : IModelBuilder
        {
            public IModelBuilder InnerHandler { get; set; }

            public async Task<IEdmModel> GetModelAsync(ModelContext context, CancellationToken cancellationToken)
            {
                var model = await InnerHandler.GetModelAsync(context, cancellationToken);

                // Add custom model here.

                return model;
            }
        }
    }
}