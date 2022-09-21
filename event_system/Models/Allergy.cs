using System.ComponentModel.DataAnnotations;

namespace event_system.Models
{
    public class Allergy
    {
        public int ID { get; set; }

        [Required]
        public string? Name { get; set; }

        public virtual ICollection<Guest> Guests { get; set; } = new List<Guest>();

        public Allergy(string name)
        {
            Name = name.Trim();
        }
    }
}
