using Microsoft.EntityFrameworkCore;

namespace event_system.Models
{
    public class EventSystemContext : DbContext
    {
        public EventSystemContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Guest> Guests { get; set; } = null!;
        public DbSet<Allergy> Allergies { get; set; } = null!;
        public DbSet<Event> Events { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Guest
            modelBuilder.Entity<Guest>().HasIndex(x => x.Email).IsUnique();

            // Allergy
            modelBuilder.Entity<Allergy>().HasIndex(x => x.Name).IsUnique();
        }
    }
}
