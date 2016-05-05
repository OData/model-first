namespace CodefirstRestierSvc.Models
{
    #region Namespace.
    using System;
    #endregion

    public class Event
    {
        public Event()
        {
            Location = new Location();
        }

        public int EventId { get; set; }

        public string EventName { get; set; }

        public string EventDescription { get; set; }

        public Location Location { get; set; }

        public DateTime Time { get; set; }
    }
}