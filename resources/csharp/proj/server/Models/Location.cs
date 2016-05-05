namespace CodefirstRestierSvc.Models
{
    #region Namespace.
    using System.ComponentModel.DataAnnotations.Schema;
    #endregion

    [ComplexType]
    public class Location
    {
        public Location() 
        {
            this.City = new City();
        }

        public string Address { get; set; }

        public City City { get; set; }

        public bool HasValue
        {
            get
            {
                return (this.Address != null || this.City != null);
            }
        }
    }
}