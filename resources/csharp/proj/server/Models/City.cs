namespace CodefirstRestierSvc.Models
{
    #region Namespace.
    using System.ComponentModel.DataAnnotations.Schema;
    #endregion

    [ComplexType]
    public class City
    {
        public string CountryRegion { get; set; }

        public string Name { get; set; }

        public string Region { get; set; }

        public bool HasValue
        {
            get
            {
                return (this.Name != null || this.Region != null || this.CountryRegion != null);
            }
        }
    }
}