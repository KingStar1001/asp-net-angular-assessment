using event_system.Models.Attributes;
using System.ComponentModel.DataAnnotations;
using event_system.Dao;

namespace event_system.Models
{
    public class Event
    {
        public int ID { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        [CollectionLength(2)]
        public virtual ICollection<Guest> Guests { get; set; } = new List<Guest>();

        public void clone(EventDao other)
        {
            Name = other.Name;
            Date = other.Date;
        }
    }
}
