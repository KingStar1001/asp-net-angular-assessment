using System.ComponentModel.DataAnnotations;

namespace event_system.Models
{
    public class Guest
    {
        public int? ID { get; set; }
        [Required]
        public string? FirstName { get; set; }
        [Required]
        public string? LastName { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        public DateTime DOB { get; set; }
        public virtual ICollection<Allergy> Allergies { get; set; } = new List<Allergy>();
        public virtual ICollection<Event> Events { get; set; } = new List<Event>();

        public void clone(Guest other)
        {
            FirstName = other.FirstName;
            LastName = other.LastName;
            Email = other.Email;
            DOB = other.DOB;
        }
    }
}
