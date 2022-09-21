using event_system.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace event_system.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuestController : ControllerBase
    {
        private readonly EventSystemContext _dbContext;

        public GuestController(EventSystemContext dbContext)
        {
            _dbContext = dbContext;
        }
        // GET: api/Guest
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Guest>>> GetGuests()
        {
            if (_dbContext.Guests == null)
            {
                return NotFound();
            }
            return await _dbContext.Guests.Include(x => x.Allergies).ToListAsync();
        }

        // GET: api/Guest/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Guest>> GetGuest(int id)
        {
            if (_dbContext.Guests == null)
            {
                return NotFound();
            }
            var guest = await _dbContext.Guests.Where(x => x.ID == id).Include(x => x.Allergies).FirstOrDefaultAsync();

            if (guest == null)
            {
                return NotFound();
            }

            return guest;
        }

        // POST: api/Guest
        [HttpPost]
        public async Task<ActionResult<Guest>> PostGuest(Guest guest)
        {
            Guest element = new Guest();
            element.clone(guest);
            _dbContext.Guests.Add(element);
            await AddAllergies(element, guest.Allergies.ToList());
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGuest), new { id = guest.ID }, guest);
        }

        // PUT: api/Guest/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGuest(int id, Guest guest)
        {
            if (id != guest.ID)
            {
                return BadRequest();
            }

            try
            {

                var activeGuest = await _dbContext.Guests.Where(x => x.ID == id)
                            .Include(x => x.Allergies).FirstOrDefaultAsync();

                activeGuest?.clone(guest);

                await AddAllergies(activeGuest, guest.Allergies.ToList());
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GuestExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Guest/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGuest(int id)
        {
            if (_dbContext.Guests == null)
            {
                return NotFound();
            }

            var guest = await _dbContext.Guests.FindAsync(id);
            if (guest == null)
            {
                return NotFound();
            }

            _dbContext.Guests.Remove(guest);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        private bool GuestExists(long id)
        {
            return (_dbContext.Guests?.Any(e => e.ID == id)).GetValueOrDefault();
        }

        private async Task<bool> AddAllergies(Guest guest, IList<Allergy> _allergies)
        {
            int index = 0;
            while (index < guest.Allergies.Count)
            {
                var allergy = guest.Allergies.ElementAt(index);
                var _allergy = _allergies.Where(x => x.Name.ToUpper() == allergy.Name?.ToUpper()).FirstOrDefault();
                if (_allergy == null)
                    guest.Allergies.Remove(allergy);
                else
                {
                    _allergies.Remove(_allergy);
                    index++;
                }
            }
            foreach (Allergy allergyM in _allergies)
            {
                Allergy allergy = null!;
                if (allergyM!.ID > 0)
                    allergy = await _dbContext.Allergies.Where(x => x.ID == allergyM.ID).FirstOrDefaultAsync();
                else
                {
                    allergy = await _dbContext.Allergies.Where(x => x.Name == allergyM.Name).FirstOrDefaultAsync();
                    if (allergy == null)
                        allergy = new Allergy(allergyM.Name);
                }
                guest.Allergies.Add(allergy);
            }
            return true;
        }
    }
}
