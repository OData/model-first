namespace CodefirstRestierSvc.Models
{
    #region Namespace.
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    #endregion

    public class Person
    {
        [Key]
        public int PersonId { get; set; }

        public string PersonName { get; set; }

        public PersonGender Gender { get; set; }

        public int Age { get; set; }

        public virtual Photo Photo { get; set; }

        public virtual ICollection<Event> Events { get; set; }
    }
}